"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

const TOPICS = [
  {
    id: 'DSA',
    name: 'DSA',
    description: 'Data Structures & Algorithms, runtime complexity, optimization, and problem-solving patterns.',
    icon: (
      <svg className="h-10 w-10 text-indigo-400 group-hover:scale-110 transition-transform duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 'System Design',
    name: 'System Design',
    description: 'Scale architecture, storage layers, microservices design, API routing, and high availability systems.',
    icon: (
      <svg className="h-10 w-10 text-sky-400 group-hover:scale-110 transition-transform duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'HR',
    name: 'HR',
    description: 'Aspirations, company values fit, work style preference, career background, and compensation expectations.',
    icon: (
      <svg className="h-10 w-10 text-emerald-400 group-hover:scale-110 transition-transform duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'Behavioural',
    name: 'Behavioural',
    description: 'Conflict resolution patterns, team leadership models, feedback responses, and situational challenges.',
    icon: (
      <svg className="h-10 w-10 text-pink-400 group-hover:scale-110 transition-transform duration-250" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    setPageLoading(false);
  }, [router]);

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
      <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white animate-fadeIn">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6366f1] border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <Navbar />

      {/* Main Setup Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="w-full max-w-4xl space-y-10">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Setup Your Interview
            </h1>
            <p className="mt-2 text-zinc-400">
              Select your assessment parameters to trigger the interviewer logic.
            </p>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 shadow-2xl space-y-10">
            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-5">
                Select Topic
              </label>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`group flex items-start text-left p-6 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-[#6366f1] bg-[#6366f1]/10 shadow-lg shadow-indigo-500/5'
                          : 'border-[#2a2a2a] bg-[#0f0f0f]/40 hover:border-zinc-700 hover:bg-[#0f0f0f]/75'
                      }`}
                    >
                      <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-zinc-700 transition mr-5">
                        {topic.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-white group-hover:text-[#6366f1] transition">
                          {topic.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
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
              <label className="block text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-5">
                Select Difficulty
              </label>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`group flex items-center justify-between p-5 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? `border-2 ${diff.borderColor} ${diff.selectedBg}`
                          : `border-[#2a2a2a] bg-[#0f0f0f]/40 ${diff.hoverBorder} hover:bg-[#0f0f0f]/75`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${diff.dotColor}`} />
                        <span className="font-semibold text-white tracking-wide">{diff.name}</span>
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
            <div className="pt-8 border-t border-[#2a2a2a]">
              <Button
                onClick={handleStartInterview}
                loading={loading}
                className="w-full py-4 text-base shadow-lg shadow-indigo-500/10"
              >
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
