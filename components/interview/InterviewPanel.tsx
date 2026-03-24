"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "What is the Virtual DOM in React?",
    answer:
      "The Virtual DOM is a lightweight representation of the real DOM used to optimize UI updates.",
  },
  {
    question: "Explain useEffect hook.",
    answer:
      "useEffect is used to perform side effects in functional components like data fetching or subscriptions.",
  },
];

export default function InterviewPanel() {
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const current = questions[index];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = () => {
    setIndex((prev) => prev + 1);
    setUserAnswer("");
    setSubmitted(false);
  };

  const handlePrev = () => {
    setIndex((prev) => prev - 1);
    setUserAnswer("");
    setSubmitted(false);
  };

  return (
    <div className="glass border border-border rounded-2xl p-6 md:p-8 space-y-6">
      
      {/* Progress */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Question {index + 1} / {questions.length}</span>
        <span>Score: {submitted ? "8/10" : "--"}</span>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-semibold">
        {current.question}
      </h2>

      {/* Answer Box */}
      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-32 p-4 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />

      {/* Submit */}
      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
        >
          Submit Answer
        </Button>
      )}

      {/* Result */}
      {submitted && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-xl bg-muted border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Expected Answer
            </p>
            <p>{current.answer}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Score: 8 / 10
            </span>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={index === 0}
              >
                Prev
              </Button>

              <Button
                onClick={handleNext}
                disabled={index === questions.length - 1}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exit */}
      <div className="flex justify-end">
        <Button variant="ghost" className="text-red-400 hover:text-red-500">
          Exit Interview
        </Button>
      </div>
    </div>
  );
}