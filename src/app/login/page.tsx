"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, X, AlertCircle, BookOpen, GraduationCap, Star, Trophy, Target, Zap } from 'lucide-react';

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
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = `${apiBaseUrl}/api/users/login`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

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
      console.error("Login failed:", err);
      if (err instanceof Error && err.message.toLowerCase().includes('invalid credentials')) {
        setError('Email not found or password incorrect. Please try again or create an account.');
      } else if (err instanceof Error) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* ATTRACTIVE ANIMATED BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-lg rotate-45 opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-indigo-400 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-32 w-14 h-14 bg-blue-400 rounded-lg opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating icons */}
        <div className="absolute top-32 right-40 text-blue-300 opacity-30 animate-float">
          <BookOpen size={32} />
        </div>
        <div className="absolute bottom-40 left-40 text-purple-300 opacity-25 animate-float" style={{animationDelay: '2s'}}>
          <GraduationCap size={28} />
        </div>
        <div className="absolute top-60 left-32 text-indigo-300 opacity-20 animate-float" style={{animationDelay: '1.5s'}}>
          <Star size={24} />
        </div>
        <div className="absolute bottom-60 right-20 text-blue-400 opacity-30 animate-float" style={{animationDelay: '3s'}}>
          <Trophy size={26} />
        </div>
        <div className="absolute top-80 right-60 text-purple-400 opacity-25 animate-float" style={{animationDelay: '0.8s'}}>
          <Target size={22} />
        </div>
        <div className="absolute bottom-80 left-60 text-indigo-400 opacity-30 animate-float" style={{animationDelay: '2.5s'}}>
          <Zap size={20} />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'drift 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Inspirational text overlay */}
      <div className="absolute top-8 left-8 right-8 text-center z-10">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2 opacity-90">
          Shape Your Future
        </h1>
        <p className="text-blue-200 text-lg opacity-80">
          Where Learning Meets Innovation
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl shadow-lg">
              <div className="flex justify-center py-12">
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                  <User className="text-white h-16 w-16" strokeWidth={1.5} />
                </div>
              </div>
              <div className="bg-white px-8 pt-10 pb-8 rounded-tl-[3.5rem] rounded-b-2xl text-black">
                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-gray-500 text-center mb-8">Access your learning journey</p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-5">
                    <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="email">E-mail</label>
                    <input id="email" type="email" placeholder="hello@dream.com" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••••" className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={formData.password} onChange={handleChange} required />
                    <div className="text-right mt-2">
                      <Link href="#" className="text-xs text-gray-400 hover:text-blue-600 hover:underline transition-colors" onClick={(e) => {
                        e.preventDefault();
                        alert('Please contact your administrator to reset your password or use the default password provided when your account was created.');
                      }}>
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-blue-300 disabled:to-purple-300 transition-all transform hover:scale-105" disabled={isLoading}>
                      {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    Don&lsquo;t have an account?{' '}
                    <Link href="/register" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
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
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-t-2xl p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50px, -50px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;