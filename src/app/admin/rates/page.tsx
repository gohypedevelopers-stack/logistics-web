import prisma from "@/lib/prisma";
import Link from "next/link";
import { BadgeDollarSign, ChevronLeft, FileSpreadsheet, PencilLine, Trash2 } from "lucide-react";
import { deleteRateCardAction, importRateCardsCsvAction, saveRateCardAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminRatesPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ editRateCard?: string; notice?: string }>
    | { editRateCard?: string; notice?: string };
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const [routes, rateCards] = await Promise.all([
    prisma.route.findMany({
      where: { isActive: true },
      include: {
        originCountry: true,
        destinationCountry: true,
      },
      orderBy: [
        { originCountryId: "asc" },
        { destinationCountryId: "asc" },
        { updatedAt: "desc" },
      ],
    }),
    prisma.rateCard.findMany({
      include: {
        route: {
          include: {
            originCountry: true,
            destinationCountry: true,
          },
        },
      },
      orderBy: [
        { routeId: "asc" },
        { weightMin: "asc" },
        { weightMax: "asc" },
      ],
    }),
  ]);

  const editRateCard = resolvedSearchParams?.editRateCard
    ? rateCards.find((rateCard) => rateCard.id === resolvedSearchParams.editRateCard)
    : null;

  return (
    <div className="mx-auto min-h-full max-w-[1600px] bg-[#f8f9fa] p-8 font-sans lg:p-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
          <Link
            href="/admin/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E1B4B] text-white transition-colors hover:bg-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          Rates
        </div>
        <p className="mt-2 pl-10 text-sm font-medium text-slate-500">
          Manage customer-facing rate slabs for the active shipping lanes already configured in the system.
        </p>
      </div>

      {resolvedSearchParams?.notice ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-800">
          {resolvedSearchParams.notice}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
              <BadgeDollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Rate Card Entry</h2>
              <p className="text-sm font-medium text-slate-500">
                Add weight-based pricing against any active lane.
              </p>
            </div>
          </div>

          <form action={saveRateCardAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="rateCardId" value={editRateCard?.id || ""} />
            <select
              name="routeId"
              required
              defaultValue={editRateCard?.routeId || ""}
              className="md:col-span-2 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            >
              <option value="">Select route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.originCountry.code} to {route.destinationCountry.code}
                  {route.serviceLevel ? ` · ${route.serviceLevel}` : ""}
                  {route.name ? ` · ${route.name}` : ""}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="weightMin"
              min="0"
              step="0.01"
              placeholder="Weight min (kg)"
              defaultValue={editRateCard?.weightMin ?? ""}
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />
            <input
              type="number"
              name="weightMax"
              min="0"
              step="0.01"
              placeholder="Weight max (kg)"
              defaultValue={editRateCard?.weightMax ?? ""}
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />
            <input
              type="number"
              name="basePrice"
              min="0"
              step="0.01"
              placeholder="Base price"
              defaultValue={editRateCard?.basePrice ?? ""}
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />
            <input
              type="text"
              name="currency"
              placeholder="Currency, e.g. USD"
              defaultValue={editRateCard?.currency || "USD"}
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase text-slate-800 outline-none"
            />

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="h-12 rounded-xl bg-[#1E1B4B] px-6 text-sm font-bold text-white transition-colors hover:bg-slate-900"
              >
                {editRateCard ? "Update Rate Card" : "Save Rate Card"}
              </button>
              {editRateCard ? (
                <Link
                  href="/admin/rates"
                  className="inline-flex h-12 items-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel Edit
                </Link>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <FileSpreadsheet className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Rate Card CSV Upload</h2>
              <p className="text-sm font-medium text-slate-500">
                Import Excel-exported CSV files for rate slabs only.
              </p>
            </div>
          </div>

          <form action={importRateCardsCsvAction} className="space-y-4">
            <input type="hidden" name="redirectTo" value="/admin/rates" />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Headers</p>
              <p className="mt-2 break-all text-xs font-medium text-slate-500">
                origin_code,destination_code,service_level,route_name,weight_min,weight_max,base_price,currency,transit_days,notes
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="file"
                name="csvFile"
                accept=".csv,text/csv"
                required
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E1B4B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-[#1E1B4B] px-5 text-sm font-bold text-white transition-colors hover:bg-slate-900"
              >
                Import Rates
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1E1B4B]">Live Rate Card List</h2>
            <p className="text-sm font-medium text-slate-500">
              Current pricing slabs visible to customer quote and rates flows.
            </p>
          </div>
          <span className="w-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            {rateCards.length} rates
          </span>
        </div>

        <div className="space-y-3">
          {rateCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No rate cards saved yet.
            </div>
          ) : (
            rateCards.map((rateCard) => (
              <div key={rateCard.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr_0.8fr_auto] lg:items-center">
                  <div>
                    <p className="font-bold text-slate-900">
                      {rateCard.route.originCountry.code} to {rateCard.route.destinationCountry.code}
                      {rateCard.route.serviceLevel ? ` · ${rateCard.route.serviceLevel}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {rateCard.route.name || "Active shipping lane"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Weight Band
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {rateCard.weightMin}kg to {rateCard.weightMax}kg
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Price
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {rateCard.currency} {rateCard.basePrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/rates?editRateCard=${rateCard.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <PencilLine className="h-4 w-4" />
                      Edit
                    </Link>
                    <form action={deleteRateCardAction}>
                      <input type="hidden" name="rateCardId" value={rateCard.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-700 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
