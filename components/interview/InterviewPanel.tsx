"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ResultType = {
  score: number;
  expected: string;
  feedback: string;
};

export default function InterviewPanel({ type }: { type: string }) {
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setUserAnswer("");
    setSubmitted(false);
    setResult(null);
    await generateQuestion();
  };

  return (
    <div className="glass border border-border rounded-2xl p-6 md:p-8 space-y-6">
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{type} Interview</span>
        <span>{result ? `${result.score}/10` : "--"}</span>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold">
        {loading ? "Generating question..." : question}
      </h2>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-32 p-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />

      {!submitted && (
        <Button
          onClick={evaluateAnswer}
          disabled={!userAnswer.trim() || loading}
          className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
        >
          {loading ? "Evaluating..." : "Submit Answer"}
        </Button>
      )}

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
              Next Question
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" className="text-red-400 hover:text-red-500">
          Exit Interview
        </Button>
      </div>
    </div>
  );
}