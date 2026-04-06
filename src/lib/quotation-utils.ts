import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export const ACTIVE_QUOTATION_STATUSES = [
  "PENDING",
  "RESPONDED",
  "DRAFT",
  "SENT",
] as const;

type CountRow = {
  count: number | bigint;
};

type EnumValueRow = {
  value: string;
};

export type CustomerQuotationRecord = {
  id: string;
  quoteNumber: string;
  description: string | null;
  weight: number | null;
  amount: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminQuotationRequestRecord = CustomerQuotationRecord & {
  companyName: string | null;
  userName: string | null;
  userEmail: string | null;
};

function toCount(value: number | bigint | undefined) {
  if (typeof value === "bigint") return Number(value);
  return value ?? 0;
}

async function getQuotationStatusEnumValues() {
  const rows = await prisma.$queryRaw<EnumValueRow[]>(Prisma.sql`
    SELECT e.enumlabel::text AS value
    FROM pg_type t
    INNER JOIN pg_enum e
      ON e.enumtypid = t.oid
    WHERE t.typname::text = 'QuotationStatus'
    ORDER BY e.enumsortorder ASC
  `);

  return rows.map((row) => row.value);
}

async function resolveRequestedQuotationStatus() {
  const availableStatuses = await getQuotationStatusEnumValues();

  if (availableStatuses.includes("PENDING")) {
    return "PENDING";
  }

  if (availableStatuses.includes("DRAFT")) {
    return "DRAFT";
  }

  if (availableStatuses.includes("SENT")) {
    return "SENT";
  }

  throw new Error("No compatible quotation request status is available in the database.");
}

export async function createQuotationRequest(input: {
  quoteNumber: string;
  customerId: string;
  description: string | null;
  weight: number | null;
  amount: number;
}) {
  const requestedStatus = await resolveRequestedQuotationStatus();

  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "Quotation" (
      "id",
      "quoteNumber",
      "customerId",
      "description",
      "weight",
      "amount",
      "status",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${randomUUID()},
      ${input.quoteNumber},
      ${input.customerId},
      ${input.description},
      ${input.weight},
      ${input.amount},
      ${requestedStatus}::"QuotationStatus",
      NOW(),
      NOW()
    )
  `);
}

export function getQuotationStatusMeta(status: string) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Approved",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
        summary: "Admin approved your quotation request.",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        tone: "border-rose-200 bg-rose-50 text-rose-700",
        summary: "Admin rejected your quotation request.",
      };
    case "EXPIRED":
      return {
        label: "Expired",
        tone: "border-amber-200 bg-amber-50 text-amber-700",
        summary: "This quotation request has expired.",
      };
    case "CONVERTED":
      return {
        label: "Converted",
        tone: "border-sky-200 bg-sky-50 text-sky-700",
        summary: "This quotation has been converted into the next step.",
      };
    case "RESPONDED":
    case "SENT":
      return {
        label: "Under Review",
        tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
        summary: "Your quotation request is currently under review.",
      };
    case "PENDING":
    case "DRAFT":
    default:
      return {
        label: "Requested",
        tone: "border-orange-200 bg-orange-50 text-orange-700",
        summary: "Your quotation request has been received and is waiting for review.",
      };
  }
}

export async function countActiveQuotations(customerId?: string) {
  const customerClause = customerId
    ? Prisma.sql` AND q."customerId" = ${customerId}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<CountRow[]>(Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM "Quotation" q
    WHERE q."status"::text IN (${Prisma.join(ACTIVE_QUOTATION_STATUSES)})
    ${customerClause}
  `);

  return toCount(rows[0]?.count);
}

export async function getCustomerQuotationsByUserId(userId: string, take = 8) {
  return prisma.$queryRaw<CustomerQuotationRecord[]>(Prisma.sql`
    SELECT
      q."id",
      q."quoteNumber",
      q."description",
      q."weight",
      q."amount",
      q."status"::text AS "status",
      q."createdAt",
      q."updatedAt"
    FROM "Quotation" q
    INNER JOIN "CustomerProfile" c
      ON c."id" = q."customerId"
    WHERE c."userId" = ${userId}
    ORDER BY q."updatedAt" DESC
    LIMIT ${take}
  `);
}

export async function getActiveQuotationRequests(take = 6) {
  return prisma.$queryRaw<AdminQuotationRequestRecord[]>(Prisma.sql`
    SELECT
      q."id",
      q."quoteNumber",
      q."description",
      q."weight",
      q."amount",
      q."status"::text AS "status",
      q."createdAt",
      q."updatedAt",
      c."companyName",
      u."name" AS "userName",
      u."email" AS "userEmail"
    FROM "Quotation" q
    INNER JOIN "CustomerProfile" c
      ON c."id" = q."customerId"
    LEFT JOIN "User" u
      ON u."id" = c."userId"
    WHERE q."status"::text IN (${Prisma.join(ACTIVE_QUOTATION_STATUSES)})
    ORDER BY q."updatedAt" DESC
    LIMIT ${take}
  `);
}
