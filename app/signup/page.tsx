"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, ChevronRight } from "lucide-react";

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl font-bold gradient-text">IntervueX</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Start practicing. Land your dream job.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border
                focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                outline-none disabled:opacity-50 text-sm transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border
                focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                outline-none disabled:opacity-50 text-sm transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border
                focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                outline-none disabled:opacity-50 text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength hint */}
            {password.length > 0 && (
              <div className="flex gap-1.5 items-center">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      password.length > 10 ? "bg-green-400"
                      : password.length > 6  ? i < 2 ? "bg-yellow-400" : "bg-muted"
                      : i < 1 ? "bg-red-400" : "bg-muted"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {password.length > 10 ? "Strong" : password.length > 6 ? "Fair" : "Weak"}
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white
              hover:opacity-90 transition-opacity disabled:opacity-50 gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get started free
                  <ChevronRight size={15} />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-muted-foreground/60 text-center">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-muted/10">

        {/* Background glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-cyan-500/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center px-10 gap-8">

          <div className="space-y-2">
            <h2 className="text-4xl font-bold gradient-text">Practice smarter.</h2>
            <h2 className="text-4xl font-bold text-foreground/40">Interview better.</h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              AI-powered mock interviews tailored to your resume and domain.
            </p>
          </div>

          {/* Mock interview card */}
          <div className="glass border border-border rounded-2xl p-5 w-[300px] card-glow animate-float space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full">
                Frontend · Medium
              </span>
              <span className="text-xs text-muted-foreground">Q3/5</span>
            </div>

            {/* Fake question */}
            <div className="bg-muted/30 rounded-xl p-3">
              <p className="text-xs text-left leading-relaxed text-foreground/80">
                Explain the difference between <span className="text-purple-400">useEffect</span> and <span className="text-cyan-400">useLayoutEffect</span> in React.
              </p>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
              </div>
            </div>

            {/* Scores */}
            <div className="space-y-2 pt-1">
              {[
                { label: "Frontend", score: 8.2, color: "text-green-400" },
                { label: "Backend",  score: 7.1, color: "text-yellow-400" },
                { label: "Resume",   score: 9.0, color: "text-green-400" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-semibold ${item.color}`}>{item.score}/10</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <p className="text-xs text-muted-foreground/60">
            Join students already practicing with IntervueX
          </p>
        </div>
      </div>
    </main>
  );
}