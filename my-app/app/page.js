// src/app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-extrabold text-indigo-600">Don Framework Auth</h1>
      <p className="text-gray-600">Full-Stack Auth Integration (Rust + Next.js)</p>
      <div className="flex gap-4 mt-4">
        <Link href="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
          Sign Up
        </Link>
        <Link href="/login" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium">
          Login
        </Link>
      </div>
    </div>
  );
}