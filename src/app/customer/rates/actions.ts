"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { createQuotationRequest } from "@/lib/quotation-utils";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

function buildQuoteNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QT-${stamp}-${suffix}`;
}

export async function requestQuoteAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You are not authorized to perform this action.");
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!customer) {
    throw new Error("Customer profile not found.");
  }

  const originCountryId = cleanValue(formData, "originCountryId");
  const destinationCountryId = cleanValue(formData, "destinationCountryId");
  const weightValue = cleanValue(formData, "weight");
  const pcsValue = cleanValue(formData, "pcs");
  const declaredValue = cleanValue(formData, "declaredValue");
  const notes = cleanValue(formData, "notes");

  if (!originCountryId || !destinationCountryId) {
    throw new Error("Origin and destination country are required.");
  }

  const [originCountry, destinationCountry] = await Promise.all([
    prisma.country.findUnique({ where: { id: originCountryId } }),
    prisma.country.findUnique({ where: { id: destinationCountryId } }),
  ]);

  if (!originCountry || !destinationCountry) {
    throw new Error("Selected country was not found.");
  }

  const weight = weightValue ? Number(weightValue) : null;
  const pcs = pcsValue ? Number(pcsValue) : null;
  const insuredValue = declaredValue ? Number(declaredValue) : null;

  const routeLabel = `${originCountry.name} (${originCountry.code}) to ${destinationCountry.name} (${destinationCountry.code})`;
  const descriptionParts = [
    routeLabel,
    pcs ? `${pcs} pcs` : null,
    notes ?? null,
  ].filter(Boolean);

  await createQuotationRequest({
    quoteNumber: buildQuoteNumber(),
    customerId: customer.id,
    description: descriptionParts.join(" | "),
    weight,
    amount: insuredValue ?? 0,
  });

  revalidatePath("/customer/rates");
  revalidatePath("/customer/dashboard");
  revalidatePath("/admin/dashboard");
}
