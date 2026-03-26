"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error); // optional logging

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      
      <div className="glass border border-border rounded-2xl p-8 text-center space-y-4 max-w-md">
        
        <h1 className="text-2xl font-bold">
          Something broke 😭
        </h1>

        <p className="text-sm text-muted-foreground">
          Don’t worry, it’s not you (probably us).
        </p>

        <Button
          onClick={() => reset()}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
        >
          Try Again
        </Button>

      </div>
    </div>
  );
}