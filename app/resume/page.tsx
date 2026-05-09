"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, X, ArrowRight, Sparkles } from "lucide-react";


export const dynamic = "force-dynamic";

function ResumeContent() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
 

  const difficulty = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("difficulty") || "Medium"
    : "Medium";
  const count = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("count") || "5"
    : "5";

  
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a PDF resume");
      return;
    }

    try {
      setLoading(true);
      const pdfToText = (await import("react-pdftotext")).default;
      const extractedText = await pdfToText(file);

      if (!extractedText?.trim()) {
        alert("Could not extract text from PDF");
        return;
      }

      sessionStorage.setItem("resumeText", extractedText);
      
      router.push(`/interview?type=resume&difficulty=${difficulty}&count=${count}`);
    } catch (err) {
      console.error(err);
      alert("Failed to process PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[200px] bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Upload your resume
          </h1>
          <p className="text-muted-foreground text-sm">
            We'll generate tailored interview questions based on your experience
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => !file && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-200 p-8
            flex flex-col items-center justify-center gap-4 text-center
            ${
              file
                ? "border-purple-500/40 bg-purple-500/5 cursor-default"
                : dragging
                  ? "border-purple-400/60 bg-purple-400/10 scale-[1.01] cursor-copy"
                  : "border-border bg-muted/20 hover:border-purple-500/30 hover:bg-muted/30 cursor-pointer"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {file ? (
            /* File selected state */
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/20 flex-shrink-0">
                <FileText size={22} className="text-purple-400" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground
                  hover:text-foreground transition-colors flex-shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            /* Empty state */
            <>
              <div
                className={`p-4 rounded-2xl border transition-all duration-200
                ${
                  dragging
                    ? "bg-purple-500/20 border-purple-400/40"
                    : "bg-muted/40 border-border"
                }`}
              >
                <Upload
                  size={24}
                  className={
                    dragging ? "text-purple-400" : "text-muted-foreground"
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop your PDF here, or{" "}
                  <span className="text-purple-400">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF only · Max 10MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* What to expect */}
        {!file && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Tailored questions", sub: "Based on your skills" },
              { label: "Realistic scenarios", sub: "Real-world problems" },
              { label: "Instant feedback", sub: "AI-scored answers" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-muted/10 p-3 text-center space-y-0.5"
              >
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`
            w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
            font-medium text-sm transition-all duration-200
            ${
              file && !loading
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/20"
                : "bg-muted/30 text-muted-foreground cursor-not-allowed border border-border"
            }
          `}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing resume...
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

export default function ResumePage() {   
  return (
    <Suspense fallback={null}>
      <ResumeContent />
    </Suspense>
  );
}
