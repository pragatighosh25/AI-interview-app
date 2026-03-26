"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState<QA[]>([]);

  useEffect(() => {
    generateQuestion();
  }, [type]);

  const generateQuestion = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
  type: "generate",
  role: type,
  difficulty,
}),
      });

      const data = await res.json();
      setQuestion(data.question);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({
          type: "evaluate",
          question,
          answer: userAnswer,
        }),
      });

      const data = await res.json();

      setResult(data.result);
      setSubmitted(true);

      // store result
      setSessionData((prev) => [
        ...prev,
        {
          question,
          userAnswer,
          result: data.result,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === TOTAL_QUESTIONS) {
      // go to result page
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
      
      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
  {type} • {difficulty} ({step}/{TOTAL_QUESTIONS})
</span>
        <span>{result ? `${result.score}/10` : "--"}</span>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold">
        {loading ? "Generating question..." : question}
      </h2>

      {/* Answer */}
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-32 p-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />

      {/* Submit */}
      {!submitted && (
        <Button
          onClick={evaluateAnswer}
          disabled={!userAnswer.trim() || loading}
          className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
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
    </div>
  );
}