import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: "CUSTOMER", // Using the Role enum string
        },
      });

      await tx.customerProfile.create({
        data: {
          userId: user.id,
          phone: phone || null,
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: result.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Check for specific Prisma errors
    if (error.code === "P1012") {
      return new Response("Error: Prisma schema validation failed. The 'url' property is not allowed in schema.prisma for this version.", { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error during registration", error: error.message },
      { status: 500 }
    );
  }
}
