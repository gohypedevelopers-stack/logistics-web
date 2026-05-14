import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashEmailOtp, normalizeEmail } from "@/lib/email-verification";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const email = normalizeEmail(String(payload?.email ?? ""));
    const otp = String(payload?.otp ?? "").trim();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be exactly 6 digits." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        emailVerificationOtpHash: true,
        emailVerificationOtpExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found for this email." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified." }, { status: 200 });
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
      return NextResponse.json(
        { message: "No OTP found. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (user.emailVerificationOtpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    const inputHash = hashEmailOtp(email, otp);
    if (inputHash !== user.emailVerificationOtpHash) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationOtpHash: null,
        emailVerificationOtpExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully. You can now sign in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[VERIFY_EMAIL] Verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify email.", error: error.message },
      { status: 500 }
    );
  }
}
