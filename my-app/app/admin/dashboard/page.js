// src/app/admin/dashboard/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { getAdminUsers, suspendUserApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [usersList, setUsersList] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // 1. Guard check: Only 'admin' allowed
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        loadUsers();
      }
    }
  }, [user, loading, router]);

  // 2. Fetch users from Rust backend
  const loadUsers = async () => {
    try {
      setFetching(true);
      const data = await getAdminUsers();
      setUsersList(data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch users list');
    } finally {
      setFetching(false);
    }
  };

  // 3. Suspend user action
  const handleSuspend = async (userId) => {
    try {
      setActionLoading(userId);
      setMessage(null);
      setError(null);
      const res = await suspendUserApi(userId);
      setMessage(res.message);

      // Local state update: status toggle kar do bina reload ke
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_suspended: true } : u))
      );
    } catch (err) {
      setError(err.response?.data || 'Failed to suspend user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || (!user && user?.role !== 'admin')) {
    return <div className="text-center mt-20 text-lg">Checking security credentials...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">🛡️ Superuser Admin Panel</h1>
          <p className="text-sm text-gray-500">
            Logged in as: <span className="font-semibold text-indigo-600">{user?.username}</span> (Role: {user?.role})
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">Registered Users Management</h2>
          <button
            onClick={loadUsers}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition"
          >
            Refresh Data
          </button>
        </div>

        {fetching ? (
          <div className="text-center p-8 text-gray-500">Loading users from Rust backend...</div>
        ) : usersList.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No users found in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-4">ID</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {usersList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-mono">{item.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{item.username}</td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold uppercase">
                        {item.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.is_suspended ? (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Suspended
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleSuspend(item.id)}
                        disabled={item.is_suspended || actionLoading === item.id}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                          item.is_suspended
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        {actionLoading === item.id
                          ? 'Updating...'
                          : item.is_suspended
                          ? 'Suspended'
                          : 'Suspend User'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}