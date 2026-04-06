"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

export async function saveCustomerRateOverrideAction(formData: FormData) {
  const customerId = cleanValue(formData, "customerId");
  const rateCardId = cleanValue(formData, "rateCardId");
  const priceValue = cleanValue(formData, "price");

  if (!customerId || !rateCardId || !priceValue) {
    throw new Error("Customer, rate band, and override price are required.");
  }

  const price = Number(priceValue);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Override price must be a valid number greater than or equal to zero.");
  }

  await prisma.customerRateOverride.upsert({
    where: {
      customerId_rateCardId: {
        customerId,
        rateCardId,
      },
    },
    update: {
      price,
    },
    create: {
      customerId,
      rateCardId,
      price,
    },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/customer/rates");
}

export async function deleteCustomerRateOverrideAction(formData: FormData) {
  const customerId = cleanValue(formData, "customerId");
  const rateCardId = cleanValue(formData, "rateCardId");

  if (!customerId || !rateCardId) {
    throw new Error("Customer and rate band are required.");
  }

  await prisma.customerRateOverride.deleteMany({
    where: {
      customerId,
      rateCardId,
    },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/customer/rates");
}

export async function saveCustomerWarehouseRateOverrideAction(formData: FormData) {
  const customerId = cleanValue(formData, "customerId");
  const warehouseId = cleanValue(formData, "warehouseId");
  const priceValue = cleanValue(formData, "price");
  const currency = (cleanValue(formData, "currency") || "USD").toUpperCase();

  if (!customerId || !warehouseId || !priceValue) {
    throw new Error("Customer, warehouse, and warehouse price are required.");
  }

  const price = Number(priceValue);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Warehouse price must be a valid number greater than or equal to zero.");
  }

  await prisma.customerWarehouseRateOverride.upsert({
    where: {
      customerId_warehouseId: {
        customerId,
        warehouseId,
      },
    },
    update: {
      price,
      currency,
    },
    create: {
      customerId,
      warehouseId,
      price,
      currency,
    },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/customer/rates");
  revalidatePath("/customer/addresses");
}

export async function deleteCustomerWarehouseRateOverrideAction(formData: FormData) {
  const customerId = cleanValue(formData, "customerId");
  const warehouseId = cleanValue(formData, "warehouseId");

  if (!customerId || !warehouseId) {
    throw new Error("Customer and warehouse are required.");
  }

  await prisma.customerWarehouseRateOverride.deleteMany({
    where: {
      customerId,
      warehouseId,
    },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/customer/rates");
  revalidatePath("/customer/addresses");
}
