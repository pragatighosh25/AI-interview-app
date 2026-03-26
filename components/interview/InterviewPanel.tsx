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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ✅ NEW

  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState<QA[]>([]);

  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    generateQuestion();
  }, [type]);

  // ✅ GENERATE QUESTION (FIXED)
  const generateQuestion = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          type: "generate",
          role: type,
          difficulty,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate question");
      }

      if (!data?.question) {
        throw new Error("No question received");
      }

      setQuestion(data.question);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setQuestion("");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EVALUATE ANSWER (FIXED)
  const evaluateAnswer = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          type: "evaluate",
          question,
          answer: userAnswer,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Evaluation failed");
      }

      if (!data?.result) {
        throw new Error("Invalid evaluation result");
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
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === TOTAL_QUESTIONS) {
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

  return (
    <div className="glass border border-border rounded-2xl p-6 md:p-8 space-y-6">
      
      {/* Exit Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowExitDialog(true)}
          variant="ghost"
          className="text-muted-foreground hover:text-red-500"
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

      {/* ❌ ERROR UI (NEW) */}
      {error && (
        <div className="text-red-500 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={generateQuestion} className="underline text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold">
        {loading ? "Generating question..." : question || "No question available"}
      </h2>

      {/* Answer */}
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        disabled={loading} // ✅ prevent typing during loading
        className="w-full h-32 p-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
      />

      {/* Submit */}
      {!submitted && (
        <Button
          onClick={evaluateAnswer}
          disabled={!userAnswer.trim() || loading}
          className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-50"
        >
          {loading ? "Evaluating..." : "Submit Answer"}
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
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
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