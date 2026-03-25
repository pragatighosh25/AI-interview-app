"use client";

import { useEffect, useState } from "react";

type Interview = {
  id: string;
  score: number;
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
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="glass border border-border rounded-2xl p-6 h-[300px]">
      <h3 className="text-lg font-semibold mb-4">History</h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No interviews yet
        </p>
      ) : (
        <div className="space-y-4 overflow-y-auto h-[220px] pr-1">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-border pb-2"
            >
              <span className="text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>

              <span className="text-sm text-muted-foreground">
                {item.score}/10
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}