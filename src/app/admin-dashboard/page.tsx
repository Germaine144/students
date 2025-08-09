// src/app/admin-dashboard/page.tsx

"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Shield, UserPlus, Trash2, Edit, RefreshCw, AlertTriangle, X } from 'lucide-react';

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  phoneNumber?: string;
  courseOfStudy?: string;
  status?: 'Active' | 'Graduated' | 'Dropped';
  enrollmentYear?: string;
};

type AdminInfo = {
  fullName: string;
  role: 'admin';
} | null;

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;
  const getTypeStyles = () => {
    switch (type) {
      case 'danger': return { icon: <AlertTriangle className="h-6 w-6 text-red-600" />, confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', iconBg: 'bg-red-100' };
      case 'warning': return { icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />, confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500', iconBg: 'bg-yellow-100' };
      default: return { icon: <AlertTriangle className="h-6 w-6 text-blue-600" />, confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', iconBg: 'bg-blue-100' };
    }
  };
  const styles = getTypeStyles();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>{styles.icon}</div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
              <div className="mt-2"><p className="text-sm text-gray-500">{message}</p></div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button type="button" className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${styles.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2`} onClick={() => { onConfirm(); onClose(); }}>{confirmText}</button>
            <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={onClose}>{cancelText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState<AdminInfo>(null);
  const [courseFilter, setCourseFilter] = useState('all');
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'delete' | 'role' | 'status'; userId: string; userFullName: string; newStatus?: string; }>({ isOpen: false, type: 'delete', userId: '', userFullName: '', });

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  // --- API BASE URL --- This is the central place to get the API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchUsers = useCallback(async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleLogout(); return; }
      if (!API_BASE_URL) throw new Error("API URL is not configured.");

      // --- FIX #1 ---
      const endpoint = `${API_BASE_URL}/api/admin/users`;
      const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });

      if (response.status === 401 || response.status === 403) { handleLogout(); return; }
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.msg || 'Failed to fetch users'); }
      
      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) { setError(err.message); } else { setError('An unexpected error occurred while fetching users.'); }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout, API_BASE_URL]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') { router.push('/login'); return; }
      setAdminUser(parsedUser);
      fetchUsers();
    } else {
      router.push('/login');
    }
  }, [router, fetchUsers]);

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!API_BASE_URL) throw new Error("API URL is not configured.");

      // --- FIX #2 ---
      const endpoint = `${API_BASE_URL}/api/admin/users/${userId}`;
      const response = await fetch(endpoint, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to delete user.');
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) { setError(err.message); } else { setError('An unexpected error occurred during deletion.'); }
    }
  };

  const handleRoleChange = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!API_BASE_URL) throw new Error("API URL is not configured.");
      
      // --- FIX #3 ---
      const endpoint = `${API_BASE_URL}/api/admin/users/${userId}/role`;
      const response = await fetch(endpoint, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to update role.');
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) { setError(err.message); } else { setError('An unexpected error occurred while changing role.'); }
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!API_BASE_URL) throw new Error("API URL is not configured.");

      // --- FIX #4 ---
      const endpoint = `${API_BASE_URL}/api/admin/users/${userId}/status`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status.');
      fetchUsers();
    } catch (err: unknown) {
      if (err instanceof Error) { setError(err.message); } else { setError('An unexpected error occurred while changing status.'); }
    }
  };

  const openDeleteModal = (userId: string, userFullName: string) => setModalState({ isOpen: true, type: 'delete', userId, userFullName });
  const openRoleChangeModal = (userId: string, userFullName: string) => setModalState({ isOpen: true, type: 'role', userId, userFullName });
  const openStatusChangeModal = (userId: string, userFullName: string, newStatus: string) => setModalState({ isOpen: true, type: 'status', userId, userFullName, newStatus });
  const closeModal = () => setModalState({ isOpen: false, type: 'delete', userId: '', userFullName: '' });
  const handleConfirmAction = () => {
    const { type, userId, newStatus } = modalState;
    if (type === 'delete') handleDeleteUser(userId);
    if (type === 'role') handleRoleChange(userId);
    if (type === 'status' && newStatus) handleStatusChange(userId, newStatus);
  };
  const getModalContent = () => {
    const { type, userFullName, newStatus } = modalState;
    if (type === 'delete') return { title: 'Delete User', message: `Are you sure you want to delete "${userFullName}"? This action cannot be undone.`, confirmText: 'Delete', type: 'danger' as const };
    if (type === 'role') return { title: 'Change User Role', message: `Are you sure you want to change "${userFullName}"'s role? This will affect their system permissions.`, confirmText: 'Change Role', type: 'warning' as const };
    if (type === 'status') return { title: 'Change User Status', message: `Are you sure you want to change "${userFullName}"'s status to "${newStatus}"?`, confirmText: 'Change Status', type: 'info' as const };
    return { title: 'Confirm Action', message: 'Are you sure you want to proceed?', confirmText: 'Confirm', type: 'info' as const };
  };

  // --- The rest of your component's JSX remains exactly the same ---
  // (No changes needed below this line)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="text-center">
          <p className="text-xl">Loading Dashboard</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {adminUser?.fullName}</span>
          <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">User Management</h2>
          <Link href="/admin-dashboard/add-user" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold">
            <UserPlus size={20} />
            <span>Add New User</span>
          </Link>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course:</label>
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800">
            <option value="all">All Courses</option>
            {Array.from(new Set(users.map(u => u.courseOfStudy).filter(Boolean))).map(course => (<option key={course} value={course}>{course}</option>))}
          </select>
        </div>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.filter(user => courseFilter === 'all' || user.courseOfStudy === courseFilter).map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.courseOfStudy || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.enrollmentYear || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select value={user.status || 'Active'} onChange={(e) => openStatusChangeModal(user._id, user.fullName, e.target.value)} className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${user.status === 'Active' ? 'bg-green-100 text-green-800' : user.status === 'Graduated' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        <option value="Active">Active</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link href={`/admin-dashboard/edit-user/${user._id}`} className="text-gray-500 hover:text-blue-600" title="Edit User"><Edit size={18} /></Link>
                        <button onClick={() => openRoleChangeModal(user._id, user.fullName)} className="text-gray-500 hover:text-indigo-600" title="Change Role"><RefreshCw size={18} /></button>
                        <button onClick={() => openDeleteModal(user._id, user.fullName)} className="text-gray-500 hover:text-red-600" title="Delete User"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={8} className="text-center py-10 text-gray-500">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <ConfirmationModal isOpen={modalState.isOpen} onClose={closeModal} onConfirm={handleConfirmAction} {...getModalContent()} />
    </div>
  );
};

export default AdminDashboard;