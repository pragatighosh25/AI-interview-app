"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // scroll shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full fixed top-0 my-2 z-50 transition-all duration-300 ${
          isScrolled
            ? "h-14 bg-background/80 backdrop-blur-xl border-b border-border"
            : "h-16 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/image.png"
              alt="IntervueX logo"
              className="h-8 w-auto object-contain group-hover:scale-105 transition"
            />
            <span className="text-lg font-semibold tracking-tight hidden sm:block">
              IntervueX
            </span>
          </Link>

          {/* Desktop Links */}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Login</Button>
            <Button className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white">
              Start Interview
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={` fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-lg">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Login
          </Button>

          <Button
            className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
            onClick={() => setOpen(false)}
          >
            Start Interview
          </Button>
        </div>
      </div>
    </>
  );
}
