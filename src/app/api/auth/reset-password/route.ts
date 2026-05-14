import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { hashEmailOtp, normalizeEmail } from "@/lib/email-verification";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const email = normalizeEmail(String(payload?.email ?? ""));
    const otp = String(payload?.otp ?? "").trim();
    const newPassword = String(payload?.newPassword ?? "");

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP and new password are required." },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "OTP must be exactly 6 digits." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordResetOtpHash: true,
        passwordResetOtpExpiresAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return NextResponse.json(
        { message: "No reset OTP found. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { message: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    const inputHash = hashEmailOtp(email, otp);
    if (inputHash !== user.passwordResetOtpHash) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetOtpHash: null,
        passwordResetOtpExpiresAt: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful. You can now log in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[RESET_PASSWORD] Failed to reset password:", error);
    return NextResponse.json(
      { message: "Failed to reset password.", error: error.message },
      { status: 500 }
    );
  }
}
