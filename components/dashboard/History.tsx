"use client";

import { useRouter } from "next/navigation";
import {
  Code2, Server, BarChart2, Palette, Container, FileText, Zap
} from "lucide-react";

type Interview = {
  id: string;
  score: number;
  type: string;
  createdAt: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  frontend:       <Code2 size={14} />,
  backend:        <Server size={14} />,
  "data analyst": <BarChart2 size={14} />,
  design:         <Palette size={14} />,
  devops:         <Container size={14} />,
  resume:         <FileText size={14} />,
};

const getIcon = (type: string) =>
  TYPE_ICONS[type.toLowerCase()] ?? <Zap size={14} />;

const getScoreMeta = (score: number) => {
  if (score >= 8) return { color: "text-green-400", dot: "bg-green-400" };
  if (score >= 6) return { color: "text-yellow-400", dot: "bg-yellow-400" };
  if (score >= 4) return { color: "text-orange-400", dot: "bg-orange-400" };
  return { color: "text-red-400", dot: "bg-red-400" };
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function History({ data }: { data: Interview[] }) {
  const router = useRouter();

  const avg = data.length
    ? (data.reduce((s, i) => s + i.score, 0) / data.length).toFixed(1)
    : null;

  return (
    <div className="glass border border-border rounded-2xl p-6 h-[320px] flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interview History</h3>
        {data.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{data.length} sessions</span>
            <span className={`font-semibold ${getScoreMeta(Number(avg)).color}`}>
              avg {avg}/10
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <Zap size={24} className="text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">No interviews yet</p>
          <button
            onClick={() => router.push("/interview")}
            className="text-xs text-purple-400 hover:underline mt-1"
          >
            Start your first one →
          </button>
        </div>
      ) : (
        <div className="space-y-1 overflow-y-auto custom-scroll flex-1 pr-1">
          {data.map((item) => {
            const meta = getScoreMeta(item.score);
            return (
              <button
                key={item.id}
                onClick={() => router.push(`/interview/${item.id}/review`)}
                className="w-full flex justify-between items-center
                           border-b border-border pb-3 pt-1
                           hover:bg-white/5 rounded-lg px-2 -mx-2
                           transition-colors group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground group-hover:text-purple-400 transition-colors">
                    {getIcon(item.type)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  <span className={`text-sm font-semibold ${meta.color}`}>
                    {item.score.toFixed(1)}/10
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}