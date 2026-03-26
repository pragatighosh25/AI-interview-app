"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import InterviewPanel from "@/components/interview/InterviewPanel";

export default function InterviewPage() {
  const params = useSearchParams();

  const type = params.get("type") || "Frontend";
  const difficulty = params.get("difficulty") || "Medium";
  const count = Number(params.get("count") || 5);

  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <InterviewPanel
          type={type}
          difficulty={difficulty}
          totalQuestions={count}
        />
      </div>
    </main>
  );
}