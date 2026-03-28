"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

  const [questions, setQuestions] = useState<string[]>([]);
  const [question, setQuestion] = useState("");

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState<any[]>([]);

  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // 🔥 RESET when domain changes
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, [type, difficulty]);

  // 🔥 GENERATE QUESTIONS
  useEffect(() => {
    if (!hydrated) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (
          parsed?.questions?.length &&
          parsed?.type === type &&
          parsed?.difficulty === difficulty
        ) {
          setQuestions(parsed.questions);
          setQuestion(parsed.questions[parsed.step - 1]);
          setStep(parsed.step);
          setSessionData(parsed.sessionData || []);
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    generateQuestions();
  }, [type, difficulty, hydrated]);

  // 🔥 SAVE STATE
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        questions,
        step,
        sessionData,
        type,
        difficulty,
      })
    );
  }, [questions, step, sessionData]);

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
          count: totalQuestions,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setQuestions(data.questions);
      setQuestion(data.questions[0]);
      setStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const evaluateAnswer = async () => {
    try {
      setEvaluating(true);

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

      if (!res.ok) throw new Error(data.error);

      setResult(data.result);
      setSubmitted(true);

      setSessionData((prev) => [
        ...prev,
        { question, userAnswer, result: data.result },
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    if (step === totalQuestions) {
      localStorage.removeItem(STORAGE_KEY);

      router.push(
  `/interview/result?type=${type}&data=${encodeURIComponent(
    JSON.stringify(sessionData)
  )}`
);
      return;
    }

    const next = step + 1;
    setStep(next);
    setQuestion(questions[next - 1]);
    setUserAnswer("");
    setSubmitted(false);
    setResult(null);
  };

  if (!hydrated) return null;

  
    return (
  <div className="max-w-3xl mx-auto space-y-6">
    
    {/* HEADER */}
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>
        {type} • {difficulty} ({step}/{totalQuestions})
      </span>
      <span>{result ? `${result.score}/10` : "--"}</span>
    </div>

    {/* QUESTION CARD */}
    <div className="bg-muted/30 border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold leading-relaxed">
        {generating ? "Generating question..." : question}
      </h2>
    </div>

    {/* ANSWER INPUT */}
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">
        Your Answer
      </label>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Write your answer here..."
        className="w-full h-32 p-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-purple-500 custom-scroll resize-none overflow-y-auto"
      />
    </div>

    {/* SUBMIT BUTTON */}
    {!submitted && (
      <Button
        onClick={evaluateAnswer}
        disabled={!userAnswer.trim()}
        className="w-full"
      >
        {evaluating ? "Evaluating..." : "Submit Answer"}
      </Button>
    )}

    {/* RESULT SECTION */}
    {submitted && result && (
      <div className="space-y-4">
        
        {/* EXPECTED */}
        <div className="bg-muted/20 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Expected Answer
          </p>
          <p className="text-sm">{result.expected}</p>
        </div>

        {/* FEEDBACK */}
        <div className="bg-muted/20 border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">
            Feedback
          </p>
          <p className="text-sm leading-relaxed">
            {result.feedback}
          </p>
        </div>

        {/* NEXT BUTTON */}
        <Button onClick={handleNext} className="w-full">
          {step === totalQuestions ? "Finish Interview" : "Next Question"}
        </Button>
      </div>
    )}
  </div>
);
  
}