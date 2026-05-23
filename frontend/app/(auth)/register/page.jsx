"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <Navbar />

      {/* Split Auth Panel */}
      <div className="flex flex-1 items-stretch justify-center">
        {/* Left Side Panel - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 flex-col justify-between bg-gradient-to-br from-indigo-950/60 via-zinc-950 to-zinc-950 p-12 border-r border-[#2a2a2a] relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-[#6366f1]/5 blur-[120px] pointer-events-none" />
          
          <div className="max-w-md my-auto space-y-8 relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6366f1] bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                MockPrep Premium Platform
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white leading-tight">
                Create Account &<br />Start Preparing.
              </h1>
              <p className="mt-4 text-base text-zinc-400">
                Join thousands of candidates practicing interview loops and elevating their technical communication skills.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">Adaptive Mock Questions</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Custom interviewer prompts across DSA, Systems, HR, and Behavioural.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">Instant Score Card Breakdown</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Receive immediate marks out of 10 along with highlight lists.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  ✓
                </span>
                <div>
                  <h4 className="font-semibold text-white text-sm">Ideal Answer Key</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Compare your responses against benchmark standard architectures.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} MockPrep. All rights reserved.
          </div>
        </div>

        {/* Right Side Panel - Register Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-[#0f0f0f]">
          <div className="w-full max-w-md space-y-8 animate-fadeIn">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Register to start your first session and receive feedback
              </p>
            </div>

            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 shadow-2xl">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-zinc-300"
                  >
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-white placeholder-zinc-500 transition duration-150 ease-in-out focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-zinc-300"
                  >
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-white placeholder-zinc-500 transition duration-150 ease-in-out focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-zinc-300"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-white placeholder-zinc-500 transition duration-150 ease-in-out focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1]"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button type="submit" loading={loading} className="w-full mt-4">
                  Create Account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-[#6366f1] hover:text-[#5053e1] transition"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
