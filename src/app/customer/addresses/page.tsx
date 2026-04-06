import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ContactRound, MapPin, Star, UserRound, Warehouse } from "lucide-react";
import { getEffectiveWarehouseRate } from "@/lib/customer-rate-utils";

export const dynamic = "force-dynamic";

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-sm text-slate-500">Access denied. Please sign in.</div>;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      addresses: {
        include: {
          country: true,
        },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      },
      shipments: {
        orderBy: { updatedAt: "desc" },
        include: {
          pickupAddress: {
            include: {
              country: true,
            },
          },
          receiverAddress: {
            include: {
              country: true,
            },
          },
        },
      },
    },
  });

  const warehouses = await prisma.warehouse.findMany({
    where: { isActive: true },
    include: {
      country: true,
      customerRateOverrides: {
        where: {
          customerId: customer?.id,
        },
      },
    },
    orderBy: [{ countryId: "asc" }, { city: "asc" }, { name: "asc" }],
  });

  const shipmentAddresses = uniqueById(
    (customer?.shipments || []).flatMap((shipment) =>
      [shipment.pickupAddress, shipment.receiverAddress].filter(
        (address): address is NonNullable<typeof address> => Boolean(address),
      ),
    ),
  );

  return (
    <div className="mx-auto min-h-full max-w-[1500px] bg-[#f8f9fa] p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Address Book</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Saved pickup and office addresses added for your shipment requests.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E1B4B]">Saved Addresses</h2>
            <p className="text-sm font-medium text-slate-500">
              These addresses can be used across create and schedule shipment flows.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            {customer?.addresses.length ?? 0} saved
          </span>
        </div>

        <div className="space-y-4">
          {customer?.addresses?.length ? (
            customer.addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-bold text-slate-900">{address.label || "Saved address"}</p>
                      {address.isDefault ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                          <Star className="h-3.5 w-3.5" />
                          Default
                        </span>
                      ) : null}
                    </div>

                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      {address.name}
                      {address.phone ? ` | ${address.phone}` : ""}
                    </p>

                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span>
                        {address.street1}
                        {address.street2 ? `, ${address.street2}` : ""}
                        {`, ${address.city}`}
                        {address.state ? `, ${address.state}` : ""}
                        {address.postalCode ? ` ${address.postalCode}` : ""}
                        {`, ${address.country.name}`}
                      </span>
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                    <ContactRound className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-medium text-slate-700">No addresses available yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Your logistics team can add pickup or office addresses from the admin panel.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Shipment Addresses</h2>
              <p className="text-sm font-medium text-slate-500">
                Pickup and destination addresses used in your shipment records.
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
              {shipmentAddresses.length} linked
            </span>
          </div>

          <div className="space-y-4">
            {shipmentAddresses.length ? (
              shipmentAddresses.map((address) => (
                <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-bold text-slate-900">{address.label || "Shipment address"}</p>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      {address.name}
                      {address.phone ? ` | ${address.phone}` : ""}
                    </p>

                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span>
                        {address.street1}
                        {address.street2 ? `, ${address.street2}` : ""}
                        {`, ${address.city}`}
                        {address.state ? `, ${address.state}` : ""}
                        {address.postalCode ? ` ${address.postalCode}` : ""}
                        {`, ${address.country.name}`}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-medium text-slate-700">No shipment-linked addresses yet.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Addresses used in booked shipments will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Available Warehouses</h2>
              <p className="text-sm font-medium text-slate-500">
                Admin-managed warehouse drop-off locations available for your shipments.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              {warehouses.length} active
            </span>
          </div>

          <div className="space-y-4">
            {warehouses.length ? (
              warehouses.map((warehouse) => {
                const warehouseRate = getEffectiveWarehouseRate(warehouse);

                return (
                  <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-bold text-slate-900">
                            {warehouse.name} ({warehouse.code})
                          </p>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {warehouse.country.code}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {warehouseRate.price != null
                              ? `${warehouseRate.currency} ${warehouseRate.price.toFixed(2)}`
                              : "Charge not set"}
                          </span>
                        </div>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <Warehouse className="h-4 w-4 text-slate-400" />
                          {warehouse.city}, {warehouse.country.name}
                          {warehouse.phone ? ` | ${warehouse.phone}` : ""}
                        </p>

                        <p className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                          <span>
                            {warehouse.street1}
                            {warehouse.street2 ? `, ${warehouse.street2}` : ""}
                            {warehouse.state ? `, ${warehouse.state}` : ""}
                            {warehouse.postalCode ? ` ${warehouse.postalCode}` : ""}
                          </span>
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50">
                        <Warehouse className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-medium text-slate-700">No active warehouses available.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Warehouses managed by your operations team will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
