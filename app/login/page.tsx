"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, KeyRound, ChevronRight } from "lucide-react";

// step: "login" | "forgot" | "otp" | "reset"
type Step = "login" | "forgot" | "otp" | "reset";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep]             = useState<Step>("login");
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [password, setPassword]     = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);

  // ── Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("credentials", { email, password, redirect: false });
      if (!res?.error) {
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Send OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Just move to reset step — OTP verified on final submit
    setStep("reset");
  };

  // ── Reset password ──
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      toast.success("Password reset successful!");
      setStep("login");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message);
      // If OTP invalid/expired, go back to OTP step
      if (err.message === "Invalid OTP" || err.message === "OTP expired") {
        setStep("otp");
      }
    } finally {
      setLoading(false);
    }
  };

  const headings: Record<Step, { title: string; sub: string }> = {
    login:  { title: "Welcome back",        sub: "Continue your interview prep journey" },
    forgot: { title: "Forgot password?",    sub: "Enter your email to receive an OTP" },
    otp:    { title: "Check your email",    sub: `We sent a 6-digit code to ${email}` },
    reset:  { title: "Set new password",    sub: "Choose a strong password" },
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
            <h1 className="text-3xl font-bold tracking-tight">{headings[step].title}</h1>
            <p className="text-muted-foreground text-sm">{headings[step].sub}</p>
          </div>

          {/* ── Login form ── */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  outline-none disabled:opacity-50 text-sm transition-all" />
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  outline-none disabled:opacity-50 text-sm transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => setStep("forgot")}
                  className="text-xs text-muted-foreground hover:text-purple-400 transition-colors">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white
                hover:opacity-90 transition-opacity disabled:opacity-50 gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                  : <>Sign in <ChevronRight size={15} /></>
                }
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="text-purple-400 hover:underline font-medium">Sign up free</Link>
              </p>
            </form>
          )}

          {/* ── Forgot: enter email ── */}
          {step === "forgot" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  outline-none disabled:opacity-50 text-sm transition-all" />
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white
                hover:opacity-90 transition-opacity disabled:opacity-50 gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</>
                  : <>Send OTP <ChevronRight size={15} /></>
                }
              </Button>

              <button type="button" onClick={() => setStep("login")}
                className="w-full text-sm text-muted-foreground hover:text-purple-400 transition-colors text-center">
                ← Back to login
              </button>
            </form>
          )}

          {/* ── OTP: enter code ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="6-digit OTP" value={otp} maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  outline-none text-sm transition-all tracking-[0.3em] font-mono" />
              </div>

              <Button type="submit" disabled={otp.length !== 6}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white
                hover:opacity-90 transition-opacity disabled:opacity-50 gap-2">
                Verify OTP <ChevronRight size={15} />
              </Button>

              <button type="button" onClick={handleSendOtp}
                className="w-full text-sm text-muted-foreground hover:text-purple-400 transition-colors text-center">
                Didn't receive it? Resend OTP
              </button>

              <button type="button" onClick={() => setStep("forgot")}
                className="w-full text-sm text-muted-foreground hover:text-purple-400 transition-colors text-center">
                 Change email
              </button>
            </form>
          )}

          {/* ── Reset: new password ── */}
          {step === "reset" && (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} placeholder="New password" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-muted/50 border border-border
                  focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                  outline-none text-sm transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white
                hover:opacity-90 transition-opacity disabled:opacity-50 gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</>
                  : <>Reset Password <ChevronRight size={15} /></>
                }
              </Button>

              <button type="button" onClick={() => setStep("otp")}
                className="w-full text-sm text-muted-foreground hover:text-purple-400 transition-colors text-center">
                 Back
              </button>
            </form>
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

          <div className="glass border border-border rounded-2xl p-5 w-[300px] card-glow animate-float space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                Session complete
              </span>
              <span className="text-xs text-muted-foreground">5/5 questions</span>
            </div>
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
            {[
              { label: "Clarity",         pct: "85%" },
              { label: "Technical depth", pct: "72%" },
              { label: "Relevance",       pct: "90%" },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{d.label}</span><span>{d.pct}</span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: d.pct }} />
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