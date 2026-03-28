"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import InterviewPanel from "@/components/interview/InterviewPanel";

export const dynamic = "force-dynamic";

export default function InterviewPage() {
  const params = useSearchParams();

  const { type, difficulty, count } = useMemo(() => {
    return {
      type: params.get("type") || "Frontend",
      difficulty: params.get("difficulty") || "Medium",
      count: Number(params.get("count") || 5),
    };
  }, [params]);

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