import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  generateEmailOtp,
  getEmailOtpExpiresAt,
  getEmailOtpExpiryMinutes,
  hashEmailOtp,
  normalizeEmail,
} from "@/lib/email-verification";
import { sendVerificationOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const name = String(payload?.name ?? "").trim();
    const email = normalizeEmail(String(payload?.email ?? ""));
    const password = String(payload?.password ?? "");
    const phone = String(payload?.phone ?? "").trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (existingUser?.emailVerified) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateEmailOtp();
    const otpHash = hashEmailOtp(email, otp);
    const otpExpiresAt = getEmailOtpExpiresAt();
    const otpExpiryMinutes = getEmailOtpExpiryMinutes();

    const user = await prisma.$transaction(async (tx) => {
      if (existingUser) {
        const updatedUser = await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            email,
            passwordHash: hashedPassword,
            role: "CUSTOMER",
            emailVerified: false,
            emailVerificationOtpHash: otpHash,
            emailVerificationOtpExpiresAt: otpExpiresAt,
            emailVerificationLastSentAt: new Date(),
          },
        });

        await tx.customerProfile.upsert({
          where: { userId: updatedUser.id },
          update: {
            phone: phone || null,
          },
          create: {
            userId: updatedUser.id,
            phone: phone || null,
          },
        });

        return updatedUser;
      }

      return tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: "CUSTOMER",
          emailVerified: false,
          emailVerificationOtpHash: otpHash,
          emailVerificationOtpExpiresAt: otpExpiresAt,
          emailVerificationLastSentAt: new Date(),
          customerProfile: {
            create: {
              phone: phone || null,
            },
          },
        },
      });
    });

    try {
      await sendVerificationOtpEmail(email, name, otp, otpExpiryMinutes);

      return NextResponse.json(
        {
          message: "Registration successful. OTP sent to your email.",
          userId: user.id,
          requiresEmailVerification: true,
          otpDeliveryFailed: false,
        },
        { status: 201 }
      );
    } catch (emailError: any) {
      console.error("[REGISTER] OTP email dispatch failed:", emailError);

      return NextResponse.json(
        {
          message:
            "Registration successful, but OTP email could not be sent right now. Please use Resend OTP on the verification page.",
          userId: user.id,
          requiresEmailVerification: true,
          otpDeliveryFailed: true,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("[REGISTER] Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration.", error: error.message },
      { status: 500 }
    );
  }
}
