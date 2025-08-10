"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard } from 'lucide-react';

type User = {
  fullName: string;
  role: 'admin' | 'student';
};

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh(); 
  };
  
  // --- THE FIX ---
  // The 'if' statement that returned null has been REMOVED.
  // The Navbar will now render on ALL pages.

  const dashboardPath = user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SMS
        </Link>
        
        <nav className="flex items-center space-x-6">
          {user ? (
            // Logged-in User View
            <>
              <span className="text-gray-700 font-medium hidden sm:block">
                Welcome, {user.fullName}!
              </span>
              <Link
                href={dashboardPath}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // Logged-out User View
            <>
              {/* Only show Login button if NOT on the login page */}
              {pathname !== '/login' && (
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Login
                </Link>
              )}
              {/* Only show Register button if NOT on the register page */}
              {pathname !== '/register' && (
                <Link href="/register" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;