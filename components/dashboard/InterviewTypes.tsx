"use client";

import { Code, Database, BarChart3, Palette, Server } from "lucide-react";

const types = [
  { name: "Frontend", icon: Code },
  { name: "Backend", icon: Server },
  { name: "Data Analyst", icon: BarChart3 },
  { name: "Design", icon: Palette },
  { name: "DevOps", icon: Database },
];

export default function InterviewTypes() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Interview Type</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {types.map((type, i) => {
          const Icon = type.icon;

          return (
            <div
              key={i}
              className="glass card-glow border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer"
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