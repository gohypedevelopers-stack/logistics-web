"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

function revalidateLogisticsPages() {
  revalidatePath("/admin/rates");
  revalidatePath("/admin/dashboard");
  revalidatePath("/customer/shipments/new");
}

export async function saveCountryAction(formData: FormData) {
  const code = cleanValue(formData, "code")?.toUpperCase();
  const name = cleanValue(formData, "name");
  const displayOrder = Number(cleanValue(formData, "displayOrder") || "0");
  const isActive = formData.get("isActive") === "on";

  if (!code || !name) {
    throw new Error("Country code and name are required.");
  }

  await prisma.country.upsert({
    where: { code },
    update: {
      name,
      isActive,
      displayOrder,
    },
    create: {
      code,
      name,
      isActive,
      displayOrder,
    },
  });

  revalidateLogisticsPages();
}

export async function saveRouteAction(formData: FormData) {
  const originCountryId = cleanValue(formData, "originCountryId");
  const destinationCountryId = cleanValue(formData, "destinationCountryId");
  const name = cleanValue(formData, "name");
  const serviceLevel = cleanValue(formData, "serviceLevel");
  const notes = cleanValue(formData, "notes");
  const transitDaysValue = cleanValue(formData, "transitDays");
  const transitDays = transitDaysValue ? Number(transitDaysValue) : null;
  const isActive = formData.get("isActive") === "on";

  if (!originCountryId || !destinationCountryId) {
    throw new Error("Both origin and destination country are required.");
  }

  const existingRoute = await prisma.route.findFirst({
    where: {
      originCountryId,
      destinationCountryId,
    },
  });

  if (existingRoute) {
    await prisma.route.update({
      where: { id: existingRoute.id },
      data: {
        name,
        serviceLevel,
        notes,
        transitDays,
        isActive,
      },
    });
  } else {
    await prisma.route.create({
      data: {
        originCountryId,
        destinationCountryId,
        name,
        serviceLevel,
        notes,
        transitDays,
        isActive,
      },
    });
  }

  revalidateLogisticsPages();
}

export async function saveWarehouseAction(formData: FormData) {
  const warehouseId = cleanValue(formData, "warehouseId");
  const code = cleanValue(formData, "code")?.toUpperCase();
  const name = cleanValue(formData, "name");
  const phone = cleanValue(formData, "phone");
  const street1 = cleanValue(formData, "street1");
  const street2 = cleanValue(formData, "street2");
  const city = cleanValue(formData, "city");
  const state = cleanValue(formData, "state");
  const postalCode = cleanValue(formData, "postalCode");
  const countryId = cleanValue(formData, "countryId");
  const isActive = formData.get("isActive") === "on";

  if (!code || !name || !street1 || !city || !countryId) {
    throw new Error("Warehouse code, name, country, city, and address are required.");
  }

  if (warehouseId) {
    await prisma.warehouse.update({
      where: { id: warehouseId },
      data: {
        code,
        name,
        phone,
        street1,
        street2,
        city,
        state,
        postalCode,
        countryId,
        isActive,
      },
    });
  } else {
    await prisma.warehouse.upsert({
      where: { code },
      update: {
        name,
        phone,
        street1,
        street2,
        city,
        state,
        postalCode,
        countryId,
        isActive,
      },
      create: {
        code,
        name,
        phone,
        street1,
        street2,
        city,
        state,
        postalCode,
        countryId,
        isActive,
      },
    });
  }

  revalidateLogisticsPages();
}

export async function deleteWarehouseAction(formData: FormData) {
  const warehouseId = cleanValue(formData, "warehouseId");
  if (!warehouseId) {
    throw new Error("Warehouse ID is required.");
  }

  await prisma.warehouse.delete({
    where: { id: warehouseId },
  });

  revalidateLogisticsPages();
}
