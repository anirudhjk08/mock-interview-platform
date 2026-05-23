"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

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

  const getPerformanceMessage = (score) => {
    if (score === null || score === undefined) return '';
    if (score >= 7) {
      return {
        title: "Excellent!",
        desc: "You have a solid grasp of this topic. Great job displaying technical depth and clarity.",
        color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20"
      };
    }
    if (score >= 4) {
      return {
        title: "Good Job!",
        desc: "A bit more practice will make you perfect. Make sure to cover the missing bullet points highlighted below.",
        color: "text-amber-400 bg-amber-500/5 border-amber-500/20"
      };
    }
    return {
      title: "Keep Practicing!",
      desc: "Review the missing areas, study the ideal answers, and trigger another practice session to cement the concepts.",
      color: "text-rose-400 bg-rose-500/5 border-rose-500/20"
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6366f1] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] text-white p-6">
        <h1 className="text-2xl font-bold">Session Not Found</h1>
        <p className="text-zinc-400 mt-2">The requested interview summary could not be loaded.</p>
        <Link href="/dashboard" className="mt-4 text-[#6366f1] hover:text-[#5053e1] font-semibold transition">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const scoreColorClass = getScoreColor(session.totalScore);
  const performanceInfo = getPerformanceMessage(session.totalScore);
  const questionsList = session.questions || [];

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
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
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="text-xs font-semibold uppercase text-zinc-500 tracking-wider">Interview Topic</span>
              <h2 className="text-2xl font-bold text-white mt-1">
                <span className={`inline-block px-3 py-1 rounded-lg text-base font-semibold border ${getTopicBadgeColor(session.topic)}`}>
                  {session.topic}
                </span>
              </h2>
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
                <span className="rounded-full border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-1 text-xs font-bold text-zinc-300">
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

        {/* Performance Message Section */}
        {performanceInfo && (
          <div className={`rounded-xl border p-5 ${performanceInfo.color} space-y-1`}>
            <h4 className="font-extrabold text-lg tracking-wide">{performanceInfo.title}</h4>
            <p className="text-sm leading-relaxed opacity-90">{performanceInfo.desc}</p>
          </div>
        )}

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-[#2a2a2a] pb-3">
            Detailed Breakdown
          </h3>

          {questionsList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#2a2a2a] rounded-xl bg-[#1a1a1a]/20">
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
                    className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 space-y-6 hover:border-[#6366f1]/40 transition duration-200"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4">
                      <span className="text-[#6366f1] font-bold tracking-wider uppercase text-xs">
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
                      <div className="text-zinc-300 text-sm leading-relaxed p-4 rounded-xl bg-[#0f0f0f]/60 border border-[#2a2a2a] whitespace-pre-wrap">
                        {question.userAnswer || <span className="text-zinc-600 italic">No answer provided</span>}
                      </div>
                    </div>

                    {/* Feedback breakdown */}
                    {feedback ? (
                      <div className="grid grid-cols-1 gap-6 pt-4 border-t border-[#2a2a2a]">
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
          <Button
            onClick={() => router.push('/interview/setup')}
            className="px-8 py-4 text-base"
          >
            Start New Interview
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
