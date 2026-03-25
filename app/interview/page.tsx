"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import InterviewPanel from "@/components/interview/InterviewPanel";

export default function InterviewPage() {
  const params = useSearchParams();
  const type = params.get("type") || "Frontend";

  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <InterviewPanel type={type} />
      </div>
    </main>
  );
}