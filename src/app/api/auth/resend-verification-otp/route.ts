import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateEmailOtp,
  getEmailOtpExpiresAt,
  getEmailOtpExpiryMinutes,
  hashEmailOtp,
  normalizeEmail,
} from "@/lib/email-verification";
import { sendVerificationOtpEmail } from "@/lib/email";

const RESEND_COOLDOWN_SECONDS = 60;

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const email = normalizeEmail(String(payload?.email ?? ""));

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        emailVerified: true,
        emailVerificationLastSentAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "If this email exists, a new OTP has been sent." },
        { status: 200 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. Please sign in." },
        { status: 200 }
      );
    }

    if (user.emailVerificationLastSentAt) {
      const secondsSinceLastSend = Math.floor(
        (Date.now() - user.emailVerificationLastSentAt.getTime()) / 1000
      );
      const waitSeconds = RESEND_COOLDOWN_SECONDS - secondsSinceLastSend;

      if (waitSeconds > 0) {
        return NextResponse.json(
          { message: `Please wait ${waitSeconds}s before requesting another OTP.` },
          { status: 429 }
        );
      }
    }

    const otp = generateEmailOtp();
    const otpHash = hashEmailOtp(email, otp);
    const otpExpiresAt = getEmailOtpExpiresAt();
    const otpExpiryMinutes = getEmailOtpExpiryMinutes();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationOtpHash: otpHash,
        emailVerificationOtpExpiresAt: otpExpiresAt,
        emailVerificationLastSentAt: new Date(),
      },
    });

    await sendVerificationOtpEmail(email, user.name ?? "Customer", otp, otpExpiryMinutes);

    return NextResponse.json(
      { message: "A new OTP has been sent to your email." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[RESEND_OTP] Failed to resend OTP:", error);
    return NextResponse.json(
      { message: "Failed to resend OTP.", error: error.message },
      { status: 500 }
    );
  }
}
