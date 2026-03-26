"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStart = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative w-full pt-28 pb-20 px-6 flex items-center justify-center">
      
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center">
        
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Crack Your Next{" "}
          <span className="gradient-text">Interview</span>{" "}
          with IntervueX
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 mx-auto">
          Practice real interview questions, get instant feedback, and track your
          progress — all powered by AI.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          
          <Button
            onClick={handleStart}
            className="w-full sm:w-auto btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-5 text-lg flex items-center justify-center gap-2"
          >
            {session ? "Go to Dashboard" : "Start Interview"}
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="w-full sm:w-auto px-6 py-5 text-lg flex items-center justify-center gap-2 hover:border-purple-500"
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        
      </div>
    </section>
  );
}