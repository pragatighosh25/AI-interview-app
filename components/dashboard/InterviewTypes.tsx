"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code, Database, BarChart3, Palette, Server, ChevronDown, FileText } from "lucide-react";

const types = [
  { name: "Frontend", icon: Code },
  { name: "Backend", icon: Server },
  { name: "Data Analyst", icon: BarChart3 },
  { name: "Design", icon: Palette },
  { name: "DevOps", icon: Database },
  { name: "Resume", icon: FileText },
];

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[180px]">
      
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-2.5 rounded-full 
        bg-muted/40 border border-border backdrop-blur-md
        hover:bg-muted/60 transition-all duration-200
        focus:outline-none"
      >
        <span className="text-sm font-medium">{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute mt-2 w-full rounded-xl border border-border 
          bg-background/80 backdrop-blur-xl shadow-lg overflow-hidden z-50
          animate-in fade-in zoom-in-95"
        >
          {options.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer transition
              hover:bg-muted ${
                opt === value
                  ? "bg-muted text-white"
                  : "text-muted-foreground"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterviewTypes() {
  const router = useRouter();

  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5 Questions");

  const startInterview = (type: string) => {
    if (type === "Resume") {
    router.push("/resume"); // 🆕 new page
    return;
  }
    const countNumber = Number(count.split(" ")[0]);

    router.push(
      `/interview?type=${type}&difficulty=${difficulty}&count=${countNumber}`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
        
        <Dropdown
          value={difficulty}
          options={["Easy", "Medium", "Hard"]}
          onChange={setDifficulty}
        />

        <Dropdown
          value={count}
          options={["3 Questions", "5 Questions", "10 Questions"]}
          onChange={setCount}
        />

      </div>

      {/* Types */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {types.map((type, i) => {
          const Icon = type.icon;

          return (
            <div
              key={i}
              onClick={() => startInterview(type.name)}
              className="glass card-glow border border-border rounded-2xl p-5 
              flex flex-col items-center justify-center gap-3 cursor-pointer
              hover:scale-[1.03] transition-all duration-200"
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500">
                <Icon className="text-white w-5 h-5" />
              </div>

              <p className="text-sm font-medium">{type.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}