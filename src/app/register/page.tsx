"use client"; // This is crucial for using hooks and handling client-side events

// Import necessary React hooks and components
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use this for redirection in App Router

const SignUpPage = () => {
  // --- STATE MANAGEMENT ---
  // State to hold the form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  // State to hold any error messages from the backend
  const [error, setError] = useState('');
  // State to manage the loading status of the button
  const [isLoading, setIsLoading] = useState(false);
  // State to show success modal
  const [showSuccess, setShowSuccess] = useState(false);

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
  // This function runs when the user clicks the "Sign Up" button
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setIsLoading(true); // Disable the button and show loading state
    setError(''); // Clear any previous errors

    try {
      // The URL of your backend's registration endpoint
      const API_URL = 'http://localhost:5000/api/users/register';
      
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

      // If registration is successful, show success modal
      setShowSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
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
          <div className="p-8 text-center">
            <h1 className="text-white text-3xl font-bold">Sign Up</h1>
          </div>
          <div className="bg-white px-8 pt-10 pb-8 rounded-tl-[3.5rem] rounded-b-2xl">
            {/* Bind the handleSubmit function to the form's onSubmit event */}
            <form onSubmit={handleSubmit} noValidate>
              {/* --- ADDED ERROR DISPLAY --- */}
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
              
              <div className="mb-5">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Wasim Bari"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.fullName} // Bind input value to state
                  onChange={handleChange} // Call handler on change
                  required
                />
              </div>

              {/* I removed the "Last Name" field to match the backend model. 
                  You can add it back if you update the backend model. */}

              <div className="mb-5">
                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="hello@dream.com"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={formData.email} // Bind input value to state
                  onChange={handleChange} // Call handler on change
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
                  value={formData.password} // Bind input value to state
                  onChange={handleChange} // Call handler on change
                  required
                />
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-blue-300"
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:underline">
                  Login
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
              <h2 className="text-white text-2xl font-bold">Success!</h2>
            </div>
            
            {/* White Content */}
            <div className="p-8 text-center bg-white rounded-b-2xl">
              <h3 className="text-gray-800 text-xl font-bold mb-2">
                Welcome, {formData.fullName}!
              </h3>
              <p className="text-gray-600 mb-6">
                Your registration was successful! You'll be redirected to the login page in a few seconds.
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

export default SignUpPage;