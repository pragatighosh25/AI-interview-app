import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();  // ← email is declared here
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.otpToken.deleteMany({ where: { email: email.toLowerCase() } });

    const code = generateOtp();  // ← code is declared here
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpToken.create({
      data: { email: email.toLowerCase(), code, expiresAt },
    });

    await resend.emails.send({
      from: "IntervueX <onboarding@resend.dev>",
      to: email,
      subject: "Your password reset OTP",
      html: `<p>Your OTP: <strong>${code}</strong>. Expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}