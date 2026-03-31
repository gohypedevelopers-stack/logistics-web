import prisma from "@/lib/prisma";
import { CreateShipmentForm } from "./CreateShipmentForm";
import { ensureDefaultWarehouses } from "@/lib/logistics-bootstrap";

export const dynamic = "force-dynamic";

export default async function CreateShipmentPage() {
  await ensureDefaultWarehouses();

  const [countries, routes, warehouses] = await Promise.all([
    prisma.country.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
      },
    }),
    prisma.route.findMany({
      where: { isActive: true },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        originCountryId: true,
        destinationCountryId: true,
        originCountry: {
          select: {
            code: true,
            name: true,
          },
        },
        destinationCountry: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    }),
    prisma.warehouse.findMany({
      where: { isActive: true },
      orderBy: [{ countryId: "asc" }, { city: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        code: true,
        city: true,
        street1: true,
        phone: true,
        countryId: true,
        country: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return <CreateShipmentForm countries={countries} routes={routes} warehouses={warehouses} />;
}
