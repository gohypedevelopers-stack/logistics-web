import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  generateEmailOtp,
  getPasswordResetOtpExpiresAt,
  getPasswordResetOtpExpiryMinutes,
  hashEmailOtp,
  normalizeEmail,
} from "@/lib/email-verification";
import { sendPasswordResetOtpEmail } from "@/lib/email";

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
        passwordResetLastSentAt: true,
      },
    });

    // Return generic response to avoid account enumeration.
    if (!user) {
      return NextResponse.json(
        { message: "If this email exists, a reset OTP has been sent." },
        { status: 200 }
      );
    }

    if (user.passwordResetLastSentAt) {
      const secondsSinceLastSend = Math.floor(
        (Date.now() - user.passwordResetLastSentAt.getTime()) / 1000
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
    const otpExpiresAt = getPasswordResetOtpExpiresAt();
    const otpExpiryMinutes = getPasswordResetOtpExpiryMinutes();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetOtpHash: otpHash,
        passwordResetOtpExpiresAt: otpExpiresAt,
        passwordResetLastSentAt: new Date(),
      },
    });

    await sendPasswordResetOtpEmail(email, user.name ?? "Customer", otp, otpExpiryMinutes);

    return NextResponse.json(
      { message: "If this email exists, a reset OTP has been sent." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[FORGOT_PASSWORD] Failed to send reset OTP:", error);
    return NextResponse.json(
      { message: "Failed to process forgot password request.", error: error.message },
      { status: 500 }
    );
  }
}
