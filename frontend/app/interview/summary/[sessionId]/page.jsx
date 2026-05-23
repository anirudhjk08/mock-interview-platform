"use client";

import { useParams } from "next/navigation";

export default function InterviewSummaryPage() {
  const params = useParams();
  const sessionId = params?.sessionId;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-white">
      <h1 className="text-3xl font-bold">Interview Summary</h1>
      <p className="mt-2 text-zinc-400">Session ID: {sessionId}</p>
    </div>
  );
}
