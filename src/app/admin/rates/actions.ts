"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { parseBooleanish, parseCsvRecords, parseOptionalNumber } from "@/lib/csv";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

function getRedirectTarget(formData: FormData, fallback: string) {
  const redirectTo = cleanValue(formData, "redirectTo");
  if (!redirectTo || !redirectTo.startsWith("/admin/")) {
    return fallback;
  }
  return redirectTo;
}

function revalidateLogisticsPages() {
  revalidatePath("/admin/rates");
  revalidatePath("/admin/routes");
  revalidatePath("/admin/dashboard");
  revalidatePath("/customer/rates");
  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/shipments/new");
  revalidatePath("/customer/schedule");
}

async function getCountryMapByCodes(codes: string[]) {
  const countries = await prisma.country.findMany({
    where: {
      code: {
        in: [...new Set(codes.map((code) => code.toUpperCase()))],
      },
    },
  });

  return new Map(countries.map((country) => [country.code.toUpperCase(), country]));
}

async function findOrCreateRouteByCodes(input: {
  originCode: string;
  destinationCode: string;
  name?: string | null;
  serviceLevel?: string | null;
  transitDays?: number | null;
  notes?: string | null;
  isActive?: boolean;
}) {
  const countries = await getCountryMapByCodes([input.originCode, input.destinationCode]);
  const originCountry = countries.get(input.originCode.toUpperCase());
  const destinationCountry = countries.get(input.destinationCode.toUpperCase());

  if (!originCountry || !destinationCountry) {
    return null;
  }

  const candidates = await prisma.route.findMany({
    where: {
      originCountryId: originCountry.id,
      destinationCountryId: destinationCountry.id,
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  const matchedRoute =
    candidates.find((route) =>
      input.serviceLevel
        ? route.serviceLevel?.toLowerCase() === input.serviceLevel.toLowerCase()
        : false,
    ) ??
    candidates.find((route) =>
      input.name ? route.name?.toLowerCase() === input.name.toLowerCase() : false,
    ) ??
    candidates[0];

  if (matchedRoute) {
    return prisma.route.update({
      where: { id: matchedRoute.id },
      data: {
        name: input.name ?? matchedRoute.name,
        serviceLevel: input.serviceLevel ?? matchedRoute.serviceLevel,
        transitDays: input.transitDays ?? matchedRoute.transitDays,
        notes: input.notes ?? matchedRoute.notes,
        isActive: input.isActive ?? matchedRoute.isActive,
      },
    });
  }

  return prisma.route.create({
    data: {
      originCountryId: originCountry.id,
      destinationCountryId: destinationCountry.id,
      name: input.name ?? `${originCountry.code} to ${destinationCountry.code}`,
      serviceLevel: input.serviceLevel,
      transitDays: input.transitDays,
      notes: input.notes,
      isActive: input.isActive ?? true,
    },
  });
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

export async function saveRateCardAction(formData: FormData) {
  const rateCardId = cleanValue(formData, "rateCardId");
  const routeId = cleanValue(formData, "routeId");
  const weightMin = Number(cleanValue(formData, "weightMin") || "0");
  const weightMax = Number(cleanValue(formData, "weightMax") || "0");
  const basePrice = Number(cleanValue(formData, "basePrice") || "0");
  const currency = (cleanValue(formData, "currency") || "USD").toUpperCase();

  if (!routeId || !Number.isFinite(weightMin) || !Number.isFinite(weightMax) || !Number.isFinite(basePrice)) {
    throw new Error("Route, weight band, and base price are required.");
  }

  if (rateCardId) {
    await prisma.rateCard.update({
      where: { id: rateCardId },
      data: {
        routeId,
        weightMin,
        weightMax,
        basePrice,
        currency,
      },
    });
  } else {
    const existingRateCard = await prisma.rateCard.findFirst({
      where: {
        routeId,
        weightMin,
        weightMax,
        currency,
      },
    });

    if (existingRateCard) {
      await prisma.rateCard.update({
        where: { id: existingRateCard.id },
        data: {
          basePrice,
        },
      });
    } else {
      await prisma.rateCard.create({
        data: {
          routeId,
          weightMin,
          weightMax,
          basePrice,
          currency,
        },
      });
    }
  }

  revalidateLogisticsPages();
}

export async function deleteRateCardAction(formData: FormData) {
  const rateCardId = cleanValue(formData, "rateCardId");
  if (!rateCardId) {
    throw new Error("Rate card ID is required.");
  }

  await prisma.rateCard.delete({
    where: { id: rateCardId },
  });

  revalidateLogisticsPages();
}

export async function importCountriesCsvAction(formData: FormData) {
  const csvFile = formData.get("csvFile");
  const redirectTo = getRedirectTarget(formData, "/admin/routes");

  if (!(csvFile instanceof File) || csvFile.size === 0) {
    redirect(`${redirectTo}?notice=Please%20upload%20a%20country%20CSV%20file.`);
  }

  const records = parseCsvRecords(await csvFile.text());
  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const code = (record.code || record.country_code || "").trim().toUpperCase();
    const name = (record.name || record.country_name || "").trim();

    if (!code || !name) {
      skipped += 1;
      continue;
    }

    await prisma.country.upsert({
      where: { code },
      update: {
        name,
        displayOrder: parseOptionalNumber(record.display_order) ?? 0,
        isActive: parseBooleanish(record.is_active, true),
      },
      create: {
        code,
        name,
        displayOrder: parseOptionalNumber(record.display_order) ?? 0,
        isActive: parseBooleanish(record.is_active, true),
      },
    });

    imported += 1;
  }

  revalidateLogisticsPages();
  redirect(
    `${redirectTo}?notice=${encodeURIComponent(
      `Imported ${imported} countries.${skipped ? ` Skipped ${skipped} rows.` : ""}`,
    )}`,
  );
}

export async function importRoutesCsvAction(formData: FormData) {
  const csvFile = formData.get("csvFile");
  const redirectTo = getRedirectTarget(formData, "/admin/routes");

  if (!(csvFile instanceof File) || csvFile.size === 0) {
    redirect(`${redirectTo}?notice=Please%20upload%20a%20route%20CSV%20file.`);
  }

  const records = parseCsvRecords(await csvFile.text());
  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const originCode = (record.origin_code || record.origin_country_code || "").trim().toUpperCase();
    const destinationCode = (record.destination_code || record.destination_country_code || "").trim().toUpperCase();

    if (!originCode || !destinationCode) {
      skipped += 1;
      continue;
    }

    const route = await findOrCreateRouteByCodes({
      originCode,
      destinationCode,
      name: (record.name || "").trim() || null,
      serviceLevel: (record.service_level || "").trim() || null,
      transitDays: parseOptionalNumber(record.transit_days),
      notes: (record.notes || "").trim() || null,
      isActive: parseBooleanish(record.is_active, true),
    });

    if (!route) {
      skipped += 1;
      continue;
    }

    imported += 1;
  }

  revalidateLogisticsPages();
  redirect(
    `${redirectTo}?notice=${encodeURIComponent(
      `Imported ${imported} routes.${skipped ? ` Skipped ${skipped} rows.` : ""}`,
    )}`,
  );
}

export async function importWarehousesCsvAction(formData: FormData) {
  const csvFile = formData.get("csvFile");
  const redirectTo = getRedirectTarget(formData, "/admin/routes");

  if (!(csvFile instanceof File) || csvFile.size === 0) {
    redirect(`${redirectTo}?notice=Please%20upload%20a%20warehouse%20CSV%20file.`);
  }

  const records = parseCsvRecords(await csvFile.text());
  const countryCodes = records.map((record) => (record.country_code || record.country || "").trim().toUpperCase()).filter(Boolean);
  const countryMap = await getCountryMapByCodes(countryCodes);

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const code = (record.code || record.warehouse_code || "").trim().toUpperCase();
    const name = (record.name || record.warehouse_name || "").trim();
    const city = (record.city || "").trim();
    const street1 = (record.street1 || record.address_line_1 || "").trim();
    const countryCode = (record.country_code || record.country || "").trim().toUpperCase();
    const country = countryMap.get(countryCode);

    if (!code || !name || !city || !street1 || !country) {
      skipped += 1;
      continue;
    }

    await prisma.warehouse.upsert({
      where: { code },
      update: {
        name,
        city,
        street1,
        street2: (record.street2 || record.address_line_2 || "").trim() || null,
        state: (record.state || "").trim() || null,
        postalCode: (record.postal_code || record.postalcode || "").trim() || null,
        phone: (record.phone || "").trim() || null,
        countryId: country.id,
        isActive: parseBooleanish(record.is_active, true),
      },
      create: {
        code,
        name,
        city,
        street1,
        street2: (record.street2 || record.address_line_2 || "").trim() || null,
        state: (record.state || "").trim() || null,
        postalCode: (record.postal_code || record.postalcode || "").trim() || null,
        phone: (record.phone || "").trim() || null,
        countryId: country.id,
        isActive: parseBooleanish(record.is_active, true),
      },
    });

    imported += 1;
  }

  revalidateLogisticsPages();
  redirect(
    `${redirectTo}?notice=${encodeURIComponent(
      `Imported ${imported} warehouses.${skipped ? ` Skipped ${skipped} rows.` : ""}`,
    )}`,
  );
}

export async function importRateCardsCsvAction(formData: FormData) {
  const csvFile = formData.get("csvFile");
  const redirectTo = getRedirectTarget(formData, "/admin/rates");

  if (!(csvFile instanceof File) || csvFile.size === 0) {
    redirect(`${redirectTo}?notice=Please%20upload%20a%20rate%20card%20CSV%20file.`);
  }

  const records = parseCsvRecords(await csvFile.text());
  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const originCode = (record.origin_code || "").trim().toUpperCase();
    const destinationCode = (record.destination_code || "").trim().toUpperCase();
    const weightMin = parseOptionalNumber(record.weight_min);
    const weightMax = parseOptionalNumber(record.weight_max);
    const basePrice = parseOptionalNumber(record.base_price);

    if (!originCode || !destinationCode || weightMin == null || weightMax == null || basePrice == null) {
      skipped += 1;
      continue;
    }

    const route = await findOrCreateRouteByCodes({
      originCode,
      destinationCode,
      name: (record.route_name || record.name || "").trim() || null,
      serviceLevel: (record.service_level || "").trim() || null,
      transitDays: parseOptionalNumber(record.transit_days),
      notes: (record.notes || "").trim() || null,
      isActive: true,
    });

    if (!route) {
      skipped += 1;
      continue;
    }

    const currency = ((record.currency || "USD").trim() || "USD").toUpperCase();
    const existingRateCard = await prisma.rateCard.findFirst({
      where: {
        routeId: route.id,
        weightMin,
        weightMax,
        currency,
      },
    });

    if (existingRateCard) {
      await prisma.rateCard.update({
        where: { id: existingRateCard.id },
        data: {
          basePrice,
        },
      });
    } else {
      await prisma.rateCard.create({
        data: {
          routeId: route.id,
          weightMin,
          weightMax,
          basePrice,
          currency,
        },
      });
    }

    imported += 1;
  }

  revalidateLogisticsPages();
  redirect(
    `${redirectTo}?notice=${encodeURIComponent(
      `Imported ${imported} rate cards.${skipped ? ` Skipped ${skipped} rows.` : ""}`,
    )}`,
  );
}
