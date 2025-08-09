"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Calendar, Camera, Edit, X, Heart } from 'lucide-react';

type StudentProfile = {
  _id: string;
  fullName: string;
  email: string;
  role: 'student';
  phoneNumber?: string;
  courseOfStudy?: string;
  enrollmentYear?: number;
  status?: string;
  createdAt?: string;
};

const StudentDashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showMotivationModal, setShowMotivationModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    courseOfStudy: '',
    enrollmentYear: '',
  });

  const motivationalMessages = [
    { title: "Keep Growing! 🌟", message: "Every step you take in your education is building the foundation for your amazing future. You're doing great!" },
    { title: "You're Amazing! 💪", message: "Remember that success is not final, failure is not fatal. It's the courage to continue that counts. Keep pushing forward!" },
    { title: "Believe in Yourself! ✨", message: "Your potential is limitless. Every challenge you face is making you stronger and wiser. See you soon!" },
    { title: "Stay Inspired! 🚀", message: "Education is the most powerful weapon you can use to change the world. Keep learning, keep growing!" },
    { title: "You've Got This! 🎯", message: "Take a moment to appreciate how far you've come. Your dedication and hard work will pay off. Rest well!" }
  ];

  const getRandomMotivationalMessage = () => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const handleLogoutClick = () => setShowMotivationModal(true);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);
  const confirmLogout = () => {
    setShowMotivationModal(false);
    handleLogout();
  };

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }
      
      // --- THIS IS THE FIRST KEY CHANGE ---
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBaseUrl) throw new Error("API URL is not configured.");
      const endpoint = `${apiBaseUrl}/api/users/profile`;

      const response = await fetch(endpoint, { // Use the dynamic endpoint
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      if (!data || !data._id) {
        setError('We were unable to locate your profile information. Please contact your administrator.');
        setIsLoading(false);
        return;
      }
      
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        courseOfStudy: data.courseOfStudy || '',
        enrollmentYear: data.enrollmentYear?.toString() || '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while fetching your profile.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'student') {
        router.push('/login');
        return;
      }
      fetchProfile();
    } else {
      router.push('/login');
    }
  }, [router, fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // --- THIS IS THE SECOND KEY CHANGE ---
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiBaseUrl) throw new Error("API URL is not configured.");
      const endpoint = `${apiBaseUrl}/api/users/profile`;
      
      const response = await fetch(endpoint, { // Use the dynamic endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update profile');
      }

      await fetchProfile();
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while updating.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- The rest of your component's JSX remains exactly the same ---
  // (No changes needed below this line)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl">Loading Profile...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const joinedDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  const currentMotivation = getRandomMotivationalMessage();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {showMotivationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentMotivation.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{currentMotivation.message}</p>
              <div className="text-sm text-gray-500 mb-6">Thank you for using our Student Management System, {profile?.fullName}! 💙</div>
              <div className="flex space-x-4">
                <button onClick={() => setShowMotivationModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors">Stay Logged In</button>
                <button onClick={confirmLogout} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SMS</h1>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">{profile?.fullName}</span>
            <button onClick={handleLogoutClick} className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-semibold">
              <LogOut size={18} />
              <span className='cursor-pointer'>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">My Profile</h2>
          <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
        </div>

        {error && !isLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">An Error Occurred</h3>
                <div className="mt-2 text-sm text-yellow-700"><p>{error}</p></div>
                <div className="mt-4"><button onClick={() => { setError(''); fetchProfile(); }} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-200">Try Again</button></div>
              </div>
            </div>
          </div>
        )}

        {!error && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center"><User size={48} className="text-white" /></div>
                  <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"><Camera size={16} className="text-blue-600" /></button>
                </div>
                <h3 className="text-xl font-bold">{profile?.fullName}</h3>
                <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full my-2">Student</span>
                <div className="text-gray-500 text-sm flex items-center justify-center space-x-2 mt-2"><Calendar size={14} /><span>Joined {joinedDate}</span></div>
                <button onClick={() => setIsEditing(!isEditing)} className="mt-6 w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"><Edit size={16} /><span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span></button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {isEditing ? (
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="text-lg font-semibold mb-4">Edit Profile</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course of Study</label>
                        <input type="text" name="courseOfStudy" value={formData.courseOfStudy} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
                        <input type="number" name="enrollmentYear" value={formData.enrollmentYear} onChange={handleChange} min="2000" max="2030" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                      <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400">{isLoading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                    <ul className="space-y-3 text-gray-600">
                      <InfoRow label="Full Name" value={profile?.fullName || ''} />
                      <InfoRow label="Email" value={profile?.email || ''} />
                      <InfoRow label="Phone" value={profile?.phoneNumber || 'Not specified'} />
                      <InfoRow label="Course" value={profile?.courseOfStudy || 'Not specified'} />
                      <InfoRow label="Enrollment Year" value={profile?.enrollmentYear?.toString() || 'Not specified'} />
                      <InfoRow label="Status" value={profile?.status || 'Active'} />
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h4 className="text-lg font-semibold mb-4">Account Security</h4>
                    <button className="text-blue-600 font-semibold hover:underline cursor-pointer">Change Password</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <li className="flex justify-between items-center">
    <span className="font-semibold text-gray-800">{label}:</span>
    <span>{value}</span>
  </li>
);

export default StudentDashboard;