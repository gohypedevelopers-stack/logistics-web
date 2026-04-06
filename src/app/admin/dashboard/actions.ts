"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

function parseQuotationRouteCodes(description: string | null) {
  if (!description) return null;

  const routeLabel = description.split(" | ")[0]?.trim();
  if (!routeLabel) return null;

  const match = routeLabel.match(/\(([A-Z]{2,3})\)\s+to\s+.*\(([A-Z]{2,3})\)$/);
  if (!match) return null;

  return {
    originCode: match[1],
    destinationCode: match[2],
  };
}

export async function updateQuotationStatusAction(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role === "CUSTOMER") {
    throw new Error("You are not authorized to perform this action.");
  }

  const quotationId = formData.get("quotationId");
  const nextStatus = formData.get("status");

  if (typeof quotationId !== "string" || !quotationId) {
    throw new Error("Quotation id is required.");
  }

  if (nextStatus !== "APPROVED" && nextStatus !== "REJECTED") {
    throw new Error("Invalid quotation status.");
  }

  if (nextStatus === "APPROVED") {
    const approvedPriceValue = cleanValue(formData, "approvedPrice");
    if (!approvedPriceValue) {
      throw new Error("Approved customer price is required.");
    }

    const approvedPrice = Number(approvedPriceValue);
    if (!Number.isFinite(approvedPrice) || approvedPrice < 0) {
      throw new Error("Approved customer price must be a valid number greater than or equal to zero.");
    }

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      select: {
        id: true,
        customerId: true,
        description: true,
        weight: true,
      },
    });

    if (!quotation) {
      throw new Error("Quotation request not found.");
    }

    if (quotation.weight == null) {
      throw new Error("Quotation weight is required before assigning a customer price.");
    }

    const routeCodes = parseQuotationRouteCodes(quotation.description);
    if (!routeCodes) {
      throw new Error("Unable to match this quotation to a route.");
    }

    const matchedRateCard = await prisma.rateCard.findFirst({
      where: {
        weightMin: {
          lte: quotation.weight,
        },
        weightMax: {
          gte: quotation.weight,
        },
        route: {
          isActive: true,
          originCountry: {
            code: routeCodes.originCode,
          },
          destinationCountry: {
            code: routeCodes.destinationCode,
          },
        },
      },
      orderBy: [{ weightMin: "asc" }, { weightMax: "asc" }],
      select: {
        id: true,
      },
    });

    if (!matchedRateCard) {
      throw new Error("No matching route rate band was found for this quotation.");
    }

    await prisma.$transaction([
      prisma.customerRateOverride.upsert({
        where: {
          customerId_rateCardId: {
            customerId: quotation.customerId,
            rateCardId: matchedRateCard.id,
          },
        },
        update: {
          price: approvedPrice,
        },
        create: {
          customerId: quotation.customerId,
          rateCardId: matchedRateCard.id,
          price: approvedPrice,
        },
      }),
      prisma.$executeRaw(Prisma.sql`
        UPDATE "Quotation"
        SET "status" = ${nextStatus}::"QuotationStatus",
            "updatedAt" = NOW()
        WHERE "id" = ${quotationId}
      `),
    ]);

    revalidatePath(`/admin/customers/${quotation.customerId}`);
  } else {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE "Quotation"
      SET "status" = ${nextStatus}::"QuotationStatus",
          "updatedAt" = NOW()
      WHERE "id" = ${quotationId}
    `);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/rates");
}
