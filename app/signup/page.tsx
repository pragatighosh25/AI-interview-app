"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      window.location.href = "/login";
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex">
      
      {/* Left */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          
          <h1 className="text-3xl font-bold">Create account ✨</h1>
          <p className="text-muted-foreground">
            Start your AI interview journey today
          </p>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary outline-none"
            />

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
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
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
              
              {/* Progress */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Progress
                </p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-cyan-400" />
                </div>
              </div>

              {/* Scores */}
              <div className="space-y-2">
                {["Frontend", "Backend", "Data"].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
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