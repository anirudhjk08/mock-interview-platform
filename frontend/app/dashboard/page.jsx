"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

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
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSessions(sorted);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.clear();
          router.push('/login');
        } else {
          toast.error('Failed to load past interview sessions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  const getTopicBadgeColor = (topic) => {
    switch (topic) {
      case 'DSA':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'System Design':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'HR':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Behavioural':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
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

  const getStatusColor = (status) => {
    if (status === 'completed') {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <Navbar />

      {/* Main Dashboard Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#2a2a2a] pb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-zinc-400">
              Ready to test your knowledge? Start a mock session.
            </p>
          </div>
          <div>
            <Button
              onClick={() => router.push('/interview/setup')}
              className="flex items-center gap-2"
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
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Start New Interview
            </Button>
          </div>
        </div>

        {/* Sessions Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">
            Past Sessions
          </h2>

          {loading ? (
            <div className="text-center py-20">
              <svg className="h-10 w-10 animate-spin text-[#6366f1] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-zinc-400">Fetching past mock sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-2xl bg-[#1a1a1a]/20">
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
              <button
                onClick={() => router.push('/interview/setup')}
                className="mt-4 inline-flex items-center gap-1.5 text-[#6366f1] hover:text-[#5053e1] font-semibold text-sm transition"
              >
                Start New Interview &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex flex-col justify-between rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all duration-200 hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                    </div>

                    {/* Topic */}
                    <h3 className="text-xl font-bold text-white group-hover:text-[#6366f1] transition mb-2">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-semibold border ${getTopicBadgeColor(session.topic)} mr-2`}>
                        {session.topic}
                      </span>
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
                  <div className="mt-6 pt-4 border-t border-[#2a2a2a] flex flex-col gap-4">
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

                    <Button
                      variant="secondary"
                      onClick={() => router.push(`/interview/summary/${session.id}`)}
                      className="w-full"
                    >
                      View Summary
                    </Button>
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
