"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-20 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* Left: Logo + tagline */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">IntervueX</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Practice smarter with AI-powered interviews and real-time feedback.
          </p>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-col sm:flex-row gap-10">
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-white transition">Features</Link>
              <Link href="#" className="hover:text-white transition">Dashboard</Link>
              <Link href="#" className="hover:text-white transition">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-white transition">About</Link>
              <Link href="#" className="hover:text-white transition">Contact</Link>
              <Link href="#" className="hover:text-white transition">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} IntervueX. All rights reserved.</p>

        <div className="flex gap-4">
          <Link href="#" className="hover:text-white transition">Twitter</Link>
          <Link href="#" className="hover:text-white transition">GitHub</Link>
          <Link href="#" className="hover:text-white transition">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
}