"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Heart } from 'lucide-react';

type User = {
  fullName: string;
  role: 'admin' | 'student';
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for the modal
  const [currentMotivation, setCurrentMotivation] = useState({ title: '', message: '' });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [pathname]);

  // --- LOGIC MOVED FROM DASHBOARD TO NAVBAR ---
  const motivationalMessages = [
    { title: "Keep Growing! 🌟", message: "Every step you take is building the foundation for your amazing future. You're doing great!" },
    { title: "You're Amazing! 💪", message: "Success is not final, failure is not fatal. It's the courage to continue that counts. Keep pushing!" },
    { title: "Believe in Yourself! ✨", message: "Your potential is limitless. Every challenge makes you stronger. See you soon!" },
  ];

  const handleLogoutClick = () => {
    // Pick a random message and show the modal
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    setCurrentMotivation(randomMessage);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Hide the modal and perform the actual logout
    setShowLogoutModal(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh(); 
  };

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">SMS</Link>
          <nav className="flex items-center space-x-6">
            {user ? (
              // Logged-in User View
              <>
                <span className="text-gray-700 font-medium hidden sm:block">Welcome, {user.fullName}!</span>
                <Link href={dashboardPath} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                  <LayoutDashboard size={20} /><span>Dashboard</span>
                </Link>
                {/* THIS BUTTON NOW OPENS THE MODAL */}
                <button onClick={handleLogoutClick} className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-semibold">
                  <LogOut size={20} /><span>Logout</span>
                </button>
              </>
            ) : (
              // Logged-out User View
              <>
                {pathname !== '/login' && <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Login</Link>}
                {pathname !== '/register' && <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Register</Link>}
              </>
            )}
          </nav>
        </div>
      </header>
      
      {/* --- MODAL JSX MOVED FROM DASHBOARD TO NAVBAR --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentMotivation.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">{currentMotivation.message}</p>
              <div className="text-sm text-gray-500 mb-6">Thank you for using our system, {user?.fullName}! 💙</div>
              <div className="flex space-x-4">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300">Stay Logged In</button>
                <button onClick={confirmLogout} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;