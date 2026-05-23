"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const TOPICS = [
  {
    id: 'DSA',
    name: 'DSA',
    description: 'Data Structures & Algorithms, Problem Solving',
    icon: (
      <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'System Design',
    name: 'System Design',
    description: 'Architecture, Scalability, Databases, Microservices',
    icon: (
      <svg className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'HR',
    name: 'HR',
    description: 'Culture fit, career aspirations, resume discussion',
    icon: (
      <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'Behavioural',
    name: 'Behavioural',
    description: 'Conflict resolution, leadership, situational questions',
    icon: (
      <svg className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const DIFFICULTIES = [
  {
    id: 'Easy',
    name: 'Easy',
    color: 'emerald',
    borderColor: 'border-emerald-500',
    selectedBg: 'bg-emerald-500/10',
    hoverBorder: 'hover:border-emerald-500/40',
    dotColor: 'bg-emerald-400',
  },
  {
    id: 'Medium',
    name: 'Medium',
    color: 'amber',
    borderColor: 'border-amber-500',
    selectedBg: 'bg-amber-500/10',
    hoverBorder: 'hover:border-amber-500/40',
    dotColor: 'bg-amber-400',
  },
  {
    id: 'Hard',
    name: 'Hard',
    color: 'rose',
    borderColor: 'border-rose-500',
    selectedBg: 'bg-rose-500/10',
    hoverBorder: 'hover:border-rose-500/40',
    dotColor: 'bg-rose-400',
  },
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    setPageLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleStartInterview = async () => {
    if (!selectedTopic) {
      toast.error('Please select an interview topic');
      return;
    }
    if (!selectedDifficulty) {
      toast.error('Please select a difficulty level');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/sessions', {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
      });
      toast.success('Interview session created!');
      router.push(`/interview/session?sessionId=${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
        <header className="border-b border-zinc-800 bg-zinc-900/30 px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
            <div className="flex items-center gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-800" />
            </div>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      {/* Sticky Header */}
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

      {/* Main Setup Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl space-y-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Setup Your Interview
            </h1>
            <p className="mt-2 text-zinc-400">
              Choose your topic and difficulty to start
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl space-y-8">
            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-4">
                Select Topic
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`group flex items-start text-left p-5 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                          : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition mr-4">
                        {topic.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-indigo-400 transition">
                          {topic.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-4">
                Select Difficulty
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? `border-2 ${diff.borderColor} ${diff.selectedBg}`
                          : `border-zinc-800 bg-zinc-900/30 ${diff.hoverBorder} hover:bg-zinc-900/50`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${diff.dotColor}`} />
                        <span className="font-semibold text-white capitalize">{diff.name}</span>
                      </div>
                      <svg
                        className={`h-5 w-5 transition-transform duration-150 ${
                          isSelected ? 'text-white scale-100' : 'text-transparent scale-0'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-6 border-t border-zinc-800">
              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 hover:shadow-indigo-500/30 disabled:opacity-50"
              >
                {loading ? (
                  <svg
                    className="h-6 w-6 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Start Interview'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
