"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleUpload = async () => {
  if (!file) {
    alert("Please upload a PDF resume");
    return;
  }

  try {
    setLoading(true);

    // ✅ dynamic import only on client side
    const pdfToText = (await import("react-pdftotext")).default;

    const extractedText = await pdfToText(file);

    if (!extractedText?.trim()) {
      alert("Could not extract text from PDF");
      return;
    }

    sessionStorage.setItem("resumeText", extractedText);

    router.push(
      "/interview?type=resume&difficulty=Medium&count=5"
    );
  } catch (err) {
    console.error(err);
    alert("Failed to process PDF");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-xl mx-auto mt-20 space-y-6 text-center">
      <h1 className="text-2xl font-bold">
        Upload Resume
      </h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
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