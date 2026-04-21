export const runtime = "nodejs";

import { NextResponse } from "next/server";

const pdfParse = require("pdf-parse-new");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await pdfParse(buffer);

    const cleaned = data.text
      ?.replace(/\s+/g, " ")
      ?.trim();

    if (!cleaned) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: cleaned,
    });

  } catch (err: any) {
    console.error("PDF ERROR:", err);

    return NextResponse.json(
      {
        error: "Failed to parse PDF",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}