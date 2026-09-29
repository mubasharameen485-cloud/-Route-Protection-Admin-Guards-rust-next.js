// src/app/login/page.js
'use client';

import { useForm } from 'react-hook-form';
import { loginUserApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const res = await loginUserApi(data);
      if (res.token) {
        // Decode token to check role
        const decoded = jwtDecode(res.token);
        login(res.token);

        // Smart Redirect: Role dekh kar sahi dashboard bhejo
        if (decoded.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || 'Invalid username or password';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-indigo-600">Login Portal</h1>
        <p className="text-sm text-gray-500 text-center mb-6">User & Admin Login</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register('username', { required: true })}
              type="text"
              placeholder="e.g. admin_boss or username"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="••••••"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-medium"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Need an account?{' '}
          <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
            Register User
          </Link>
        </p>
      </div>
    </div>
  );
}