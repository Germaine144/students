// Assuming your file is located at something like 'app/login/page.tsx' or 'pages/login.tsx'

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, X, AlertCircle } from 'lucide-react';

type LoginApiResponse = {
  token: string;
  user: { fullName: string; role: 'admin' | 'student'; };
  msg?: string;
};

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userName, setUserName] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowErrorModal(false);

    try {
      // --- THIS IS THE KEY CHANGE ---
      // 1. Get the base URL from the environment variable set in Vercel.
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      // 2. Check if the variable is set to help with debugging.
      if (!apiBaseUrl) {
        throw new Error("API URL is not configured. Please contact the administrator.");
      }

      // 3. Construct the full, dynamic endpoint URL for the login request.
      const endpoint = `${apiBaseUrl}/api/users/login`;
      
      const response = await fetch(endpoint, { // Use the dynamically created endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // --- The rest of the function remains the same ---
      const data: LoginApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }

      setUserName(data.user?.fullName || 'User');
      setShowSuccess(true);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      const redirectPath = data.user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

      setTimeout(() => {
        router.push(redirectPath);
      }, 2000);

    } catch (err: unknown) {
      console.error("Login failed:", err); // Log the real error for debugging
      if (err instanceof Error && err.message.toLowerCase().includes('invalid credentials')) {
        setError('Email not found or password incorrect. Please try again or create an account.');
      } else if (err instanceof Error) {
        // Provide a user-friendly message for fetch errors
        if (err.message.includes('fetch')) {
          setError('Could not connect to the server. Please try again later.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="max-w-sm w-full">
        <div className="bg-blue-600 rounded-t-2xl shadow-lg">
          <div className="flex justify-center py-12">
            <User className="text-white h-16 w-16" strokeWidth={1.5} />
          </div>
          <div className="bg-white px-8 pt-10 pb-8 rounded-tl-[3.5rem] rounded-b-2xl text-black">
            <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">E-mail</label>
                <input id="email" type="email" placeholder="hello@dream.com" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="••••••••••" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={formData.password} onChange={handleChange} required />
                <div className="text-right mt-2">
                  <Link href="#" className="text-xs text-gray-400 hover:text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    alert('Please contact your administrator to reset your password or use the default password provided when your account was created.');
                  }}>
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="mb-6">
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
                  {isLoading ? 'Logging In...' : 'Login'}
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Don&lsquo;t have an account?{' '}
                <Link href="/register" className="font-bold text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* ERROR MODAL */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-pulse">
            <div className="bg-red-500 rounded-t-2xl p-6 text-center relative">
              <button
                onClick={closeErrorModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-white text-2xl font-bold">Login Failed</h2>
            </div>
            <div className="p-8 text-center bg-white rounded-b-2xl">
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">{error}</p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={closeErrorModal}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/register"
                  className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-center block"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* SUCCESS MODAL */}
      {showSuccess && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-pulse">
            <div className="bg-blue-600 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold">Welcome Back!</h2>
            </div>
            <div className="p-8 text-center bg-white rounded-b-2xl">
              <h3 className="text-gray-800 text-xl font-bold mb-2">Hello, {userName}!</h3>
              <p className="text-gray-600 mb-6">You are being redirected to your dashboard...</p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;