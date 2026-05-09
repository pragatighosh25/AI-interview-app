"use client";

import { useEffect, useState } from "react";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";
import { AlertCircle, RefreshCw, Zap } from "lucide-react";
import Link from "next/link";

type Interview = {
  id: string;
  score: number;
  type: string;
  createdAt: string;
};

export default function DashboardClient() {
  const [data, setData]       = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // Error state
  if (error) return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <AlertCircle size={32} className="text-red-400 opacity-60" />
      <p className="text-sm text-muted-foreground">{error}</p>
      <button
        onClick={fetchHistory}
        className="flex items-center gap-2 text-sm text-purple-400 hover:underline"
      >
        <RefreshCw size={14} /> Try again
      </button>
    </div>
  );

  // Empty state — new user
  if (!loading && data.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
        <Zap size={28} className="text-purple-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">No interviews yet</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your first session to see your performance here.
        </p>
      </div>
      <Link
        href="#interview-types"
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 
        text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Start an interview
      </Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Graph — receives shared data, no extra fetch */}
      <div className="lg:col-span-2">
        {loading
          ? <div className="animate-pulse h-[320px] rounded-2xl bg-muted" />
          : <ProgressChart data={data} />
        }
      </div>

      {/* History — receives shared data, no extra fetch */}
      <div>
        {loading
          ? <div className="animate-pulse h-[320px] rounded-2xl bg-muted" />
          : <History data={data} />   // ← pass data as prop
        }
      </div>

    </div>
  );
}