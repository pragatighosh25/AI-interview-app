"use client";

import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import ResultsPanel from "@/components/interview/ResultsPannel";

function ResultContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <ResultsPanel />
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <Suspense fallback={<div className="text-center">Loading results...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}