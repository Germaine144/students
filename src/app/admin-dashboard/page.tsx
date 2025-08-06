"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield } from 'lucide-react';

// Define a type for our user data for better TypeScript support
type User = {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState({ fullName: '' });

  // --- DATA FETCHING ---
  // useEffect runs when the component mounts
  useEffect(() => {
    // Check for admin user info in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Route protection: if not an admin, redirect to login
      if (parsedUser.role !== 'admin') {
        router.push('/login');
        return; // Stop execution
      }
      setAdminUser(parsedUser);
    } else {
      // If no user info, redirect to login
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const API_URL = 'http://localhost:5000/api/users';
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token for authentication
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]); // Dependency array with router

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {adminUser.fullName}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">User Management</h2>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}

        {/* --- USERS TABLE --- */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Placeholder buttons for future functionality */}
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;