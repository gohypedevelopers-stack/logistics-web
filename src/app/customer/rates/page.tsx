import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { requestQuoteAction } from "./actions";
import {
  getEffectiveCustomerRate,
  getEffectiveWarehouseRate,
} from "@/lib/customer-rate-utils";
import {
  getCustomerQuotationsByUserId,
  getQuotationStatusMeta,
} from "@/lib/quotation-utils";

export const dynamic = "force-dynamic";

export default async function RatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Access denied. Please sign in.</div>;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!customer) {
    return <div>Customer profile not found.</div>;
  }

  const [quotationRequests, countries, routes, warehouses] = await Promise.all([
    getCustomerQuotationsByUserId(session.user.id, 8),
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
      include: {
        originCountry: true,
        destinationCountry: true,
        rateCards: {
          include: {
            customerOverrides: {
              where: {
                customerId: customer.id,
              },
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
          where: {
            customerId: customer.id,
          },
        },
      },
      orderBy: [{ countryId: "asc" }, { city: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="mx-auto min-h-full max-w-[1500px] bg-[#f8f9fa] p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Quotation Requests</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Submit a quotation request using live routes and current admin-managed rate cards.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">New Quotation Request</h2>

          <form action={requestQuoteAction} className="grid gap-4 md:grid-cols-2">
            <select
              name="originCountryId"
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            >
              <option value="">Origin Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>

            <select
              name="destinationCountryId"
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            >
              <option value="">Destination Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="pcs"
              min="1"
              placeholder="Pieces"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="number"
              name="weight"
              min="0.1"
              step="0.01"
              placeholder="Weight (kg)"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="number"
              name="declaredValue"
              min="0"
              step="0.01"
              placeholder="Declared value (USD)"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500">
              Supported countries: {countries.length}
            </div>

            <textarea
              name="notes"
              rows={4}
              placeholder="Shipment notes, route details, or handling instructions"
              className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none resize-none"
            />

            <button
              type="submit"
              className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-sm font-bold text-white transition-colors hover:bg-slate-900"
            >
              Submit Quotation Request
            </button>
          </form>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">Quotation Requests</h2>

            <div className="space-y-4">
              {quotationRequests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No quotation requests have been submitted yet.
                </div>
              ) : (
                quotationRequests.map((quote) => {
                  const statusMeta = getQuotationStatusMeta(quote.status);

                  return (
                    <div key={quote.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-bold text-slate-900">{quote.quoteNumber}</p>
                              <span
                                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${statusMeta.tone}`}
                              >
                                {statusMeta.label}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{quote.description || "No route details provided."}</p>
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            {formatDistanceToNow(new Date(quote.updatedAt), { addSuffix: true })}
                          </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Status
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{statusMeta.summary}</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Weight / Value
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">
                              {quote.weight ? `${quote.weight} KG` : "Weight pending"}{" "}
                              {quote.amount != null ? `| $${quote.amount}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">Available Routes and Rates</h2>

            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">
                    {route.originCountry.name} ({route.originCountry.code}) to {route.destinationCountry.name} ({route.destinationCountry.code})
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {route.serviceLevel || "Standard"}
                    {route.transitDays ? ` | ${route.transitDays} days` : ""}
                  </p>
                  {route.rateCards.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {route.rateCards.map((rateCard) => {
                        const effectiveRate = getEffectiveCustomerRate(rateCard);

                        return (
                          <span
                            key={rateCard.id}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              effectiveRate.isOverride
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-blue-100 bg-white text-blue-700"
                            }`}
                          >
                            {rateCard.weightMin} to {rateCard.weightMax} kg | {effectiveRate.currency}{" "}
                            {effectiveRate.price.toFixed(2)}
                            {effectiveRate.isOverride ? " | custom price" : ""}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Rate card pending admin update
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">Warehouse Charges</h2>

            <div className="space-y-3">
              {warehouses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No active warehouses are currently available.
                </div>
              ) : (
                warehouses.map((warehouse) => {
                  const warehouseRate = getEffectiveWarehouseRate(warehouse);

                  return (
                    <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {warehouse.name} ({warehouse.code})
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {warehouse.city}, {warehouse.country.name}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            warehouseRate.isOverride
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          {warehouseRate.price != null
                            ? `${warehouseRate.currency} ${warehouseRate.price.toFixed(2)}`
                            : "Charge not set"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
