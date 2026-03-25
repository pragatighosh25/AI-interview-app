"use client";

import { useEffect, useState } from "react";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";

export default function DashboardClient() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then(setData);
  }, []);

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