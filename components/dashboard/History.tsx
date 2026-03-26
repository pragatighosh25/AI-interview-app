"use client";

import { useEffect, useState } from "react";

type Interview = {
  id: string;
  score: number;
  type: string;
  createdAt: string;
};

export default function History() {
  const [data, setData] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/history");

      let json = null;

      try {
        json = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch history");
      }

      setData(Array.isArray(json) ? json : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="glass border border-border rounded-2xl p-6 h-[320px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4">
        Interview History
      </h3>

      {loading ? (
        // 🔥 SKELETON LIST
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
              <div className="h-4 w-10 bg-muted rounded" />
            </div>
          ))}
        </div>

      ) : error ? (
        <div className="text-sm text-red-500 space-y-2">
          <p>{error}</p>
          <button onClick={fetchHistory} className="underline text-xs">
            Retry
          </button>
        </div>

      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No interviews yet
        </p>

      ) : (
        <div className="space-y-4 overflow-y-auto custom-scroll flex-1 pr-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-border pb-3 hover:opacity-80 transition"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <span
                className={`text-sm font-semibold ${getScoreColor(
                  item.score
                )}`}
              >
                {item.score.toFixed(1)}/10
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}