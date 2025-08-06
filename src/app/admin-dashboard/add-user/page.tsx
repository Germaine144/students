// src/app/admin-dashboard/add-user/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Phone, BookOpen, Briefcase, User as UserIcon, Camera } from 'lucide-react';

// Define a specific type for the InputField component's props
type InputFieldProps = {
  label: string;
  name: string;
  type?: string; // Optional because it has a default value
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode; // ReactNode is the correct type for icon components
  placeholder: string;
};

// Helper component for styled input fields with the new props type
const InputField = ({ label, name, type = "text", value, onChange, icon, placeholder }: InputFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
      <input type={type} name={name} id={name} value={value} onChange={onChange} required className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder={placeholder} />
    </div>
  </div>
);

const AddUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    courseOfStudy: '',
    password: 'password123', // Admin sets a default password
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication error. Please log in again.');
      
      const response = await fetch('http://localhost:5000/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Failed to add user');

      router.push('/admin-dashboard');

    // Handle the error safely by checking its type
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Create a New User</h1>
          </div>
          <Link href="/admin-dashboard" className="bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300">
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} noValidate>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-6">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={<UserIcon size={16} />} placeholder="Enter full name" />
              <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail size={16} />} placeholder="Enter email address" />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} icon={<Phone size={16} />} placeholder="Enter phone number" />
              <InputField label="Course of Study" name="courseOfStudy" value={formData.courseOfStudy} onChange={handleChange} icon={<BookOpen size={16} />} placeholder="Enter course of study" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select name="role" value={formData.role} onChange={handleChange} className="pl-9 w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
                  <div className="space-y-1 text-center">
                    <Camera size={48} className="mx-auto text-gray-400" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">Click to upload image</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
               <Link href="/admin-dashboard" className="bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isLoading ? 'Creating User...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;