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

  // ✅ Hydration fix
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Restore state (SSR safe)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);

      setQuestion(parsed?.question || "");
      setUserAnswer(parsed?.userAnswer || "");
      setStep(parsed?.step || 1);
      setSessionData(parsed?.sessionData || []);
    } catch (err) {
      console.error("Failed to restore state");
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ✅ Generate question if needed
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed?.question && parsed.question.trim()) {
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    generateQuestion();
  }, [type]);

  // ✅ Save state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const state = {
      question,
      userAnswer,
      step,
      sessionData,
      type,
      difficulty,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [question, userAnswer, step, sessionData]);

  // ✅ Generate question
  const generateQuestion = async () => {
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate question");
      }

      if (!data?.question || typeof data.question !== "string") {
        throw new Error("Invalid question from AI");
      }

      setQuestion(data.question.trim());
    } catch (err: any) {
      console.error(err);
      setError(err.message || "AI failed to generate a question.");
      setQuestion("");
      localStorage.removeItem(STORAGE_KEY); // 🔥 prevent stuck state
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

      if (!res.ok) {
        throw new Error(data?.error || "Evaluation failed");
      }

      if (!data?.result || typeof data.result.score !== "number") {
        throw new Error("Invalid evaluation response");
      }

      setResult(data.result);
      setSubmitted(true);

      setSessionData((prev) => [
        ...prev,
        {
          question,
          userAnswer,
          result: data.result,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "AI failed to evaluate.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = async () => {
    if (step === TOTAL_QUESTIONS) {
      localStorage.removeItem(STORAGE_KEY);

      router.push(
        `/interview/result?type=${type}&data=${encodeURIComponent(
          JSON.stringify(sessionData)
        )}`
      );
      return;
    }

    setStep((prev) => prev + 1);
    setUserAnswer("");
    setSubmitted(false);
    setResult(null);

    await generateQuestion();
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
          className="text-muted-foreground hover:text-red-500 disabled:opacity-50"
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
        <div className="text-red-500 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={generateQuestion} className="underline text-xs">
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
          <span className="text-sm text-muted-foreground">
            No question generated. Try again.
          </span>
        )}
      </h2>

      {/* Answer */}
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        disabled={generating || evaluating}
        className="w-full h-32 p-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
      />

      {/* Submit */}
      {!submitted && (
        <Button
          onClick={evaluateAnswer}
          disabled={!userAnswer.trim() || evaluating}
          className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-50"
        >
          {evaluating ? "Evaluating..." : "Submit Answer"}
        </Button>
      )}

      {/* Result */}
      {submitted && result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Expected Answer
            </p>
            <p>{result.expected}</p>
          </div>

          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Feedback
            </p>
            <p>{result.feedback}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Score: {result.score} / 10
            </span>

            <Button
              onClick={handleNext}
              disabled={generating}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-50"
            >
              {step === TOTAL_QUESTIONS ? "Finish" : "Next Question"}
            </Button>
          </div>
        </div>
      )}

      {/* EXIT DIALOG */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="glass border border-border">
          <DialogHeader>
            <DialogTitle>Exit Interview?</DialogTitle>
            <DialogDescription>
              Your progress will not be saved.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowExitDialog(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => router.push("/dashboard")}
            >
              Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}