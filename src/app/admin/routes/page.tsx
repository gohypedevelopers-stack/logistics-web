import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, FileSpreadsheet, Globe2, PencilLine, Route as RouteIcon, Trash2, Warehouse as WarehouseIcon } from "lucide-react";
import {
  deleteWarehouseAction,
  importCountriesCsvAction,
  importRoutesCsvAction,
  importWarehousesCsvAction,
  saveCountryAction,
  saveRouteAction,
  saveWarehouseAction,
} from "../rates/actions";
import { ensureDefaultWarehouses } from "@/lib/logistics-bootstrap";

export const dynamic = "force-dynamic";

export default async function AdminRoutesPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ editWarehouse?: string; notice?: string }>
    | { editWarehouse?: string; notice?: string };
}) {
  await ensureDefaultWarehouses();
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const [countries, routes, warehouses] = await Promise.all([
    prisma.country.findMany({
      orderBy: [{ isActive: "desc" }, { displayOrder: "asc" }, { name: "asc" }],
    }),
    prisma.route.findMany({
      include: {
        originCountry: true,
        destinationCountry: true,
        rateCards: true,
      },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.warehouse.findMany({
      include: { country: true },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  const editWarehouse = resolvedSearchParams?.editWarehouse
    ? warehouses.find((warehouse) => warehouse.id === resolvedSearchParams.editWarehouse)
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
          Routes
        </div>
        <p className="mt-2 pl-10 text-sm font-medium text-slate-500">
          Manage countries, shipment lanes, warehouses, and supporting CSV uploads separately from rates.
        </p>
      </div>

      {resolvedSearchParams?.notice ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-800">
          {resolvedSearchParams.notice}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                <Globe2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Supported Countries</h2>
                <p className="text-sm font-medium text-slate-500">
                  Add or update operational countries.
                </p>
              </div>
            </div>

            <form action={saveCountryAction} className="grid gap-4 md:grid-cols-2">
              <input type="text" name="code" placeholder="Code, e.g. UK" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase text-slate-800 outline-none" required />
              <input type="text" name="name" placeholder="Country name" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required />
              <input type="number" name="displayOrder" placeholder="Display order" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked />
                Active country
              </label>
              <button type="submit" className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-sm font-bold text-white transition-colors hover:bg-slate-900">
                Save Country
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {countries.map((country) => (
                <div key={country.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="font-bold text-slate-900">{country.name} ({country.code})</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">Display order: {country.displayOrder}</p>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${country.isActive ? "text-emerald-700" : "text-slate-400"}`}>
                    {country.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <FileSpreadsheet className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Routes CSV Upload</h2>
                <p className="text-sm font-medium text-slate-500">
                  Import countries, lanes, and warehouses from Excel-exported CSV files.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <form action={importCountriesCsvAction} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input type="hidden" name="redirectTo" value="/admin/routes" />
                <p className="font-semibold text-slate-900">Countries CSV</p>
                <p className="mt-1 text-sm text-slate-500">Headers: code,name,display_order,is_active</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input type="file" name="csvFile" accept=".csv,text/csv" required className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E1B4B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                  <button type="submit" className="h-12 rounded-xl bg-[#1E1B4B] px-5 text-sm font-bold text-white transition-colors hover:bg-slate-900">Import</button>
                </div>
              </form>

              <form action={importRoutesCsvAction} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input type="hidden" name="redirectTo" value="/admin/routes" />
                <p className="font-semibold text-slate-900">Routes CSV</p>
                <p className="mt-1 text-sm text-slate-500">Headers: origin_code,destination_code,name,service_level,transit_days,notes,is_active</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input type="file" name="csvFile" accept=".csv,text/csv" required className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E1B4B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                  <button type="submit" className="h-12 rounded-xl bg-[#1E1B4B] px-5 text-sm font-bold text-white transition-colors hover:bg-slate-900">Import</button>
                </div>
              </form>

              <form action={importWarehousesCsvAction} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input type="hidden" name="redirectTo" value="/admin/routes" />
                <p className="font-semibold text-slate-900">Warehouses CSV</p>
                <p className="mt-1 text-sm text-slate-500">Headers: code,name,country_code,city,street1,street2,state,postal_code,phone,is_active</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input type="file" name="csvFile" accept=".csv,text/csv" required className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E1B4B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                  <button type="submit" className="h-12 rounded-xl bg-[#1E1B4B] px-5 text-sm font-bold text-white transition-colors hover:bg-slate-900">Import</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <RouteIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Shipment Routes</h2>
                <p className="text-sm font-medium text-slate-500">
                  Configure supported lanes that customers can book or request quotes against.
                </p>
              </div>
            </div>

            <form action={saveRouteAction} className="grid gap-4 md:grid-cols-2">
              <select name="originCountryId" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required>
                <option value="">Origin country</option>
                {countries.map((country) => <option key={country.id} value={country.id}>{country.name} ({country.code})</option>)}
              </select>
              <select name="destinationCountryId" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required>
                <option value="">Destination country</option>
                {countries.map((country) => <option key={country.id} value={country.id}>{country.name} ({country.code})</option>)}
              </select>
              <input type="text" name="name" placeholder="Lane name" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <input type="text" name="serviceLevel" placeholder="Service level" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <input type="number" name="transitDays" placeholder="Transit days" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked />
                Active route
              </label>
              <textarea name="notes" rows={4} placeholder="Operational note or route remarks" className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none" />
              <button type="submit" className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-sm font-bold text-white transition-colors hover:bg-slate-900">
                Save Route
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {routes.map((route) => (
                <div key={route.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        {route.originCountry.name} ({route.originCountry.code}) to {route.destinationCountry.name} ({route.destinationCountry.code})
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {route.name || "Lane name not set"}
                        {route.serviceLevel ? ` · ${route.serviceLevel}` : ""}
                        {route.transitDays ? ` · ${route.transitDays} days` : ""}
                      </p>
                      {route.notes ? <p className="mt-2 text-sm text-slate-500">{route.notes}</p> : null}
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {route.rateCards.length} rate bands linked
                      </p>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${route.isActive ? "text-emerald-700" : "text-slate-400"}`}>
                      {route.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
                <WarehouseIcon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Company Warehouses</h2>
                <p className="text-sm font-medium text-slate-500">
                  Warehouses used when customers choose warehouse drop during shipment creation.
                </p>
              </div>
            </div>

            <form action={saveWarehouseAction} className="grid gap-4 md:grid-cols-3">
              <input type="hidden" name="warehouseId" value={editWarehouse?.id || ""} />
              <input type="text" name="code" placeholder="Warehouse code" defaultValue={editWarehouse?.code || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium uppercase text-slate-800 outline-none" required />
              <input type="text" name="name" placeholder="Warehouse name" defaultValue={editWarehouse?.name || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required />
              <select name="countryId" required defaultValue={editWarehouse?.countryId || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none">
                <option value="">Warehouse country</option>
                {countries.map((country) => <option key={country.id} value={country.id}>{country.name} ({country.code})</option>)}
              </select>
              <input type="text" name="city" placeholder="City" defaultValue={editWarehouse?.city || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required />
              <input type="text" name="phone" placeholder="Phone" defaultValue={editWarehouse?.phone || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <input type="text" name="postalCode" placeholder="Postal code" defaultValue={editWarehouse?.postalCode || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <input type="text" name="street1" placeholder="Street address" defaultValue={editWarehouse?.street1 || ""} className="md:col-span-2 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" required />
              <label className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked={editWarehouse ? editWarehouse.isActive : true} />
                Active warehouse
              </label>
              <input type="text" name="state" placeholder="State" defaultValue={editWarehouse?.state || ""} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <input type="text" name="street2" placeholder="Street 2" defaultValue={editWarehouse?.street2 || ""} className="md:col-span-2 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none" />
              <button type="submit" className="md:col-span-3 h-12 rounded-xl bg-[#1E1B4B] text-sm font-bold text-white transition-colors hover:bg-slate-900">
                {editWarehouse ? "Update Warehouse" : "Save Warehouse"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {warehouses.map((warehouse) => (
                <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{warehouse.name} ({warehouse.code})</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {warehouse.city}, {warehouse.country.name}
                        {warehouse.phone ? ` · ${warehouse.phone}` : ""}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {warehouse.street1}
                        {warehouse.street2 ? `, ${warehouse.street2}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/routes?editWarehouse=${warehouse.id}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-50">
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                      <form action={deleteWarehouseAction}>
                        <input type="hidden" name="warehouseId" value={warehouse.id} />
                        <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-700 transition-colors hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
