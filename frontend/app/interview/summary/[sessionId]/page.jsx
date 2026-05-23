"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function InterviewSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId;

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    if (!sessionId) {
      toast.error('Invalid Session ID');
      router.push('/dashboard');
      return;
    }

    const fetchSessionDetails = async () => {
      try {
        const response = await api.get(`/sessions/${sessionId}`);
        setSession(response.data);
      } catch (error) {
        toast.error('Failed to load summary details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, router]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const parseFeedback = (aiFeedback) => {
    try {
      if (!aiFeedback) return null;
      return typeof aiFeedback === 'string' ? JSON.parse(aiFeedback) : aiFeedback;
    } catch (e) {
      console.error('Failed to parse AI Feedback', e);
      return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
    if (score >= 4) return 'text-amber-400 border-amber-500 bg-amber-500/10';
    return 'text-rose-400 border-rose-500 bg-rose-500/10';
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

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
        <h1 className="text-2xl font-bold">Session Not Found</h1>
        <p className="text-zinc-400 mt-2">The requested interview summary could not be loaded.</p>
        <Link href="/dashboard" className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const scoreColorClass = getScoreColor(session.totalScore);
  const questionsList = session.questions || [];

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
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 text-sm font-semibold transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Title */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Interview Summary
          </h1>
          <p className="mt-2 text-zinc-400">
            Review your responses and check areas for improvement.
          </p>
        </div>

        {/* Info Row & Circle Score */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Interview Topic</span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{session.topic}</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div>
                <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider block mb-1">Difficulty</span>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getDifficultyColor(session.difficulty)}`}>
                  {session.difficulty}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider block mb-1">Questions Asked</span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
                  {questionsList.length} {questionsList.length === 1 ? 'Question' : 'Questions'}
                </span>
              </div>
            </div>
          </div>

          {/* Circle score indicator */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Average Score</span>
            <div className={`flex items-center justify-center h-28 w-28 rounded-full border-4 font-black text-2xl tracking-tight shadow-xl ${scoreColorClass}`}>
              {session.totalScore !== null && session.totalScore !== undefined ? `${session.totalScore}/10` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-3">
            Detailed Breakdown
          </h3>

          {questionsList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10">
              <p className="text-zinc-500">No questions were answered in this session.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {questionsList.map((question, index) => {
                const feedback = parseFeedback(question.aiFeedback);
                const scoreClass = getScoreColor(question.score);
                
                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-6 hover:border-zinc-700 transition duration-200"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                      <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs">
                        Question {index + 1}
                      </span>
                      {question.score !== null && (
                        <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${scoreClass}`}>
                          Score: {question.score} / 10
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-2">Question</h4>
                      <p className="text-base font-semibold text-white leading-relaxed">
                        {question.questionText}
                      </p>
                    </div>

                    {/* User Answer */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-2">Your Answer</h4>
                      <div className="text-zinc-300 text-sm leading-relaxed p-4 rounded-xl bg-zinc-950/50 border border-zinc-900 whitespace-pre-wrap">
                        {question.userAnswer || <span className="text-zinc-600 italic">No answer provided</span>}
                      </div>
                    </div>

                    {/* Feedback breakdown */}
                    {feedback ? (
                      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-zinc-800/80">
                        <div>
                          <h5 className="text-xs font-semibold tracking-wider uppercase text-emerald-400">What was good</h5>
                          <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">{feedback.good}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold tracking-wider uppercase text-rose-400">What was missing</h5>
                          <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">{feedback.missing}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold tracking-wider uppercase text-sky-400">Ideal Answer</h5>
                          <p className="text-zinc-300 text-sm mt-1.5 leading-relaxed">{feedback.ideal_answer}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 italic text-sm pt-2">
                        Evaluation feedback not available.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
          <Link
            href="/interview/setup"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-center text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition duration-150"
          >
            Start New Interview
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-6 py-4 text-center text-base font-semibold transition duration-150"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
