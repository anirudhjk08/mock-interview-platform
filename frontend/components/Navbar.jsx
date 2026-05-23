"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const isLoggedIn = !!user;

  return (
    <nav className="border-b border-[#2a2a2a] bg-[#0f0f0f]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side: Brand */}
          <div className="flex items-center gap-8">
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="flex items-center gap-2 font-black text-xl text-white tracking-tight hover:opacity-90 transition">
              <span className="bg-[#6366f1] text-white p-1.5 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span>MockPrep</span>
            </Link>

            {/* Navigation links */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-semibold transition-colors duration-150 ${
                    pathname === '/dashboard'
                      ? 'text-[#6366f1]'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/interview/setup"
                  className={`text-sm font-semibold transition-colors duration-150 ${
                    pathname.startsWith('/interview')
                      ? 'text-[#6366f1]'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  New Interview
                </Link>
              </div>
            )}
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#a1a1aa] hidden sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-[#ffffff] px-4 py-2 text-sm font-semibold transition duration-150 ease-in-out hover:text-rose-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                    pathname === '/login' ? 'text-white bg-[#1a1a1a] border border-[#2a2a2a]' : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#6366f1] hover:bg-[#5053e1] text-white px-4 py-2 text-sm font-semibold transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
