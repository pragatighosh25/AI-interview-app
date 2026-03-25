"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const results = [
  {
    question: "What is Virtual DOM?",
    score: 8,
  },
  {
    question: "Explain useEffect.",
    score: 7,
  },
];

export default function ResultsPanel() {
  const hasSaved = useRef(false);

  const total = results.reduce((acc, r) => acc + r.score, 0);
  const avg = Number((total / results.length).toFixed(1));

  const getRemark = () => {
    if (avg >= 8) return "Excellent 🚀 You're interview ready!";
    if (avg >= 6) return "Good 👍 Keep refining your answers.";
    return "Needs Improvement 📚 Practice more!";
  };

  const saveResult = async () => {
    try {
      await fetch("/api/interview", {
        method: "POST",
        body: JSON.stringify({ score: avg }),
      });
    } catch (err) {
      console.error("Failed to save result", err);
    }
  };

  useEffect(() => {
    if (!hasSaved.current) {
      saveResult();
      hasSaved.current = true;
    }
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Summary */}
      <div className="glass border border-border rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Your Result
        </h1>

        <p className="text-5xl font-bold gradient-text mb-4">
          {avg} / 10
        </p>

        <p className="text-muted-foreground mb-6">
          {getRemark()}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>

          <Link href="/interview">
            <Button className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center gap-2">
              Retry Interview <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Breakdown
        </h2>

        {results.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-border pb-3"
          >
            <div className="flex items-center gap-3">
              {item.score >= 7 ? (
                <CheckCircle2 className="text-green-500 w-5 h-5" />
              ) : (
                <XCircle className="text-red-500 w-5 h-5" />
              )}

              <p className="text-sm md:text-base">
                {item.question}
              </p>
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {item.score}/10
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}