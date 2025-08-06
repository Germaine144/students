"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';

const LoginPage = () => {
  // --- STATE MANAGEMENT ---
  // State to hold the form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // State to hold any error messages from the backend
  const [error, setError] = useState('');
  // State to manage the loading status of the button
  const [isLoading, setIsLoading] = useState(false);
  // State to show success modal
  const [showSuccess, setShowSuccess] = useState(false);
  // State to hold user's name for success modal
  const [userName, setUserName] = useState('');

  // Get the router instance for redirection
  const router = useRouter();

  // --- FORM INPUT HANDLER ---
  // This function updates the state whenever a user types in an input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // --- FORM SUBMISSION HANDLER ---
  // This function runs when the user clicks the "Login" button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setIsLoading(true); // Disable the button and show loading state
    setError(''); // Clear any previous errors

    try {
      // The URL of your backend's login endpoint
      const API_URL = 'http://localhost:5000/api/users/login';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the form data as a JSON string
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., status 400), throw an error
        throw new Error(data.msg || 'Something went wrong');
      }

      // If login is successful, show success modal
      setUserName(data.user?.fullName || data.user?.name || 'User'); // Get user name from response
      setShowSuccess(true);
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard'); // or wherever you want to redirect after login
      }, 3000);

    } catch (err: any) {
      // If there's an error, update the error state to display it to the user
      setError(err.message);
    } finally {
      setIsLoading(false); // Re-enable the button
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="max-w-sm w-full">
        <div className="bg-blue-600 rounded-t-2xl shadow-lg">
          <div className="flex justify-center py-12">
            <User className="text-white h-16 w-16" strokeWidth={1.5} />
          </div>
          
          <div className="bg-white px-8 pt-10 pb-8 rounded-tl-[3.5rem] rounded-b-2xl text-black">
            <h2 className="text-3xl font-bold text-center mb-8">
              Login
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* --- ERROR DISPLAY --- */}
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
              
              <div className="mb-5">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="hello@dream.com"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="text-right mt-2">
                  <Link href="#" className="text-xs text-gray-400 hover:text-blue-600 hover:underline transition-colors">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-blue-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Login'}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-blue-600 hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-pulse">
            {/* Blue Header */}
            <div className="bg-blue-600 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold">Welcome Back!</h2>
            </div>
            
            {/* White Content */}
            <div className="p-8 text-center bg-white rounded-b-2xl">
              <h3 className="text-gray-800 text-xl font-bold mb-2">
                Hello, {userName}!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully logged in! You'll be redirected to your dashboard in a few seconds.
              </p>
              
              {/* Loading dots */}
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