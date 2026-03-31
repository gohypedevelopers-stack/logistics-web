import prisma from "@/lib/prisma";

type WarehouseSeed = {
  codeSuffix: string;
  name: string;
  city: string;
  street1: string;
  state?: string;
  postalCode?: string;
  phone?: string;
};

const DEFAULT_WAREHOUSE_BY_CODE: Record<string, WarehouseSeed[]> = {
  IN: [
    {
      codeSuffix: "DEL",
      name: "Delhi Central Warehouse",
      city: "Delhi",
      street1: "12 Cargo Hub Road",
      postalCode: "110037",
      phone: "+91 98100 10001",
    },
    {
      codeSuffix: "BOM",
      name: "Mumbai Export Warehouse",
      city: "Mumbai",
      street1: "45 Air Freight Complex",
      postalCode: "400099",
      phone: "+91 98100 10002",
    },
    {
      codeSuffix: "BLR",
      name: "Bengaluru South Warehouse",
      city: "Bengaluru",
      street1: '18 Cargo Terminal Road',
      postalCode: "560300",
      phone: "+91 98100 10003",
    },
  ],
  GB: [
    {
      codeSuffix: "LHR",
      name: "London Freight Warehouse",
      city: "London",
      street1: "14 Heathrow Cargo Park",
      postalCode: "TW6 3UA",
      phone: "+44 20 7000 1000",
    },
    {
      codeSuffix: "MAN",
      name: "Manchester North Warehouse",
      city: "Manchester",
      street1: "9 Logistics Avenue",
      postalCode: "M90 5EX",
      phone: "+44 20 7000 1001",
    },
  ],
  UK: [
    {
      codeSuffix: "LHR",
      name: "London Freight Warehouse",
      city: "London",
      street1: "14 Heathrow Cargo Park",
      postalCode: "TW6 3UA",
      phone: "+44 20 7000 1000",
    },
    {
      codeSuffix: "MAN",
      name: "Manchester North Warehouse",
      city: "Manchester",
      street1: "9 Logistics Avenue",
      postalCode: "M90 5EX",
      phone: "+44 20 7000 1001",
    },
  ],
  US: [
    {
      codeSuffix: "NYC",
      name: "New York Consolidation Hub",
      city: "New York",
      street1: "80 Logistics Avenue",
      state: "NY",
      postalCode: "10018",
      phone: "+1 555 1100",
    },
    {
      codeSuffix: "CHI",
      name: "Chicago Midwest Warehouse",
      city: "Chicago",
      street1: "233 Cargo Belt Road",
      state: "IL",
      postalCode: "60666",
      phone: "+1 555 1101",
    },
  ],
  CN: [
    {
      codeSuffix: "SZX",
      name: "Shenzhen Gateway Warehouse",
      city: "Shenzhen",
      street1: "88 Export Zone Road",
      postalCode: "518000",
      phone: "+86 755 1000 2000",
    },
    {
      codeSuffix: "CAN",
      name: "Guangzhou Cargo Warehouse",
      city: "Guangzhou",
      street1: "16 Port Link Street",
      postalCode: "510000",
      phone: "+86 755 1000 2001",
    },
  ],
  HK: [
    {
      codeSuffix: "HKG1",
      name: "Hong Kong Air Cargo Hub",
      city: "Hong Kong",
      street1: "2 Skyway Logistics Street",
      phone: "+852 3100 2200",
    },
    {
      codeSuffix: "HKG2",
      name: "Kwai Chung Distribution Warehouse",
      city: "Hong Kong",
      street1: "18 Maritime Square",
      phone: "+852 3100 2201",
    },
  ],
  MY: [
    {
      codeSuffix: "KUL",
      name: "Kuala Lumpur Cargo Center",
      city: "Kuala Lumpur",
      street1: "20 Freight Park",
      postalCode: "64000",
      phone: "+60 3 2200 3300",
    },
    {
      codeSuffix: "PEN",
      name: "Penang Transit Warehouse",
      city: "Penang",
      street1: "8 Seaport Link",
      postalCode: "11900",
      phone: "+60 3 2200 3301",
    },
  ],
  EG: [
    {
      codeSuffix: "CAI",
      name: "Cairo Trade Warehouse",
      city: "Cairo",
      street1: "5 Nile Logistics Park",
      postalCode: "11765",
      phone: "+20 2 2200 4400",
    },
    {
      codeSuffix: "ALX",
      name: "Alexandria Port Warehouse",
      city: "Alexandria",
      street1: "31 Harbor Freight Zone",
      postalCode: "21500",
      phone: "+20 2 2200 4401",
    },
  ],
  AE: [
    {
      codeSuffix: "DXB1",
      name: "Dubai Logistics Hub",
      city: "Dubai",
      street1: "99 Jebel Ali Free Zone",
      phone: "+971 4 220 5500",
    },
    {
      codeSuffix: "SHJ",
      name: "Sharjah Cargo Warehouse",
      city: "Sharjah",
      street1: "15 Airport Cargo Road",
      phone: "+971 4 220 5501",
    },
  ],
  DXB: [
    {
      codeSuffix: "DXB1",
      name: "Dubai Logistics Hub",
      city: "Dubai",
      street1: "99 Jebel Ali Free Zone",
      phone: "+971 4 220 5500",
    },
    {
      codeSuffix: "SHJ",
      name: "Sharjah Cargo Warehouse",
      city: "Sharjah",
      street1: "15 Airport Cargo Road",
      phone: "+971 4 220 5501",
    },
  ],
};

export async function ensureDefaultWarehouses() {
  const activeCountries = await prisma.country.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  if (!activeCountries.length) return;

  const operations = activeCountries.flatMap((country) => {
    const presets = DEFAULT_WAREHOUSE_BY_CODE[country.code] ?? [
      {
        codeSuffix: "MAIN",
        name: `${country.name} Main Warehouse`,
        city: country.name,
        street1: `${country.name} Logistics Park`,
        phone: "+1 000 000 0000",
      },
      {
        codeSuffix: "NORTH",
        name: `${country.name} North Warehouse`,
        city: country.name,
        street1: `${country.name} Distribution Center`,
        phone: "+1 000 000 0001",
      },
    ];

    return presets.map((preset) =>
      prisma.warehouse.upsert({
        where: {
          code: `AUTO-${country.code}-${preset.codeSuffix}`,
        },
        update: {
          name: preset.name,
          city: preset.city,
          street1: preset.street1,
          state: preset.state ?? null,
          postalCode: preset.postalCode ?? null,
          phone: preset.phone ?? null,
          countryId: country.id,
          isActive: true,
        },
        create: {
          code: `AUTO-${country.code}-${preset.codeSuffix}`,
          name: preset.name,
          city: preset.city,
          street1: preset.street1,
          state: preset.state ?? null,
          postalCode: preset.postalCode ?? null,
          phone: preset.phone ?? null,
          countryId: country.id,
          isActive: true,
        },
      }),
    );
  });

  if (!operations.length) return;

  await prisma.$transaction(operations);
}
