// Assuming your file is located at something like 'app/signup/page.tsx' or 'pages/signup.tsx'

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
      // --- THIS IS THE KEY CHANGE ---
      // 1. Get the base URL from the environment variable set in Vercel.
      //    It MUST start with NEXT_PUBLIC_ to be accessible in the browser.
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      // 2. Check if the variable is set. This helps with debugging.
      if (!apiBaseUrl) {
        throw new Error("API URL is not configured. Please contact the administrator.");
      }
      
      // 3. Construct the full endpoint URL for the fetch request.
      const endpoint = `${apiBaseUrl}/api/users/register`;
      
      const response = await fetch(endpoint, { // Use the dynamically created endpoint URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // --- The rest of the function remains the same ---
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
      }, 3000);

    } catch (err: unknown) {
      console.error("Registration failed:", err); // Log the real error for debugging
      if (err instanceof Error) {
        // Provide a user-friendly error message
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
        {/* SUCCESS MODAL */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                    <div className="p-8 text-center">
                        <h3 className="text-gray-800 text-xl font-bold mb-2">Welcome, {formData.fullName}!</h3>
                        <p className="text-gray-600">Your registration was successful!</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default SignUpPage;