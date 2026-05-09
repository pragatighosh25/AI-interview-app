import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    if (newPassword.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const token = await prisma.otpToken.findFirst({
      where: { email: email.toLowerCase(), code: otp },
    });

    if (!token)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    if (token.expiresAt < new Date())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashed },
    });

    // Clean up used OTP
    await prisma.otpToken.deleteMany({ where: { email: email.toLowerCase() } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}