// src/app/signup/page.js
'use client';

import { useForm } from 'react-hook-form';
import { signupUser } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await signupUser(data);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      // Backend validation error ya hook error show karo
      const errorMsg =
        err.response?.data?.message || err.response?.data || 'Failed to create account';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create Account</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm whitespace-pre-wrap">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username (Min 3 chars)</label>
            <input
              {...register('username', { required: true })}
              type="text"
              placeholder="e.g. ali123"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password (Min 6 chars)</label>
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="••••••"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Age (Min 18)</label>
            <input
              {...register('age', { required: true })}
              type="number"
              placeholder="e.g. 22"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              {...register('city', { required: true })}
              type="text"
              placeholder="e.g. lahore (Auto uppercase test)"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              {...register('role', { required: true })}
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-medium"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}