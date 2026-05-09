"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => router.push(session ? "/dashboard" : "/login");
  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "h-14 bg-background/80 backdrop-blur-xl border-b border-border"
          : "h-16 bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/image.png"
              alt="IntervueX logo"
              className="h-7 w-auto object-contain group-hover:scale-105 transition"
            />
            <span className="text-sm font-semibold tracking-tight hidden sm:block">
              IntervueX
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/"
              className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
              Home
            </Link>

            {!session ? (
              <>
                <Link href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                  Login
                </Link>
                <button
                  onClick={handleStart}
                  className="ml-2 flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg
                    bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 transition-opacity"
                >
                  Start free <ChevronRight size={13} />
                </button>
              </>
            ) : (
              <>
                <Link href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-sm text-muted-foreground hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-5">
          <Link href="/" onClick={() => setOpen(false)}
            className="text-base text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>

          {!session ? (
            <>
              <Link href="/login" onClick={() => setOpen(false)}
                className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <button
                onClick={() => { handleStart(); setOpen(false); }}
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl
                  bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 transition-opacity"
              >
                Start free <ChevronRight size={13} />
              </button>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="text-base text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false); }}
                className="text-base text-red-400 hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}