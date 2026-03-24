"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", score: 5 },
  { name: "Tue", score: 6 },
  { name: "Wed", score: 7 },
  { name: "Thu", score: 6 },
  { name: "Fri", score: 8 },
  { name: "Sat", score: 9 },
];

export default function ProgressChart() {
  return (
    <div className="glass border border-border rounded-2xl p-6 h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Progress</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c5cff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}