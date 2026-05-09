"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleStart = () => {
    if (status === "loading") return;
    router.push(session ? "/dashboard" : "/login");
  };

  return (
    <section className="relative w-full pt-32 pb-24 px-6 flex items-center justify-center">

      {/* Background glows — NO overflow-hidden so they bleed into bento below */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-600/20 blur-[140px]" />
        <div className="absolute top-40 right-1/4 w-[350px] h-[300px] bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="max-w-3xl w-full mx-auto flex flex-col items-center text-center gap-6">

        {/* Pill badge */}
        <span className="text-xs font-medium text-purple-400 bg-purple-400/10 border border-purple-400/20
          rounded-full px-3 py-1 tracking-wide">
          AI-powered interview prep
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-[3.75rem] font-bold leading-[1.1] tracking-tight">
          Crack your next<br />
          <span className="gradient-text">interview</span>
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-muted-foreground max-w-md">
          Practice real questions, get instant AI feedback, and track your progress.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
          <Button
            onClick={handleStart}
            disabled={status === "loading"}
            className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white
              px-6 py-5 text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            {status === "loading" ? "Loading..." : session ? "Go to Dashboard" : "Start for free"}
            <ChevronRight size={15} />
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="px-6 py-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See how it works
          </Button>
        </div>

      </div>
    </section>
  );
}