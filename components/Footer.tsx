"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-20 px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold">IntervueX</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-white transition">
            Login
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} IntervueX
        </p>
      </div>
    </footer>
  );
}