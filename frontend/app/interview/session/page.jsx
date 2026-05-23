"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

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

  const isButtonDisabled = generating || evaluating || completing;

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
          <div>
            <button
              onClick={handleEndInterview}
              disabled={isButtonDisabled}
              className="rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 px-4 py-2 text-sm font-semibold transition"
            >
              End Interview
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        {generating ? (
          <div className="text-center py-12 space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
            <p className="text-zinc-400 animate-pulse">Generating question...</p>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-8 w-full">
            {/* Header: Question Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm">
                  Question {questionNumber}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Active Session</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border px-3 py-1 text-xs font-semibold capitalize bg-zinc-900 text-zinc-200 border-zinc-800">
                  {session?.topic}
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getDifficultyColor(session?.difficulty)}`}>
                  {session?.difficulty}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-xl">
              <p className="text-lg font-medium text-white leading-relaxed">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Answer Input form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
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
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 text-white placeholder-zinc-500 transition duration-150 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-75"
                  placeholder="Type your detailed answer here..."
                />
              </div>

              {!feedback && (
                <button
                  type="submit"
                  disabled={evaluating || !userAnswer.trim()}
                  className="relative flex w-full justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 hover:shadow-indigo-500/30 disabled:opacity-50"
                >
                  {evaluating ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Evaluating answer...</span>
                    </div>
                  ) : (
                    'Submit Answer'
                  )}
                </button>
              )}
            </form>

            {/* Evaluated Feedback Card */}
            {feedback && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl space-y-6 animate-fadeIn animate-duration-300">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <h3 className="text-xl font-bold text-white">Evaluation & Feedback</h3>
                  <div className={`rounded-lg border px-3 py-1.5 text-sm font-extrabold ${getScoreColor(feedback.score)}`}>
                    Score: {feedback.score} / 10
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold tracking-wider uppercase text-emerald-400">What was good</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.good}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold tracking-wider uppercase text-rose-400">What was missing</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.missing}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold tracking-wider uppercase text-sky-400">Ideal Answer</h4>
                    <p className="text-zinc-300 text-sm mt-1 leading-relaxed">{feedback.ideal_answer}</p>
                  </div>
                </div>

                {/* Post-Feedback Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => handleGenerateQuestion()}
                    disabled={isButtonDisabled}
                    className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3.5 text-base font-semibold shadow-lg shadow-indigo-500/20 transition duration-150"
                  >
                    Next Question
                  </button>
                  <button
                    onClick={handleEndInterview}
                    disabled={isButtonDisabled}
                    className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 py-3.5 text-base font-semibold border border-zinc-700 transition duration-150"
                  >
                    {completing ? 'Ending Interview...' : 'End Interview'}
                  </button>
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}
