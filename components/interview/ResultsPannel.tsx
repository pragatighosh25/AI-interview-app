"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown, ChevronUp, RotateCcw,
  LayoutDashboard, Share2, CheckCircle2, AlertCircle
} from "lucide-react";

// ── Score ring ────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circ   = 2 * Math.PI * radius;
  const fill   = (score / 10) * circ;
  const color  = score >= 7 ? "#4ade80" : score >= 5 ? "#facc15" : "#f87171";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#ffffff10" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground">out of 10</span>
      </div>
    </div>
  );
}

// ── Per-question card ─────────────────────────────────────────
function QuestionCard({ item, index }: { item: any; index: number }) {
  const [open, setOpen] = useState(false);
  const score  = item.result?.score ?? 0;
  const color  = score >= 7 ? "text-green-400 bg-green-400/10 border-green-400/20"
               : score >= 5 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
               : "text-red-400 bg-red-400/10 border-red-400/20";

  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all">
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-4
        hover:bg-muted/20 transition-colors text-left"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-xs text-muted-foreground mt-0.5 shrink-0">
            Q{index + 1}
          </span>
          <p className="text-sm font-medium leading-snug line-clamp-2">{item.question}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>
            {score}/10
          </span>
          {open ? <ChevronUp size={14} className="text-muted-foreground" />
                : <ChevronDown size={14} className="text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">

          {/* User's answer */}
          <div className="bg-muted/20 rounded-lg p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Your answer</p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {item.userAnswer || "No answer recorded"}
            </p>
          </div>

          {/* Feedback */}
          <div className="bg-muted/10 rounded-lg p-3 space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Feedback</p>
            <p className="text-sm leading-relaxed">{item.result?.feedback || "No feedback"}</p>
          </div>

          {/* Model answer */}
          {item.result?.expected && (
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 space-y-1">
              <p className="text-xs text-purple-400 uppercase tracking-wide">Model answer</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.result.expected}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Remark ────────────────────────────────────────────────────
function getRemark(avg: number) {
  if (avg >= 8) return { text: "You're interview ready.", sub: "Outstanding performance across the board.", icon: <CheckCircle2 size={18} className="text-green-400" /> };
  if (avg >= 6) return { text: "Solid performance.", sub: "A few areas to refine — you're close.", icon: <CheckCircle2 size={18} className="text-yellow-400" /> };
  if (avg >= 4) return { text: "Good start.", sub: "Review the model answers and try again.", icon: <AlertCircle size={18} className="text-orange-400" /> };
  return { text: "Keep practicing.", sub: "Focus on structure and depth in your answers.", icon: <AlertCircle size={18} className="text-red-400" /> };
}

// ── Main ──────────────────────────────────────────────────────
export default function ResultsPanel() {
  const params = useSearchParams();
  const router = useRouter();

  // Support both ?id= (new) and ?data= (legacy fallback)
  const sessionId = params.get("id");
  const raw       = params.get("data");
  const [type, setType] = useState(params.get("type") || "General");

  const [data, setData]           = useState<any[]>([]);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [copied, setCopied]       = useState(false);
  const saved = useRef(false);

  // Load from DB if we have an id, else fall back to URL data
  useEffect(() => {
    const load = async () => {
      if (sessionId) {
        try {
          const res  = await fetch(`/api/interview/${sessionId}`);
          const json = await res.json();
          setData(Array.isArray(json.data) ? json.data : []);
          setType(json.type || "General");
        } catch {
          setData([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Legacy: read from URL
      try {
        if (raw) {
          const parsed = JSON.parse(decodeURIComponent(raw));
          const safe   = Array.isArray(parsed)
            ? parsed.filter((i: any) => i?.question && i?.result?.score != null)
            : [];
          setData(safe);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId, raw]);

  const total = data.reduce((acc, item) => acc + (item.result?.score ?? 0), 0);
  const avg   = data.length ? Number((total / data.length).toFixed(1)) : 0;
  const remark = getRemark(avg);

  // Save session (legacy path — when coming from URL data)
  const saveSession = async () => {
    if (!data.length || sessionId) return; // skip if already saved via id
    try {
      setSaving(true);
      setSaveError("");
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: avg, type, data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save session");
    } catch (err: any) {
      setSaveError(err.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!saved.current && data.length && !sessionId) {
      saveSession();
      saved.current = true;
    }
  }, [data]);

  const handleShare = async () => {
    const text = `I scored ${avg}/10 on a ${type} interview on IntervueX! 🎯\nTry it at https://ai-interview-app-sandy.vercel.app`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  if (loading) return (
    <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
      <div className="h-64 bg-muted rounded-2xl" />
      <div className="h-48 bg-muted rounded-2xl" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Score card ── */}
      <div className="glass border border-border rounded-2xl p-8 text-center space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Interview Complete</h1>
          <p className="text-sm text-muted-foreground mt-1 capitalize">{type} · {data.length} questions</p>
        </div>

        <ScoreRing score={avg} />

        {/* Remark */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            {remark.icon}
            <p className="font-semibold">{remark.text}</p>
          </div>
          <p className="text-sm text-muted-foreground">{remark.sub}</p>
        </div>

        {/* Save status */}
        {saving && (
          <p className="text-xs text-muted-foreground animate-pulse">Saving results...</p>
        )}
        {saveError && (
          <p className="text-xs text-red-400">
            {saveError}{" "}
            <button onClick={saveSession} className="underline">Retry</button>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <LayoutDashboard size={15} /> Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full sm:w-auto gap-2"
          >
            <Share2 size={15} />
            {copied ? "Copied!" : "Share Result"}
          </Button>

          <Link href={`/interview?type=${type}`}>
            <Button className="w-full sm:w-auto gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              <RotateCcw size={15} /> Retry
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Breakdown ── */}
      <div className="glass border border-border rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Breakdown</h2>
          <p className="text-xs text-muted-foreground">Click a question to expand</p>
        </div>

        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No interview data available</p>
        ) : (
          data.map((item, i) => (
            <QuestionCard key={i} item={item} index={i} />
          ))
        )}
      </div>
    </div>
  );
}