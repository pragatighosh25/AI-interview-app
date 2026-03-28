"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import InterviewPanel from "@/components/interview/InterviewPanel";
import { useSearchParams } from "next/navigation";

function InterviewContent() {
  const params = useSearchParams();

  const type = params.get("type") || "Frontend";
  const difficulty = params.get("difficulty") || "Medium";
  const count = Number(params.get("count") || 5);

  return (
    <div className="max-w-4xl mx-auto">
      <InterviewPanel
        type={type}
        difficulty={difficulty}
        totalQuestions={count}
      />
    </div>
  );
}

export default function InterviewPage() {
  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <InterviewContent />
      </Suspense>
    </main>
  );
}