import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 🔐 AUTH CHECK (fixed)
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { score, type, data } = body;

    // ❌ Input validation
    if (score === undefined || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔍 Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }, // ⚡ optimized
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 💾 Save interview
    await prisma.interview.create({
      data: {
        userId: user.id,
        type,
        score,
        data: data ?? null, // ✅ safe fallback
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("INTERVIEW SAVE ERROR:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}