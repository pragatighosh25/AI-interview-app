"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, KeyRound, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [isForgot, setIsForgot]     = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isForgot) {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Reset failed");
        toast.success("Password reset successful!");
        setIsForgot(false);
        setNewPassword("");
        setPassword("");
        return;
      }

      const res = await signIn("credentials", {
        email, password, redirect: false,
      });
      if (!res?.error) {
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
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
            <h1 className="text-3xl font-bold tracking-tight">
              {isForgot ? "Reset your password" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isForgot
                ? "Enter your email and choose a new password"
                : "Continue your interview prep journey"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

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

            {/* Password field */}
            <div className="relative">
              {isForgot
                ? <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                : <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              }
              <input
                type={showPass ? "text" : "password"}
                placeholder={isForgot ? "New password" : "Password"}
                value={isForgot ? newPassword : password}
                onChange={(e) =>
                  isForgot
                    ? setNewPassword(e.target.value)
                    : setPassword(e.target.value)
                }
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

            {/* Forgot password toggle — only in login mode */}
            {!isForgot && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setIsForgot(true); setPassword(""); }}
                  className="text-xs text-muted-foreground hover:text-purple-400 transition-colors"
                >
                  Forgot password?
                </button>
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
                  {isForgot ? "Resetting..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isForgot ? "Reset Password" : "Sign in"}
                  <ChevronRight size={15} />
                </>
              )}
            </Button>
          </form>

          {/* Back to login */}
          {isForgot ? (
            <button
              onClick={() => { setIsForgot(false); setNewPassword(""); }}
              className="w-full text-sm text-muted-foreground hover:text-purple-400 transition-colors text-center"
            >
              ← Back to login
            </button>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-muted/10">

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-cyan-500/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center text-center px-10 gap-8">

          <div className="space-y-2">
            <h2 className="text-4xl font-bold gradient-text">Ready to practice?</h2>
            <h2 className="text-4xl font-bold text-foreground/40">We've got you covered.</h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs">
              Resume-aware questions, instant AI feedback, and performance tracking.
            </p>
          </div>

          {/* Mock feedback card */}
          <div className="glass border border-border rounded-2xl p-5 w-[300px] card-glow animate-float space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                Session complete
              </span>
              <span className="text-xs text-muted-foreground">5/5 questions</span>
            </div>

            {/* Score ring mock */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#ffffff10" strokeWidth="6" />
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#4ade80" strokeWidth="6"
                    strokeDasharray="120 150" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-400">8.2</span>
                </div>
              </div>
              <div className="text-left space-y-1">
                <p className="text-sm font-medium">Strong performance</p>
                <p className="text-xs text-muted-foreground">Top 20% this week</p>
              </div>
            </div>

            {/* Dimension bars */}
            {[
              { label: "Clarity",        pct: "85%" },
              { label: "Technical depth", pct: "72%" },
              { label: "Relevance",      pct: "90%" },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{d.label}</span>
                  <span>{d.pct}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: d.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/60">
            Your progress is saved across every session
          </p>
        </div>
      </div>
    </main>
  );
}