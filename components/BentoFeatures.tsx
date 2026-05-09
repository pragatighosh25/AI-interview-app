"use client";

import { Brain, BarChart3, Sparkles, Clock, Mic } from "lucide-react";

export default function BentoFeatures() {
  return (
    <section className="w-full px-6 pb-28">
      <div className="max-w-5xl mx-auto">

        {/* Divider label */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium">
            What you get
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Wide */}
          <div className="md:col-span-2 group relative rounded-2xl p-6 border border-border
            bg-background/40 backdrop-blur-sm hover:bg-muted/20 hover:border-purple-500/25
            transition-all duration-300 overflow-hidden min-h-[140px] flex flex-col justify-between">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-br from-purple-500/[0.07] to-transparent pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border flex items-center justify-center
              group-hover:border-purple-500/30 transition-colors">
              <Brain size={14} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">AI Generated Questions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Realistic questions tailored to your role, resume, and difficulty level.
              </p>
            </div>
          </div>

          {/* Tall card spanning 2 rows */}
          <div className="md:row-span-2 group relative rounded-2xl p-6 border border-border
            bg-background/40 backdrop-blur-sm hover:bg-muted/20 hover:border-purple-500/25
            transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-br from-cyan-500/[0.07] to-transparent pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border flex items-center justify-center
              group-hover:border-purple-500/30 transition-colors">
              <Sparkles size={14} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="space-y-2 my-4">
              {[
                { label: "Clarity",   w: "82%" },
                { label: "Depth",     w: "58%" },
                { label: "Relevance", w: "91%" },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs text-muted-foreground/60 mb-1">
                    <span>{d.label}</span><span>{d.w}</span>
                  </div>
                  <div className="h-0.5 bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                      style={{ width: d.w }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1">Instant Feedback</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scored answers with model responses after every question.
              </p>
            </div>
          </div>

          {/* Small cards */}
          {[
            { icon: Mic,      title: "Voice Input",            desc: "Speak your answers naturally, just like a real interview." },
            { icon: BarChart3, title: "Performance Analytics", desc: "Track your score trend and growth across every session." },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group relative rounded-2xl p-6 border border-border
                bg-background/40 backdrop-blur-sm hover:bg-muted/20 hover:border-purple-500/25
                transition-all duration-300 overflow-hidden min-h-[140px] flex flex-col justify-between">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                  bg-gradient-to-br from-purple-500/[0.07] to-transparent pointer-events-none" />
                <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border flex items-center justify-center
                  group-hover:border-purple-500/30 transition-colors mb-3">
                  <Icon size={14} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}

          {/* Full-width bottom */}
          <div className="md:col-span-3 group relative rounded-2xl p-6 border border-border
            bg-background/40 backdrop-blur-sm hover:bg-muted/20 hover:border-purple-500/25
            transition-all duration-300 overflow-hidden min-h-[100px] flex items-center gap-6">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
              bg-gradient-to-r from-purple-500/[0.07] to-cyan-500/[0.04] pointer-events-none" />
            <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border flex-shrink-0 flex items-center justify-center
              group-hover:border-purple-500/30 transition-colors">
              <Clock size={14} className="text-muted-foreground group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">Real Interview Simulation</h3>
              <p className="text-xs text-muted-foreground">
                Timed, structured sessions across Frontend, Backend, DevOps, Design, and Resume tracks.
              </p>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
}