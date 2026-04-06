import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  ContactRound,
  MapPin,
  Route,
  Warehouse,
} from "lucide-react";
import {
  deleteCustomerRateOverrideAction,
  deleteCustomerWarehouseRateOverrideAction,
  saveCustomerRateOverrideAction,
  saveCustomerWarehouseRateOverrideAction,
} from "./actions";
import {
  getEffectiveCustomerRate,
  getEffectiveWarehouseRate,
} from "@/lib/customer-rate-utils";

export const dynamic = "force-dynamic";

const PREVIEW_COUNT = 2;

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function splitPreview<T>(items: T[]) {
  return {
    preview: items.slice(0, PREVIEW_COUNT),
    remaining: items.slice(PREVIEW_COUNT),
  };
}

export default async function AdminCustomerDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;

  const [customer, routes, warehouses] = await Promise.all([
    prisma.customerProfile.findUnique({
      where: { id: resolvedParams.id },
      include: {
        user: true,
        addresses: {
          include: { country: true },
          orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        },
        shipments: {
          orderBy: { updatedAt: "desc" },
          include: {
            route: {
              include: {
                originCountry: true,
                destinationCountry: true,
              },
            },
            pickupAddress: { include: { country: true } },
            receiverAddress: { include: { country: true } },
            warehouse: { include: { country: true } },
          },
        },
      },
    }),
    prisma.route.findMany({
      where: { isActive: true },
      include: {
        originCountry: true,
        destinationCountry: true,
        rateCards: {
          include: {
            customerOverrides: {
              where: { customerId: resolvedParams.id },
            },
          },
          orderBy: [{ weightMin: "asc" }, { weightMax: "asc" }],
        },
      },
      orderBy: [
        { originCountryId: "asc" },
        { destinationCountryId: "asc" },
        { updatedAt: "desc" },
      ],
    }),
    prisma.warehouse.findMany({
      where: { isActive: true },
      include: {
        country: true,
        customerRateOverrides: {
          where: { customerId: resolvedParams.id },
        },
      },
      orderBy: [{ countryId: "asc" }, { city: "asc" }, { name: "asc" }],
    }),
  ]);

  if (!customer) {
    notFound();
  }

  const shipmentAddresses = uniqueById(
    customer.shipments.flatMap((shipment) =>
      [shipment.pickupAddress, shipment.receiverAddress].filter(
        (address): address is NonNullable<typeof address> => Boolean(address),
      ),
    ),
  );

  const shipmentRoutes = uniqueById(
    customer.shipments
      .map((shipment) => shipment.route)
      .filter((route): route is NonNullable<typeof route> => Boolean(route)),
  );

  const routeCards = routes.filter((route) => route.rateCards.length > 0);
  const usedWarehouseIds = new Set(
    customer.shipments
      .map((shipment) => shipment.warehouseId)
      .filter((warehouseId): warehouseId is string => Boolean(warehouseId)),
  );

  const { preview: routePreview, remaining: routeRemaining } = splitPreview(routeCards);
  const { preview: warehousePreview, remaining: warehouseRemaining } = splitPreview(warehouses);
  const { preview: savedAddressPreview, remaining: savedAddressRemaining } = splitPreview(customer.addresses);
  const { preview: shipmentRoutePreview, remaining: shipmentRouteRemaining } = splitPreview(shipmentRoutes);
  const { preview: shipmentAddressPreview, remaining: shipmentAddressRemaining } = splitPreview(shipmentAddresses);
  const { preview: warehouseInfoPreview, remaining: warehouseInfoRemaining } = splitPreview(warehouses);

  return (
    <div className="mx-auto min-h-full max-w-[1680px] bg-[#f8f9fa] p-4 font-sans sm:p-6 lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
          <Link
            href="/admin/customers"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E1B4B] text-white transition-colors hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          Customer Pricing & Network
        </div>
        <p className="mt-2 pl-10 text-sm font-medium text-slate-500">
          Set route prices, apply warehouse charges, and review the customer's active network.
        </p>
      </div>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-700">
                {(customer.companyName || customer.user.name || customer.user.email || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {customer.companyName || customer.user.name || "Private customer"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{customer.user.email}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Phone
                </p>
                <p className="mt-2 font-semibold text-slate-900">{customer.phone || "Not available"}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Tax ID
                </p>
                <p className="mt-2 font-semibold text-slate-900">{customer.taxId || "Not available"}</p>
              </div>
            </div>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">Saved Addresses</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{customer.addresses.length}</p>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">Shipments</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{customer.shipments.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Shipment Routes</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{shipmentRoutes.length}</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">Active Warehouses</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{warehouses.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1.08fr)_420px]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
                <BadgeDollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Step 1: Customer Route Pricing</h2>
                <p className="text-sm font-medium text-slate-500">
                  Select a route band, enter the customer-specific price, and save the override.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {routePreview.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No route rate cards found yet.
                </div>
              ) : (
                routePreview.map((route) => (
                  <div key={route.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-bold text-slate-900">
                          {route.originCountry.name} ({route.originCountry.code}) to{" "}
                          {route.destinationCountry.name} ({route.destinationCountry.code})
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {route.name || "Active route"}
                          {route.serviceLevel ? ` | ${route.serviceLevel}` : ""}
                          {route.transitDays ? ` | ${route.transitDays} days` : ""}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {route.rateCards.length} rate bands
                      </span>
                    </div>

                    <div className="space-y-3">
                      {route.rateCards.map((rateCard) => {
                        const effectiveRate = getEffectiveCustomerRate(rateCard);
                        const override = rateCard.customerOverrides[0] ?? null;

                        return (
                          <div key={rateCard.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Weight Band
                                  </p>
                                  <p className="mt-2 font-semibold text-slate-900">
                                    {rateCard.weightMin} to {rateCard.weightMax} KG
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Default Price
                                  </p>
                                  <p className="mt-2 font-semibold text-slate-900">
                                    {rateCard.currency} {rateCard.basePrice.toFixed(2)}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 2xl:col-span-1">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Current Price
                                  </p>
                                  <p className="mt-2 font-semibold text-slate-900">
                                    {effectiveRate.currency} {effectiveRate.price.toFixed(2)}
                                  </p>
                                  <p className="mt-2 text-xs font-medium text-slate-500">
                                    {effectiveRate.isOverride ? "Customer override active" : "Using the default route price"}
                                  </p>
                                </div>
                              </div>

                              <form action={saveCustomerRateOverrideAction} className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <input type="hidden" name="customerId" value={customer.id} />
                                <input type="hidden" name="rateCardId" value={rateCard.id} />
                                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                                  <label className="block">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                      Customer Price
                                    </span>
                                    <input
                                      type="number"
                                      name="price"
                                      min="0"
                                      step="0.01"
                                      defaultValue={override?.price ?? rateCard.basePrice}
                                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none"
                                    />
                                  </label>
                                  <div className="flex flex-wrap gap-3">
                                    <button
                                      type="submit"
                                      className="h-11 rounded-xl bg-[#1E1B4B] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
                                    >
                                      Save Price
                                    </button>
                                    <button
                                      formAction={deleteCustomerRateOverrideAction}
                                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>
                              </form>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}

              {routeRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {routeRemaining.length} more routes
                  </summary>
                  <div className="mt-4 space-y-4">
                    {routeRemaining.map((route) => (
                      <div key={route.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="font-bold text-slate-900">
                          {route.originCountry.name} ({route.originCountry.code}) to{" "}
                          {route.destinationCountry.name} ({route.destinationCountry.code})
                        </p>
                        <div className="mt-4 space-y-3">
                          {route.rateCards.map((rateCard) => {
                            const effectiveRate = getEffectiveCustomerRate(rateCard);
                            const override = rateCard.customerOverrides[0] ?? null;

                            return (
                              <form key={rateCard.id} action={saveCustomerRateOverrideAction} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <input type="hidden" name="customerId" value={customer.id} />
                                <input type="hidden" name="rateCardId" value={rateCard.id} />
                                <p className="text-sm font-semibold text-slate-900">
                                  {rateCard.weightMin} to {rateCard.weightMax} KG
                                </p>
                                <p className="mt-1 text-xs font-medium text-slate-500">
                                  Current price: {effectiveRate.currency} {effectiveRate.price.toFixed(2)}
                                </p>
                                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                                  <label className="block">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                      Customer Price
                                    </span>
                                    <input
                                      type="number"
                                      name="price"
                                      min="0"
                                      step="0.01"
                                      defaultValue={override?.price ?? effectiveRate.price}
                                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none"
                                    />
                                  </label>
                                  <div className="flex flex-wrap gap-3">
                                    <button
                                      type="submit"
                                      className="h-11 rounded-xl bg-[#1E1B4B] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
                                    >
                                      Save
                                    </button>
                                    <button
                                      formAction={deleteCustomerRateOverrideAction}
                                      className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:bg-slate-50"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>
                              </form>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50">
                <Warehouse className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Step 2: Customer Warehouse Pricing</h2>
                <p className="text-sm font-medium text-slate-500">
                  Enter a customer-specific warehouse charge when it differs from the standard value.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {warehousePreview.map((warehouse) => {
                const warehouseRate = getEffectiveWarehouseRate(warehouse);
                const override = warehouse.customerRateOverrides[0] ?? null;

                return (
                  <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {warehouse.name} ({warehouse.code})
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {warehouse.city}, {warehouse.country.name}
                          {usedWarehouseIds.has(warehouse.id) ? " | used in shipments" : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {warehouse.country.code}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Current Charge
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {warehouseRate.price != null
                                ? `${warehouseRate.currency} ${warehouseRate.price.toFixed(2)}`
                                : "Not set"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Status
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {warehouseRate.isOverride ? "Customer warehouse price active" : "No custom warehouse price"}
                            </p>
                          </div>
                      </div>

                      <form action={saveCustomerWarehouseRateOverrideAction} className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <input type="hidden" name="customerId" value={customer.id} />
                        <input type="hidden" name="warehouseId" value={warehouse.id} />
                        <div className="grid gap-4">
                          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                            <label className="block">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Warehouse Price
                              </span>
                              <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                defaultValue={override?.price ?? ""}
                                placeholder="Warehouse price"
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Currency
                              </span>
                              <input
                                type="text"
                                name="currency"
                                defaultValue={override?.currency ?? "USD"}
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium uppercase text-slate-800 outline-none"
                              />
                            </label>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="submit"
                              className="h-11 rounded-xl bg-[#1E1B4B] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
                            >
                              Save Charge
                            </button>
                            <button
                              formAction={deleteCustomerWarehouseRateOverrideAction}
                              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:bg-slate-50"
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })}

              {warehouseRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {warehouseRemaining.length} more warehouses
                  </summary>
                  <div className="mt-4 space-y-4">
                    {warehouseRemaining.map((warehouse) => {
                      const override = warehouse.customerRateOverrides[0] ?? null;

                      return (
                        <form key={warehouse.id} action={saveCustomerWarehouseRateOverrideAction} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <input type="hidden" name="customerId" value={customer.id} />
                          <input type="hidden" name="warehouseId" value={warehouse.id} />
                          <div className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                              <label className="block">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  Warehouse Price
                                </span>
                                <input
                                  type="number"
                                  name="price"
                                  min="0"
                                  step="0.01"
                                  defaultValue={override?.price ?? ""}
                                  placeholder="Warehouse price"
                                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
                                />
                              </label>
                              <label className="block">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  Currency
                                </span>
                                <input
                                  type="text"
                                  name="currency"
                                  defaultValue={override?.currency ?? "USD"}
                                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase text-slate-800 outline-none"
                                />
                              </label>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="submit"
                                className="h-11 rounded-xl bg-[#1E1B4B] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
                              >
                                Save
                              </button>
                              <button
                                formAction={deleteCustomerWarehouseRateOverrideAction}
                                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition-colors hover:bg-slate-50"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    })}
                  </div>
                </details>
              ) : null}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                <ContactRound className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Saved Addresses</h2>
                <p className="text-sm font-medium text-slate-500">
                  Customer account addresses. The first 2 are shown here.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {savedAddressPreview.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No saved addresses available for this customer.
                </div>
              ) : (
                savedAddressPreview.map((address) => (
                  <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-slate-900">{address.label || "Address"}</p>
                      {address.isDefault ? (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {address.name}
                      {address.phone ? ` | ${address.phone}` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {address.street1}
                      {address.street2 ? `, ${address.street2}` : ""}
                      {`, ${address.city}`}
                      {address.state ? `, ${address.state}` : ""}
                      {address.postalCode ? ` ${address.postalCode}` : ""}
                      {`, ${address.country.name}`}
                    </p>
                  </div>
                ))
              )}

              {savedAddressRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {savedAddressRemaining.length} more addresses
                  </summary>
                  <div className="mt-4 space-y-3">
                    {savedAddressRemaining.map((address) => (
                      <div key={address.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{address.label || "Address"}</p>
                        <p className="mt-2 text-sm text-slate-700">{address.name}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.street1}
                          {address.street2 ? `, ${address.street2}` : ""}
                          {`, ${address.city}`}
                          {address.state ? `, ${address.state}` : ""}
                          {address.postalCode ? ` ${address.postalCode}` : ""}
                          {`, ${address.country.name}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <Route className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Shipment Routes</h2>
                <p className="text-sm font-medium text-slate-500">
                  Routes that already appear in this customer's shipment history.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {shipmentRoutePreview.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No shipment routes found for this customer yet.
                </div>
              ) : (
                shipmentRoutePreview.map((route) => (
                  <div key={route.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      {route.originCountry.name} ({route.originCountry.code}) to{" "}
                      {route.destinationCountry.name} ({route.destinationCountry.code})
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {route.serviceLevel || "Standard"}
                      {route.name ? ` | ${route.name}` : ""}
                    </p>
                  </div>
                ))
              )}

              {shipmentRouteRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {shipmentRouteRemaining.length} more shipment routes
                  </summary>
                  <div className="mt-4 space-y-3">
                    {shipmentRouteRemaining.map((route) => (
                      <div key={route.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">
                          {route.originCountry.name} ({route.originCountry.code}) to{" "}
                          {route.destinationCountry.name} ({route.destinationCountry.code})
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {route.serviceLevel || "Standard"}
                          {route.name ? ` | ${route.name}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
                <MapPin className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Shipment Addresses</h2>
                <p className="text-sm font-medium text-slate-500">
                  Pickup and destination addresses linked to this customer's shipments. The first 2 are shown here.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {shipmentAddressPreview.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No shipment-linked addresses found yet.
                </div>
              ) : (
                shipmentAddressPreview.map((address) => (
                  <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{address.label || "Shipment address"}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {address.name}
                      {address.phone ? ` | ${address.phone}` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {address.street1}
                      {address.street2 ? `, ${address.street2}` : ""}
                      {`, ${address.city}`}
                      {address.state ? `, ${address.state}` : ""}
                      {address.postalCode ? ` ${address.postalCode}` : ""}
                      {`, ${address.country.name}`}
                    </p>
                  </div>
                ))
              )}

              {shipmentAddressRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {shipmentAddressRemaining.length} more shipment addresses
                  </summary>
                  <div className="mt-4 space-y-3">
                    {shipmentAddressRemaining.map((address) => (
                      <div key={address.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="font-semibold text-slate-900">{address.label || "Shipment address"}</p>
                        <p className="mt-2 text-sm text-slate-700">{address.name}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {address.street1}
                          {address.street2 ? `, ${address.street2}` : ""}
                          {`, ${address.city}`}
                          {address.state ? `, ${address.state}` : ""}
                          {address.postalCode ? ` ${address.postalCode}` : ""}
                          {`, ${address.country.name}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50">
                <Warehouse className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Active Warehouses</h2>
                <p className="text-sm font-medium text-slate-500">
                  Admin-managed warehouses. The first 2 are shown here.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {warehouseInfoPreview.map((warehouse) => {
                const warehouseRate = getEffectiveWarehouseRate(warehouse);

                return (
                  <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {warehouse.name} ({warehouse.code})
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {warehouse.city}, {warehouse.country.name}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {warehouse.country.code}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {warehouse.street1}
                      {warehouse.street2 ? `, ${warehouse.street2}` : ""}
                      {warehouse.state ? `, ${warehouse.state}` : ""}
                      {warehouse.postalCode ? ` ${warehouse.postalCode}` : ""}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Customer warehouse charge:{" "}
                      {warehouseRate.price != null
                        ? `${warehouseRate.currency} ${warehouseRate.price.toFixed(2)}`
                        : "Not set"}
                    </p>
                  </div>
                );
              })}

              {warehouseInfoRemaining.length > 0 ? (
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-blue-700">
                    Show {warehouseInfoRemaining.length} more warehouses
                  </summary>
                  <div className="mt-4 space-y-3">
                    {warehouseInfoRemaining.map((warehouse) => {
                      const warehouseRate = getEffectiveWarehouseRate(warehouse);

                      return (
                        <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="font-semibold text-slate-900">
                            {warehouse.name} ({warehouse.code})
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {warehouse.city}, {warehouse.country.name}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {warehouse.street1}
                            {warehouse.street2 ? `, ${warehouse.street2}` : ""}
                            {warehouse.state ? `, ${warehouse.state}` : ""}
                            {warehouse.postalCode ? ` ${warehouse.postalCode}` : ""}
                          </p>
                          <p className="mt-2 text-xs font-medium text-slate-500">
                            Customer warehouse charge:{" "}
                            {warehouseRate.price != null
                              ? `${warehouseRate.currency} ${warehouseRate.price.toFixed(2)}`
                              : "Not set"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
