"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-20 px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
              src="/image.png"
              alt="IntervueX logo"
              className="h-8 w-auto object-contain group-hover:scale-105 transition"
            />
          <span className="text-sm font-semibold">IntervueX</span>
        </div>

        {/* Links */}
        

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} IntervueX
        </p>
      </div>
    </footer>
  );
}