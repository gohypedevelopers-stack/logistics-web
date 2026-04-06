"use server";

import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createStaffAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as Role;
  const department = formData.get("department") as string;
  const position = formData.get("position") as string;

  if (!email || !password || !name || !role) {
    throw new Error("Please complete all required fields.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        role,
        staffProfile: {
          create: {
            department,
            position,
          },
        },
      },
    });

    revalidatePath("/admin/settings/staff");
    return { success: true };
  } catch (error) {
    console.error("Create staff error:", error);
    return { success: false, error: "This email address is already in use, or an internal error occurred." };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/admin/settings/staff");
    return { success: true };
  } catch (error) {
    console.error("Delete staff error:", error);
    return { success: false, error: "Unable to delete this user." };
  }
}
