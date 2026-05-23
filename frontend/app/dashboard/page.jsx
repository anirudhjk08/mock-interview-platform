"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions');
        // Sort sessions by date (newest first)
        const sortedSessions = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSessions(sortedSessions);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load sessions');
        if (error.response?.status === 401) {
          localStorage.clear();
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
        {/* Skeleton Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/30 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="flex items-center gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-800" />
            </div>
          </div>
        </header>

        {/* Skeleton Body */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-64 animate-pulse rounded bg-zinc-800" />
            <div className="mt-6 h-14 w-52 animate-pulse rounded-xl bg-zinc-800" />
          </div>
          <div className="mt-12">
            <div className="h-6 w-32 animate-pulse rounded bg-zinc-800 mb-6" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/30" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white tracking-wider hover:text-indigo-400 transition">
            <svg
              className="h-6 w-6 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Mock Interview Platform</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-300 hidden sm:inline">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-zinc-400">
            Ready to test your knowledge? Start a mock session.
          </p>
          <Link
            href="/interview/setup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 hover:shadow-indigo-500/35"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Start New Interview
          </Link>
        </div>

        {/* Sessions Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-3">
            Past Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              <svg
                className="mx-auto h-12 w-12 text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-zinc-300">No interviews yet</h3>
              <p className="mt-1 text-sm text-zinc-500">Start your first one to practice and get detailed feedback.</p>
              <Link
                href="/interview/setup"
                className="mt-4 inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium text-sm"
              >
                Start New Interview &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/50"
                >
                  <div>
                    {/* Header: Status & Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          session.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {session.status}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getDifficultyColor(
                          session.difficulty
                        )}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    {/* Topic */}
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition mb-2">
                      {session.topic}
                    </h3>

                    {/* Date */}
                    <p className="text-xs text-zinc-500">
                      Created on{' '}
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Score & View Button */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-col gap-4">
                    {session.status === 'completed' ? (
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-medium text-zinc-400">Average Score</span>
                        <span className="text-2xl font-extrabold text-emerald-400">
                          {session.totalScore}/10
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-medium text-zinc-400">Progress</span>
                        <span className="text-sm font-semibold text-amber-400">
                          In Progress
                        </span>
                      </div>
                    )}

                    <Link
                      href={`/interview/summary/${session.id}`}
                      className="block w-full text-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white py-2 text-sm font-medium transition"
                    >
                      View Summary
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
