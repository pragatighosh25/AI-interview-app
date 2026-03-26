"use client";

import { useEffect, useState } from "react";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";

export default function DashboardClient() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start true
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setError("");

        const res = await fetch("/api/history");

        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }

        const result = await res.json();
        setData(result);

      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ❌ ERROR UI (keep this)
  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Graph */}
      <div className="lg:col-span-2">
        {loading ? (
          // ✅ SKELETON
          <div className="animate-pulse h-[300px] rounded-2xl bg-muted" />
        ) : (
          <ProgressChart data={data} />
        )}
      </div>

      {/* History */}
      <div>
        {loading ? (
          // ✅ SKELETON
          <div className="animate-pulse h-[300px] rounded-2xl bg-muted" />
        ) : (
          <History />
        )}
      </div>

    </div>
  );
}