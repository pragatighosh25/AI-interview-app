"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔐 FORGOT PASSWORD FLOW
      if (isForgot) {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Reset failed");
        }

        toast.success("Password reset successful 🎉");

        // reset state
        setIsForgot(false);
        setNewPassword("");
        setPassword("");

        return;
      }

      // 🔐 LOGIN FLOW
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      
      {/* Left */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          
          <h1 className="text-3xl font-bold">
            {isForgot ? "Reset Password 🔐" : "Welcome back 👋"}
          </h1>

          <p className="text-muted-foreground">
            {isForgot
              ? "Enter your email and new password"
              : "Login to continue your interview prep"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 rounded-xl bg-muted border border-border outline-none disabled:opacity-50"
            />

            {!isForgot ? (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3 rounded-xl bg-muted border border-border outline-none disabled:opacity-50"
              />
            ) : (
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3 rounded-xl bg-muted border border-border outline-none disabled:opacity-50"
              />
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white disabled:opacity-50"
            >
              {loading
                ? isForgot
                  ? "Resetting..."
                  : "Logging in..."
                : isForgot
                ? "Reset Password"
                : "Login"}
            </Button>
          </form>

          {/* Toggle */}
          <p
            onClick={() => {
              setIsForgot(!isForgot);
              setPassword("");
              setNewPassword("");
            }}
            className="text-sm text-purple-400 cursor-pointer text-center hover:underline"
          >
            {isForgot ? "Back to Login" : "Forgot Password?"}
          </p>

          {/* Signup link */}
          {!isForgot && (
            <p className="text-sm text-muted-foreground text-center">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Right panel (unchanged) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/30 blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-cyan-500/30 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <h2 className="text-4xl font-bold mb-3 gradient-text">
            IntervueX
          </h2>

          <p className="text-muted-foreground mb-8 max-w-sm">
            Practice interviews with AI, track progress, and get real-time feedback.
          </p>
        </div>
      </div>
    </main>
  );
}