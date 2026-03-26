"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStart = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "h-14 bg-background/80 backdrop-blur-xl border-b border-border"
            : "h-16 bg-background/60 backdrop-blur-md"
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

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>

            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>

                <Button
                  onClick={handleStart}
                  className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                >
                  Start Interview
                </Button>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-600"
                >
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-lg">
          
          <Link href="/" onClick={() => setOpen(false)}>
            <Button variant="ghost">Home</Button>
          </Link>

          {!session ? (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost">Login</Button>
              </Link>

              <Button
                onClick={() => {
                  handleStart();
                  setOpen(false);
                }}
                className="btn-glow bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
              >
                Start Interview
              </Button>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <Button variant="ghost">Dashboard</Button>
              </Link>

              <Button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                variant="destructive"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}