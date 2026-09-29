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
      await signupUser(data);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data || 'Failed to create account';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-indigo-600">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Join the platform</p>

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
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              {...register('username', { required: true })}
              type="text"
              placeholder="e.g. mubashar"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Role</label>
            <select
              {...register('role')}
              defaultValue="user"
              className="w-full p-2 border rounded mt-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="user">Normal User</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-400"
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