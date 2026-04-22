export const runtime = "nodejs";

import { NextResponse } from "next/server";

const PDFParser = require("pdf2json");

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

    const pdfParser = new PDFParser();

    const text = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        reject(errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent();
        resolve(rawText);
      });

      pdfParser.parseBuffer(buffer);
    });

    const cleaned = text
      .replace(/\s+/g, " ")
      .trim();

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
      },
      { status: 500 }
    );
  }
}