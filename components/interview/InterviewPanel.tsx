"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ResultType = {
  score: number;
  expected: string;
  feedback: string;
};

type QA = {
  question: string;
  userAnswer: string;
  result: ResultType;
};

const STORAGE_KEY = "interview_state";

export default function InterviewPanel({
  type,
  difficulty,
  totalQuestions,
}: {
  type: string;
  difficulty: string;
  totalQuestions: number;
}) {
  const router = useRouter();

  const TOTAL_QUESTIONS = totalQuestions;

  const [questions, setQuestions] = useState<string[]>([]);
  const [question, setQuestion] = useState("");

  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);

  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [error, setError] = useState("");

  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState<QA[]>([]);

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Restore state
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);

      setQuestions(parsed?.questions || []);
      setQuestion(parsed?.question || "");
      setUserAnswer(parsed?.userAnswer || "");
      setStep(parsed?.step || 1);
      setSessionData(parsed?.sessionData || []);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ✅ Generate ALL questions once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.questions?.length) return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    generateQuestions();
  }, [type]);

  // ✅ Save state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const state = {
      questions,
      question,
      userAnswer,
      step,
      sessionData,
      type,
      difficulty,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [questions, question, userAnswer, step, sessionData]);

  // 🔥 Generate multiple questions
  const generateQuestions = async () => {
    try {
      setGenerating(true);
      setError("");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "generate",
          role: type,
          difficulty,
          count: TOTAL_QUESTIONS,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.questions) {
        throw new Error(data?.error || "Failed to generate questions");
      }

      setQuestions(data.questions);
      setQuestion(data.questions[0]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate questions");
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setGenerating(false);
    }
  };

  // ✅ Evaluate answer
  const evaluateAnswer = async () => {
    if (evaluating) return;

    try {
      setEvaluating(true);
      setError("");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "evaluate",
          question,
          answer: userAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.result) {
        throw new Error(data?.error || "Evaluation failed");
      }

      setResult(data.result);
      setSubmitted(true);

      setSessionData((prev) => [
        ...prev,
        { question, userAnswer, result: data.result },
      ]);
    } catch (err: any) {
      setError(err.message || "Evaluation failed");
    } finally {
      setEvaluating(false);
    }
  };

  // 🔥 Next question WITHOUT API call
  const handleNext = () => {
    if (step === TOTAL_QUESTIONS) {
      localStorage.removeItem(STORAGE_KEY);

      router.push(
        `/interview/result?type=${type}&data=${encodeURIComponent(
          JSON.stringify(sessionData)
        )}`
      );
      return;
    }

    const nextStep = step + 1;

    setStep(nextStep);
    setUserAnswer("");
    setSubmitted(false);
    setResult(null);

    setQuestion(questions[nextStep - 1]);
  };

  if (!hydrated) return null;

  return (
    <div className="glass border border-border rounded-2xl p-6 md:p-8 space-y-6">
      {/* Exit */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowExitDialog(true)}
          variant="ghost"
          disabled={generating || evaluating}
        >
          Exit
        </Button>
      </div>

      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {type} • {difficulty} ({step}/{TOTAL_QUESTIONS})
        </span>
        <span>{result ? `${result.score}/10` : "--"}</span>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={generateQuestions} className="underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* QUESTION */}
      <h2 className="text-xl md:text-2xl font-semibold min-h-[60px]">
        {generating ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        ) : question ? (
          question
        ) : (
          <span>No question generated</span>
        )}
      </h2>

      {/* Answer */}
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer..."
        disabled={generating || evaluating}
        className="w-full h-32 p-4 rounded-xl bg-muted border"
      />

      {!submitted && (
        <Button
          onClick={evaluateAnswer}
          disabled={!userAnswer.trim()}
        >
          {evaluating ? "Evaluating..." : "Submit Answer"}
        </Button>
      )}

      {submitted && result && (
        <div className="space-y-4">
          <p>{result.expected}</p>
          <p>{result.feedback}</p>

          <Button onClick={handleNext}>
            {step === TOTAL_QUESTIONS ? "Finish" : "Next"}
          </Button>
        </div>
      )}

      {/* Exit dialog unchanged */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Interview?</DialogTitle>
            <DialogDescription>
              Progress will be lost.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
            <Button onClick={() => router.push("/dashboard")}>
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}