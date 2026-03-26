"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ResultsPanel() {
  const params = useSearchParams();
  const raw = params.get("data");
  const type = params.get("type") || "General";

  const [data, setData] = useState<any[]>([]);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const saved = useRef(false);

  // ✅ SAFE PARSE (VERY IMPORTANT)
  useEffect(() => {
    try {
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setData(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error("Invalid data:", err);
      setData([]);
    }
  }, [raw]);

  const total = data.reduce(
    (acc: number, item: any) => acc + (item?.result?.score || 0),
    0
  );

  const avg = data.length
    ? Number((total / data.length).toFixed(1))
    : 0;

  const getRemark = () => {
    if (avg >= 8) return "Excellent, You're interview ready!";
    if (avg >= 6) return "Good, Keep refining your answers.";
    return "Needs Improvement, Practice more!";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  // ✅ FIXED SAVE SESSION
  const saveSession = async () => {
    try {
      setSaving(true);
      setSaveError("");

      const res = await fetch("/api/interview", {
        method: "POST",
        body: JSON.stringify({
          score: avg,
          type,
          data,
        }),
      });

      let json = null;

      try {
        json = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to save session");
      }

    } catch (err: any) {
      console.error("SAVE FAILED:", err);
      setSaveError(err.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!saved.current && data.length) {
      saveSession();
      saved.current = true;
    }
  }, [data]);

  return (
    <div className="space-y-8">
      
      {/* Summary */}
      <div className="glass border border-border rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Final Result
        </h1>

        <p className="text-sm text-muted-foreground mb-4">
          {type} Interview
        </p>

        <p className="text-5xl font-bold gradient-text mb-4">
          {avg} / 10
        </p>

        <p className="text-muted-foreground mb-6">
          {getRemark()}
        </p>

        {/* ✅ SAVE STATUS */}
        {saving && (
          <p className="text-xs text-muted-foreground mb-2">
            Saving results...
          </p>
        )}

        {saveError && (
          <div className="text-red-500 text-sm mb-2">
            {saveError}{" "}
            <button
              onClick={saveSession}
              className="underline text-xs"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>

          <Link href={`/interview?type=${type}`}>
            <Button className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              Retry
            </Button>
          </Link>
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Breakdown
        </h2>

        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No data available
          </p>
        ) : (
          data.map((item: any, i: number) => (
            <div
              key={i}
              className="flex justify-between items-start gap-4 border-b border-border pb-4"
            >
              <div>
                <p className="font-medium mb-1">
                  {i + 1}. {item.question}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item?.result?.feedback || "No feedback"}
                </p>
              </div>

              <span
                className={`text-sm font-semibold ${getScoreColor(
                  item?.result?.score || 0
                )}`}
              >
                {item?.result?.score || 0}/10
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}