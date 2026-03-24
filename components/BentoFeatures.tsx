"use client";

import { Brain, BarChart3, Sparkles, Clock } from "lucide-react";

const features = [
  {
    title: "AI Generated Questions",
    desc: "Get realistic interview questions tailored to your role instantly.",
    icon: Brain,
    className: "md:col-span-2",
  },
  {
    title: "Instant Feedback",
    desc: "Know exactly where you stand with AI-powered evaluation.",
    icon: Sparkles,
    className: "",
  },
  {
    title: "Performance Analytics",
    desc: "Track your growth with detailed progress insights.",
    icon: BarChart3,
    className: "",
  },
  {
    title: "Real Interview Simulation",
    desc: "Experience timed, structured interviews just like real ones.",
    icon: Clock,
    className: "md:col-span-2",
  },
];

export default function BentoFeatures() {
  return (
    <section className="w-full px-6 pb-24 flex justify-center">
  <div className="max-w-6xl w-full mx-auto flex flex-col items-center text-center">
    
    {/* Heading */}
    <div className="mb-12">
      <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
        Everything you need to{" "}
        <span className="gradient-text">ace interviews</span>
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Built for students, devs, and job hunters who want real results.
      </p>
    </div>

    {/* Bento Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[180px] w-full">
      
      {features.map((feature, i) => {
        const Icon = feature.icon;

        return (
          <div
            key={i}
            className={`relative rounded-2xl p-6 border border-border glass card-glow flex flex-col justify-between text-left ${feature.className}`}
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.desc}
              </p>
            </div>

            {/* hover overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
          </div>
        );
      })}

    </div>
  </div>
</section>
  );
}