"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';

function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [completing, setCompleting] = useState(false);

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

    const fetchSessionAndLoadQuestion = async () => {
      setGenerating(true);
      try {
        const sessionRes = await api.get(`/sessions/${sessionId}`);
        setSession(sessionRes.data);

        const pastQuestions = sessionRes.data.questions || [];
        const lastQuestion = pastQuestions[pastQuestions.length - 1];

        // Resume if last question has no answer
        if (lastQuestion && !lastQuestion.userAnswer) {
          setCurrentQuestion(lastQuestion);
          setQuestionNumber(pastQuestions.length);
          setGenerating(false);
        } else {
          // Generate a new question
          setQuestionNumber(pastQuestions.length + 1);
          await handleGenerateQuestion(pastQuestions.length + 1);
        }
      } catch (error) {
        toast.error('Failed to load session details');
        setGenerating(false);
      }
    };

    fetchSessionAndLoadQuestion();
  }, [sessionId, router]);

  const handleGenerateQuestion = async (nextNumber) => {
    setGenerating(true);
    setFeedback(null);
    setUserAnswer('');
    
    try {
      const response = await api.post('/questions/generate', { sessionId });
      setCurrentQuestion(response.data);
      if (nextNumber) {
        setQuestionNumber(nextNumber);
      } else {
        setQuestionNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate question');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.error('Please type an answer first');
      return;
    }

    setEvaluating(true);
    try {
      const response = await api.post(`/questions/${currentQuestion.id}/answer`, {
        answer: userAnswer,
      });
      setFeedback(response.data);
      toast.success('Feedback received!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setEvaluating(false);
    }
  };

  const handleEndInterview = async () => {
    setCompleting(true);
    try {
      await api.patch(`/sessions/${sessionId}/complete`);
      toast.success('Interview completed!');
      router.push(`/interview/summary/${sessionId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete interview');
      setCompleting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 7) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 4) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
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

  const isButtonDisabled = generating || evaluating || completing;

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f] text-white">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full animate-fadeIn">
        {generating ? (
          <div className="text-center py-20 space-y-4">
            <svg className="h-10 w-10 animate-spin text-[#6366f1] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-zinc-400 animate-pulse">Generating interview question...</p>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-8 w-full">
            {/* Header: Question Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4">
              <div>
                <span className="text-[#6366f1] font-bold tracking-wider uppercase text-xs bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  Question {questionNumber}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-3">Active Session</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getTopicBadgeColor(session?.topic)}`}>
                  {session?.topic}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getDifficultyColor(session?.difficulty)}`}>
                  {session?.difficulty}
                </span>
              </div>
            </div>

            {/* Glowing Question Card */}
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-[0_0_30px_rgba(99,102,241,0.06)] md:shadow-[0_0_40px_rgba(99,102,241,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              <p className="text-lg font-medium text-white leading-relaxed pt-2">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Answer Input form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-5">
              <div>
                <label htmlFor="answer" className="block text-sm font-semibold tracking-wider uppercase text-zinc-400 mb-2">
                  Your Answer
                </label>
                <textarea
                  id="answer"
                  required
                  rows={6}
                  value={userAnswer}
                  disabled={evaluating || !!feedback}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]/40 p-5 text-white placeholder-zinc-500 transition duration-150 ease-in-out focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] disabled:opacity-75"
                  placeholder="Type your detailed answer here..."
                />
              </div>

              {!feedback && (
                <Button
                  type="submit"
                  loading={evaluating}
                  disabled={!userAnswer.trim()}
                  className="w-full py-4 text-base"
                >
                  Submit Answer
                </Button>
              )}
            </form>

            {/* Evaluated Feedback Card */}
            {feedback && (
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-2xl space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                  <h3 className="text-xl font-bold text-white">Evaluation & Feedback</h3>
                  <div className={`rounded-lg border px-3 py-1.5 text-sm font-extrabold ${getScoreColor(feedback.score)}`}>
                    Score: {feedback.score} / 10
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-emerald-400">What was good</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.good}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-rose-400">What was missing</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.missing}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase text-sky-400">Ideal Answer</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.ideal_answer}</p>
                  </div>
                </div>

                {/* Post-Feedback Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-5 border-t border-[#2a2a2a]">
                  <Button
                    onClick={() => handleGenerateQuestion()}
                    disabled={isButtonDisabled}
                    className="flex-1 py-3.5"
                  >
                    Next Question
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleEndInterview}
                    loading={completing}
                    disabled={isButtonDisabled}
                    className="flex-1 py-3.5"
                  >
                    End Interview
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400">Loading interview details...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function InterviewSessionPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6366f1] border-t-transparent" />
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}
