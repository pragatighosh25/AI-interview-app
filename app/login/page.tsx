"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      window.location.href = "/dashboard";
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex">
      
      {/* Left */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground">
            Login to continue your interview prep
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
            />

            <Button
              type="submit"
              className="w-full btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
            >
              Login
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right (same improved panel) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        
        {/* Background gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/30 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-cyan-500/30 blur-[100px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          
          <h2 className="text-4xl font-bold mb-3 gradient-text">
            IntervueX
          </h2>

          <p className="text-muted-foreground mb-8 max-w-sm">
            Practice interviews with AI, track progress, and get real-time feedback.
          </p>

          {/* Mock Card */}
          <div className="glass border border-border rounded-2xl p-5 w-[320px] card-glow animate-float">
            
            <div className="space-y-4">
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Progress
                </p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-cyan-400" />
                </div>
              </div>

              <div className="space-y-2">
                {["Frontend", "Backend", "Data"].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item}</span>
                    <span className="text-muted-foreground">
                      {7 + i}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}