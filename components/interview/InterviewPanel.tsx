"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronRight, Mic, MicOff } from "lucide-react";

const STORAGE_KEY = "interview_state";

// ── Score pill ────────────────────────────────────────────────
function ScorePill({ score }: { score: number }) {
  const color =
    score >= 7 ? "text-green-400 bg-green-400/10 border-green-400/20"
    : score >= 5 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    : "text-red-400 bg-red-400/10 border-red-400/20";

  const label = score >= 7 ? "Strong" : score >= 5 ? "Fair" : "Needs work";

  return (
    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${color}`}>
      {score}/10 · {label}
    </span>
  );
}

// ── Structured feedback ───────────────────────────────────────
function FeedbackCard({ result }: { result: any }) {
  const [showModel, setShowModel] = useState(false);

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Score */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Your score</p>
        <ScorePill score={result.score} />
      </div>

      {/* Feedback */}
      <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Feedback</p>
        <p className="text-sm leading-relaxed">{result.feedback}</p>
      </div>

      {/* Expected — collapsible */}
      <button
        onClick={() => setShowModel(!showModel)}
        className="w-full text-left bg-muted/10 hover:bg-muted/20 border border-border 
        rounded-xl p-4 transition-colors"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-purple-400 uppercase tracking-wide font-medium">
            {showModel ? "Hide" : "Show"} model answer
          </p>
          <ChevronRight
            size={14}
            className={`text-muted-foreground transition-transform duration-200 
            ${showModel ? "rotate-90" : ""}`}
          />
        </div>
        {showModel && (
          <p className="text-sm leading-relaxed mt-3 text-muted-foreground">
            {result.expected}
          </p>
        )}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
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

  const resumeText =
    typeof window !== "undefined"
      ? sessionStorage.getItem("resumeText")
      : null;

  const [questions, setQuestions]   = useState<string[]>([]);
  const [question, setQuestion]     = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult]         = useState<any>(null);
  const [submitted, setSubmitted]   = useState(false);
  const [step, setStep]             = useState(1);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError]           = useState("");
  const [hydrated, setHydrated]     = useState(false);

  // Voice input state
  const [listening, setListening]   = useState(false);

  const MIN_CHARS = 30;
  const charCount = userAnswer.trim().length;
  const tooShort  = charCount > 0 && charCount < MIN_CHARS;

  useEffect(() => setHydrated(true), []);

  // Warn before leaving mid-interview
  useEffect(() => {
    if (submitted || step === totalQuestions) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitted, step, totalQuestions]);

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, [type, difficulty, resumeText]);

  useEffect(() => {
    if (!hydrated) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed?.questions?.length &&
          parsed?.type === type &&
          parsed?.difficulty === difficulty &&
          parsed?.resumeText === resumeText
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
  }, [type, difficulty, hydrated, resumeText]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      questions, step, sessionData, type, difficulty, resumeText,
    }));
  }, [questions, step, sessionData, resumeText]);

  const generateQuestions = async () => {
    try {
      setGenerating(true);
      setError("");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "generate",
          role: resumeText ? null : type,
          difficulty,
          count: totalQuestions,
          resumeText: resumeText || null,
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
      setError("");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "evaluate", question, answer: userAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      setSubmitted(true);
      setSessionData((prev) => [...prev, { question, userAnswer, result: data.result }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  // ── Fix: save session to DB, pass only ID in URL ──
  const handleFinish = async (finalData: any[]) => {
    console.log("handleFinish called, finalData:", finalData); // ← add this
  console.log("sessionData at finish:", sessionData); 
  try {
    const avg = finalData.reduce((sum, item) => sum + (item.result?.score ?? 0), 0) / finalData.length;

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: parseFloat(avg.toFixed(1)),
        type,
        data: finalData,
      }),
    });

    const json = await res.json();
    console.log("STATUS:", res.status);  // ← add this
    console.log("RESPONSE:", json);      // ← add this

    if (!res.ok) throw new Error(json.error);

    localStorage.removeItem(STORAGE_KEY);
    router.push(`/interview/result?id=${json.id}&type=${type}`);
  } catch (err) {
    console.error("handleFinish failed:", err);  // ← this will now show the real error
    localStorage.removeItem(STORAGE_KEY);
    router.push(`/interview/result`);
  }
};

  const handleNext = () => {
    if (step === totalQuestions) {
      const finalData = [...sessionData];
      console.log("Finishing, finalData length:", finalData.length);
      handleFinish(finalData);
      return;
    }
    const next = step + 1;
    setStep(next);
    setQuestion(questions[next - 1]);
    setUserAnswer("");
    setSubmitted(false);
    setResult(null);
  };

  // ── Voice input (Web Speech API) ──
  const toggleVoice = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Voice input not supported in this browser.");
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }

    recognition.start();
    setListening(true);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setUserAnswer((prev) => prev ? `${prev} ${transcript}` : transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend   = () => setListening(false);
  }, [listening]);

  if (!hydrated) return null;

  const progress = (step / totalQuestions) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Progress bar ── */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="capitalize">
            {type === "resume" ? "Resume Interview" : type} · {difficulty}
          </span>
          <span>Question {step} of {totalQuestions}</span>
        </div>
        <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Question card ── */}
      <div className={`border border-border rounded-2xl p-6 transition-all duration-300
        ${generating ? "bg-muted/10 animate-pulse" : "bg-muted/30"}`}>
        {generating ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : (
          <h2 className="text-lg font-semibold leading-relaxed">{question}</h2>
        )}
      </div>

      {/* ── Answer input ── */}
      {!submitted && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Your Answer</label>
            <div className="flex items-center gap-3">
              {/* Voice button */}
              <button
                onClick={toggleVoice}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors
                  ${listening
                    ? "border-red-400/40 text-red-400 bg-red-400/10 animate-pulse"
                    : "border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {listening ? <MicOff size={12} /> : <Mic size={12} />}
                {listening ? "Stop" : "Speak"}
              </button>
              {/* Char count */}
              <span className={`text-xs ${tooShort ? "text-yellow-400" : "text-muted-foreground"}`}>
                {charCount} chars{tooShort ? ` (min ${MIN_CHARS})` : ""}
              </span>
            </div>
          </div>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Write your answer here... or use the mic button to speak"
            className="w-full h-36 p-4 rounded-xl bg-background border border-border 
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 
            custom-scroll resize-none transition-all"
            disabled={evaluating}
          />

          <Button
            onClick={evaluateAnswer}
            disabled={!userAnswer.trim() || tooShort || evaluating}
            className="w-full"
          >
            {evaluating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Evaluating your answer...
              </span>
            ) : "Submit Answer"}
          </Button>
        </div>
      )}

      {/* ── Result ── */}
      {submitted && result && (
        <div className="space-y-4">
          <FeedbackCard result={result} />
          <Button onClick={handleNext} className="w-full">
            {step === totalQuestions ? "Finish & See Results" : `Next Question →`}
          </Button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 
        border border-red-400/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-xs underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}