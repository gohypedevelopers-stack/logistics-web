"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { parseBooleanish, parseCsvRecords } from "@/lib/csv";

function cleanValue(formData: FormData, key: string) {
  const raw = formData.get(key);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}

function revalidateAddressPages() {
  revalidatePath("/admin/addresses");
  revalidatePath("/admin/dashboard");
  revalidatePath("/customer/addresses");
  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/shipments/new");
  revalidatePath("/customer/schedule");
}

async function assignDefaultIfNeeded(customerProfileId: string, addressId: string | null, isDefault: boolean) {
  if (!isDefault) {
    return;
  }

  await prisma.address.updateMany({
    where: {
      customerProfileId,
      ...(addressId ? { id: { not: addressId } } : {}),
    },
    data: {
      isDefault: false,
    },
  });
}

export async function saveAddressAction(formData: FormData) {
  const addressId = cleanValue(formData, "addressId");
  const customerProfileId = cleanValue(formData, "customerProfileId");
  const label = cleanValue(formData, "label");
  const name = cleanValue(formData, "name");
  const phone = cleanValue(formData, "phone");
  const street1 = cleanValue(formData, "street1");
  const street2 = cleanValue(formData, "street2");
  const city = cleanValue(formData, "city");
  const state = cleanValue(formData, "state");
  const postalCode = cleanValue(formData, "postalCode");
  const countryId = cleanValue(formData, "countryId");
  const isDefault = formData.get("isDefault") === "on";

  if (!customerProfileId || !name || !street1 || !city || !countryId) {
    throw new Error("Customer, contact name, city, country, and address are required.");
  }

  await assignDefaultIfNeeded(customerProfileId, addressId, isDefault);

  if (addressId) {
    await prisma.address.update({
      where: { id: addressId },
      data: {
        customerProfileId,
        label,
        name,
        phone,
        street1,
        street2,
        city,
        state,
        postalCode,
        countryId,
        isDefault,
      },
    });
  } else {
    await prisma.address.create({
      data: {
        customerProfileId,
        label,
        name,
        phone,
        street1,
        street2,
        city,
        state,
        postalCode,
        countryId,
        isDefault,
      },
    });
  }

  revalidateAddressPages();
}

export async function deleteAddressAction(formData: FormData) {
  const addressId = cleanValue(formData, "addressId");
  if (!addressId) {
    throw new Error("Address ID is required.");
  }

  await prisma.address.delete({
    where: { id: addressId },
  });

  revalidateAddressPages();
}

export async function importAddressesCsvAction(formData: FormData) {
  const csvFile = formData.get("csvFile");

  if (!(csvFile instanceof File) || csvFile.size === 0) {
    redirect("/admin/addresses?notice=Upload%20a%20CSV%20file%20exported%20from%20Excel.");
  }

  const records = parseCsvRecords(await csvFile.text());

  if (records.length === 0) {
    redirect("/admin/addresses?notice=No%20rows%20found%20in%20the%20uploaded%20file.");
  }

  const emails = [...new Set(records.map((record) => (record.customer_email || record.email || "").trim().toLowerCase()).filter(Boolean))];
  const countryCodes = [...new Set(records.map((record) => (record.country_code || record.country || "").trim().toUpperCase()).filter(Boolean))];

  const [customers, countries] = await Promise.all([
    prisma.customerProfile.findMany({
      where: {
        user: {
          email: {
            in: emails,
          },
        },
      },
      include: {
        user: true,
      },
    }),
    prisma.country.findMany({
      where: {
        code: {
          in: countryCodes,
        },
      },
    }),
  ]);

  const customerMap = new Map(customers.map((customer) => [customer.user.email.toLowerCase(), customer]));
  const countryMap = new Map(countries.map((country) => [country.code.toUpperCase(), country]));

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    const email = (record.customer_email || record.email || "").trim().toLowerCase();
    const countryCode = (record.country_code || record.country || "").trim().toUpperCase();
    const customer = customerMap.get(email);
    const country = countryMap.get(countryCode);
    const name = (record.name || record.contact_name || "").trim();
    const street1 = (record.street1 || record.address_line_1 || "").trim();
    const city = (record.city || "").trim();

    if (!customer || !country || !name || !street1 || !city) {
      skipped += 1;
      continue;
    }

    const label = (record.label || "").trim() || null;
    const phone = (record.phone || "").trim() || null;
    const street2 = (record.street2 || record.address_line_2 || "").trim() || null;
    const state = (record.state || "").trim() || null;
    const postalCode = (record.postal_code || record.postalcode || record.zip || "").trim() || null;
    const isDefault = parseBooleanish(record.is_default, false);

    const existingAddress = await prisma.address.findFirst({
      where: {
        customerProfileId: customer.id,
        street1,
        city,
        countryId: country.id,
        postalCode,
      },
    });

    await assignDefaultIfNeeded(customer.id, existingAddress?.id ?? null, isDefault);

    if (existingAddress) {
      await prisma.address.update({
        where: { id: existingAddress.id },
        data: {
          label,
          name,
          phone,
          street1,
          street2,
          city,
          state,
          postalCode,
          countryId: country.id,
          isDefault,
        },
      });
    } else {
      await prisma.address.create({
        data: {
          customerProfileId: customer.id,
          label,
          name,
          phone,
          street1,
          street2,
          city,
          state,
          postalCode,
          countryId: country.id,
          isDefault,
        },
      });
    }

    imported += 1;
  }

  revalidateAddressPages();
  redirect(`/admin/addresses?notice=${encodeURIComponent(`Imported ${imported} addresses${skipped ? `, skipped ${skipped}` : ""}.`)}`);
}
