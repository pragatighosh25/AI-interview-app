"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Interview = {
  id: string;
  score: number;
  createdAt: string;
};

// Custom tooltip that matches your dark theme
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { score, date } = payload[0].payload;  // ← from payload, not label
  const color = score >= 7 ? "#4ade80" : score >= 5 ? "#facc15" : "#f87171";

  return (
    <div className="bg-background/95 border border-border rounded-xl px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-muted-foreground mb-1">{date}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        {score.toFixed(1)} / 10
      </p>
    </div>
  );
}

function TrendBadge({ data }: { data: { score: number }[] }) {
  if (data.length < 2) return null;

  const recentSlice = data.slice(-3);
  const olderSlice  = data.slice(0, 3);

  const recent = recentSlice.reduce((s, d) => s + d.score, 0) / recentSlice.length;
  const older  = olderSlice.reduce((s, d)  => s + d.score, 0) / olderSlice.length;
  const delta  = recent - older;

  if (Math.abs(delta) < 0.3) return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">
      <Minus size={12} /> Stable
    </span>
  );

  return delta > 0 ? (
    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
      <TrendingUp size={12} /> +{delta.toFixed(1)} improving
    </span>
  ) : (
    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
      <TrendingDown size={12} /> {delta.toFixed(1)} declining
    </span>
  );
}

export default function ScoreGraph({ data }: { data: Interview[] }) {
  const chartData = data
  .slice()
  .reverse()
  .map((item, index) => ({
    index,
    date: new Date(item.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    score: Number(item.score.toFixed(1)),
  }));

  const avg = data.length
    ? data.reduce((s, i) => s + i.score, 0) / data.length
    : 0;

  return (
    <div className="glass border border-border rounded-2xl p-6 h-[320px] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Performance Trend</h3>
          {data.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Avg score:{" "}
              <span className={`font-medium ${avg >= 7 ? "text-green-400" : avg >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                {avg.toFixed(1)}/10
              </span>
            </p>
          )}
        </div>
        <TrendBadge data={chartData} />
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/40 flex items-center justify-center">
            <TrendingUp size={20} className="text-muted-foreground opacity-40" />
          </div>
          <p className="text-sm text-muted-foreground">Complete interviews to see your trend</p>
        </div>

      ) : data.length === 1 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center">
          <p className="text-3xl font-bold text-purple-400">{data[0].score.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Complete more interviews to see your trend</p>
        </div>

      ) : (
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>

              {/* Gradient fill under the line */}
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
  dataKey="index"
  stroke="transparent"
  tick={{ fill: "#666", fontSize: 11 }}
  tickLine={false}
  axisLine={false}
  tickFormatter={(i) => chartData[i]?.date ?? ""}  // ← show date as label
/>
              <YAxis
                domain={[0, 10]}
                stroke="transparent"
                tick={{ fill: "#666", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                ticks={[0, 2, 4, 6, 8, 10]}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeDasharray: "4 4" }} />

              {/* "Pass threshold" reference line */}
              <ReferenceLine
                y={7}
                stroke="#4ade80"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
                label={{ value: "Target", position: "right", fill: "#4ade80", fontSize: 10, opacity: 0.6 }}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#scoreGradient)"
                dot={{ r: 3.5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#1a1a2e" }}
                activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}