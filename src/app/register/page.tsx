"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiBaseUrl}/api/users/register`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.msg && data.msg.includes('already exists')) {
          throw new Error('An account with this email already exists. Please log in instead.');
        }
        throw new Error(data.msg || 'Something went wrong');
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 4000);

    } catch (err: unknown) {
      console.error("Registration failed:", err);
      if (err instanceof Error) {
        if (err.message.includes('fetch')) {
             setError('Could not connect to the server. Please try again later.');
        } else {
             setError(err.message);
        }
      } else {
        setError('An unexpected registration error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
        <div className="max-w-sm w-full">
            <div className="bg-blue-600 rounded-t-2xl shadow-lg">
                <div className="p-8 text-center">
                    <h1 className="text-white text-3xl font-bold">Sign Up</h1>
                </div>
                <div className="bg-white px-8 pt-10 pb-8 rounded-tl-[3.5rem] rounded-b-2xl">
                    <form onSubmit={handleSubmit} noValidate>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        <div className="mb-5">
                            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
                            <input id="fullName" type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">E-mail</label>
                            <input id="email" type="email" placeholder="your.email@example.com" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="••••••••••" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-6">
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </div>
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-blue-600 hover:underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
        
        {/* PROFESSIONAL SUCCESS MODAL */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-pulse">
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2">Registration Successful!</h2>
                        <p className="text-blue-100 text-sm">Welcome to the Student Management System</p>
                    </div>
                    <div className="p-8 text-center bg-white rounded-b-2xl">
                        <h3 className="text-gray-800 text-xl font-bold mb-3">Welcome, {formData.fullName}!</h3>
                        <div className="text-gray-600 text-sm leading-relaxed space-y-2 mb-6">
                            <p className="font-semibold">Your account has been successfully created.</p>
                            <p>You can now access all student features including:</p>
                            <div className="bg-gray-50 rounded-lg p-4 mt-3">
                                <ul className="text-left space-y-1 text-xs">
                                    <li>• Profile management and updates</li>
                                    <li>• Course enrollment and tracking</li>
                                    <li>• Academic progress monitoring</li>
                                    <li>• Communication with administrators</li>
                                </ul>
                            </div>
                            <p className="font-medium text-blue-600 mt-4">You will be redirected to the login page shortly.</p>
                        </div>
                        <div className="flex justify-center space-x-1 mb-4">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <button 
                            onClick={() => router.push('/login')}
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Continue to Login
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SignUpPage;