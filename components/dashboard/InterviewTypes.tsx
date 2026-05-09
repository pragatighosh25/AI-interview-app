"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Code, Server, BarChart3, Palette,
  Container, ChevronDown, FileText, ChevronRight
} from "lucide-react";

const types = [
  { name: "Frontend",     icon: Code,      gradient: "from-purple-500 to-purple-400" },
  { name: "Backend",      icon: Server,    gradient: "from-purple-600 to-violet-400" },
  { name: "Data Analyst", icon: BarChart3, gradient: "from-violet-500 to-purple-400" },
  { name: "Design",       icon: Palette,   gradient: "from-purple-500 to-cyan-500"   },
  { name: "DevOps",       icon: Container, gradient: "from-cyan-600 to-cyan-400"     },
  { name: "Resume",       icon: FileText,  gradient: "from-purple-600 to-cyan-500", isSpecial: true },
];
function Dropdown({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-1" ref={ref}>
      <span className="text-xs text-muted-foreground pl-1">{label}</span>
      <div className="relative w-[160px]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-full
          bg-muted/40 border border-border backdrop-blur-md
          hover:bg-muted/60 transition-all duration-200 focus:outline-none"
        >
          <span className="text-sm font-medium">{value}</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute mt-2 w-full rounded-xl border border-border
          bg-background/90 backdrop-blur-xl shadow-xl overflow-hidden z-50
          animate-in fade-in zoom-in-95 duration-100">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                hover:bg-muted/60 ${opt === value ? "text-white font-medium" : "text-muted-foreground"}`}
              >
                {opt}
                {opt === value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function InterviewTypes() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5 Questions");
  const [starting, setStarting] = useState<string | null>(null);

  const startInterview = (type: string) => {
    setStarting(type);
    
    if (type === "Resume") {
  const countNumber = Number(count.split(" ")[0]);
  router.push(`/resume?difficulty=${difficulty}&count=${countNumber}`);
  return;
};
    const countNumber = Number(count.split(" ")[0]);
    router.push(`/interview?type=${type}&difficulty=${difficulty}&count=${countNumber}`);
  };

  return (
    <div className="space-y-5">

      {/* Config row with label */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider pl-1">
          Configure your session
        </p>
        <div className="flex flex-wrap gap-3">
          <Dropdown
            label="Difficulty"
            value={difficulty}
            options={["Easy", "Medium", "Hard"]}
            onChange={setDifficulty}
          />
          <Dropdown
            label="Questions"
            value={count}
            options={["3 Questions", "5 Questions", "10 Questions"]}
            onChange={setCount}
          />
        </div>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {types.map((type) => {
          const Icon = type.icon;
          const isLoading = starting === type.name;

          return (
            <button
              key={type.name}
              onClick={() => startInterview(type.name)}
              disabled={!!starting}
              className={`
                glass border rounded-2xl p-5
                flex flex-col items-center justify-center gap-3
                transition-all duration-200 group relative overflow-hidden
                ${type.isSpecial
                  ? "border-purple-500/40 col-span-2 sm:col-span-1 flex-row sm:flex-col justify-start sm:justify-center"
                  : "border-border"
                }
                ${isLoading
                  ? "scale-95 opacity-70"
                  : "hover:scale-[1.03] hover:border-purple-500/30 cursor-pointer"
                }
                ${starting && !isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {/* Icon */}
              <div className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} 
                transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}>
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <Icon className="text-white w-5 h-5" />
                }
              </div>

              <div className="flex flex-col items-center sm:items-center gap-0.5 text-center">
                <p className="text-sm font-medium">{type.name}</p>
                {type.isSpecial && (
                  <p className="text-xs text-muted-foreground">Tailored to your CV</p>
                )}
              </div>

              {/* Hover arrow */}
              {!isLoading && (
                <ChevronRight
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                  text-muted-foreground opacity-0 group-hover:opacity-100
                  translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active config hint */}
      <p className="text-xs text-muted-foreground pl-1">
        Starting a{" "}
        <span className="text-purple-400 font-medium">{difficulty.toLowerCase()}</span>{" "}
        session with{" "}
        <span className="text-purple-400 font-medium">{count.toLowerCase()}</span>
      </p>
    </div>
  );
}