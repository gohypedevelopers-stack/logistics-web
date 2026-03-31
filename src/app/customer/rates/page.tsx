import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requestQuoteAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function RatesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      quotations: {
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  const [countries, routes] = await Promise.all([
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
          orderBy: [{ weightMin: "asc" }, { weightMax: "asc" }],
        },
      },
      orderBy: [
        { originCountryId: "asc" },
        { destinationCountryId: "asc" },
        { updatedAt: "desc" },
      ],
    }),
  ]);

  return (
    <div className="mx-auto min-h-full max-w-[1500px] bg-[#f8f9fa] p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Request a Quote</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Submit a quote request using live routes and admin-managed rate cards from the database.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">New Quote Request</h2>

          <form action={requestQuoteAction} className="grid gap-4 md:grid-cols-2">
            <select
              name="originCountryId"
              required
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            >
              <option value="">Origin country</option>
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
              <option value="">Destination country</option>
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
              placeholder="PCS"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="number"
              name="weight"
              min="0.1"
              step="0.01"
              placeholder="Weight (KG)"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="number"
              name="declaredValue"
              min="0"
              step="0.01"
              placeholder="Declared value"
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
            />

            <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-500">
              Supported countries: {countries.length}
            </div>

            <textarea
              name="notes"
              rows={4}
              placeholder="Cargo notes, route notes, or handling instructions"
              className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none resize-none"
            />

            <button
              type="submit"
              className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-sm font-bold text-white transition-colors hover:bg-slate-900"
            >
              Submit Quote Request
            </button>
          </form>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">Recent Quote Requests</h2>

            <div className="space-y-4">
              {customer?.quotations?.length ? (
                customer.quotations.map((quote) => (
                  <div key={quote.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">{quote.quoteNumber}</p>
                        <p className="mt-1 text-sm text-slate-600">{quote.description || "No route details"}</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {quote.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No quote requests yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[#1E1B4B]">Available Routes &amp; Rates</h2>

            <div className="space-y-3">
              {routes.map((route) => (
                <div key={route.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">
                    {route.originCountry.name} ({route.originCountry.code}) to {route.destinationCountry.name} ({route.destinationCountry.code})
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {route.serviceLevel || "Standard"}
                    {route.transitDays ? ` · ${route.transitDays} days` : ""}
                  </p>
                  {route.rateCards.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {route.rateCards.map((rateCard) => (
                        <span
                          key={rateCard.id}
                          className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {rateCard.weightMin} to {rateCard.weightMax} kg · {rateCard.currency} {rateCard.basePrice.toFixed(2)}
                        </span>
                      ))}
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
        </section>
      </div>
    </div>
  );
}
