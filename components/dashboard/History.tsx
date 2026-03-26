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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const json = await res.json();

        // ✅ Safe handling
        if (!res.ok) {
          console.error(json.error);
          setData([]);
          return;
        }

        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

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
        <p className="text-sm text-muted-foreground">
          Loading...
        </p>
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
              {/* Left */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {item.type}
                </span>

                <span className="text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              {/* Right */}
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