"use client";

import { useEffect, useState } from "react";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";

export default function DashboardClient() {
  const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      setLoading(true);
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
if (loading) {
  return <div className="p-6">Loading dashboard...</div>;
}
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
        <ProgressChart data={data} />
      </div>

      {/* History */}
      <div>
        <History />
      </div>

    </div>
  );
}