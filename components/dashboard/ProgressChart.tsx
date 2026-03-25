"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Interview = {
  id: string;
  score: number;
  createdAt: string;
};

export default function ScoreGraph({ data }: { data: Interview[] }) {
  // format data for chart
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      date: new Date(item.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      score: item.score,
    }));

  return (
    <div className="glass border border-border rounded-2xl p-6 h-[320px]">
      <h3 className="text-lg font-semibold mb-4">
        Performance Trend
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#888" />
          <YAxis domain={[0, 10]} stroke="#888" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}