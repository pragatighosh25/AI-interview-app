"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    // 🚀 redirect with resume text
    router.push(
      `/interview?type=resume&difficulty=Medium&count=5&resume=${encodeURIComponent(
        data.text
      )}`
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-20 space-y-6 text-center">
      <h1 className="text-2xl font-bold">Upload Resume</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="px-6 py-3 bg-purple-600 text-white rounded-xl"
      >
        {loading ? "Processing..." : "Start Interview"}
      </button>
    </div>
  );
}