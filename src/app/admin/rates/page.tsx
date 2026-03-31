import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Globe2, Route as RouteIcon, Warehouse as WarehouseIcon } from "lucide-react";
import { deleteWarehouseAction, saveCountryAction, saveRouteAction, saveWarehouseAction } from "./actions";
import { ensureDefaultWarehouses } from "@/lib/logistics-bootstrap";

export const dynamic = "force-dynamic";

export default async function AdminRoutesAndCountriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ editWarehouse?: string }> | { editWarehouse?: string };
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
      },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.warehouse.findMany({
      include: {
        country: true,
      },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
    }),
  ]);
  const editWarehouse = resolvedSearchParams?.editWarehouse
    ? warehouses.find((warehouse) => warehouse.id === resolvedSearchParams.editWarehouse)
    : null;

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
          <Link
            href="/admin/dashboard"
            className="w-8 h-8 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          Countries & Routes
        </div>
        <p className="text-sm font-medium text-slate-500 mt-2 pl-10">
          Manage supported countries and active shipment lanes used across the platform.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Supported Countries</h2>
              <p className="text-sm font-medium text-slate-500">
                Add or update operational countries.
              </p>
            </div>
          </div>

          <form action={saveCountryAction} className="grid gap-4 md:grid-cols-2 mb-8">
            <input
              type="text"
              name="code"
              placeholder="Code, e.g. UK"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Country name"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
              required
            />
            <input
              type="number"
              name="displayOrder"
              placeholder="Display order"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            />
            <label className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" name="isActive" defaultChecked />
              Active country
            </label>
            <button
              type="submit"
              className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-white font-bold text-sm hover:bg-slate-900 transition-colors"
            >
              Save Country
            </button>
          </form>

          <div className="space-y-3">
            {countries.map((country) => (
              <div
                key={country.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {country.name} ({country.code})
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Display order: {country.displayOrder}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    country.isActive ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {country.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <RouteIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Shipment Routes</h2>
              <p className="text-sm font-medium text-slate-500">
                Configure the supported lanes customers can book.
              </p>
            </div>
          </div>

          <form action={saveRouteAction} className="grid gap-4 md:grid-cols-2 mb-8">
            <select
              name="originCountryId"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
              required
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
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
              required
            >
              <option value="">Destination country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="Lane name, e.g. UK to Dubai Express"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="text"
              name="serviceLevel"
              placeholder="Service level"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            />

            <input
              type="number"
              name="transitDays"
              placeholder="Transit days"
              className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            />

            <label className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" name="isActive" defaultChecked />
              Active route
            </label>

            <textarea
              name="notes"
              rows={4}
              placeholder="Operational note or route remarks"
              className="md:col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none resize-none"
            />

            <button
              type="submit"
              className="md:col-span-2 h-12 rounded-xl bg-[#1E1B4B] text-white font-bold text-sm hover:bg-slate-900 transition-colors"
            >
              Save Route
            </button>
          </form>

          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {route.originCountry.name} ({route.originCountry.code}) to{" "}
                    {route.destinationCountry.name} ({route.destinationCountry.code})
                  </p>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    {route.name || "Lane name not set"}
                    {route.serviceLevel ? ` · ${route.serviceLevel}` : ""}
                    {route.transitDays ? ` · ${route.transitDays} days` : ""}
                  </p>
                  {route.notes && (
                    <p className="text-sm text-slate-500 mt-2">{route.notes}</p>
                  )}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    route.isActive ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {route.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
            <WarehouseIcon className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E1B4B]">Company Warehouses</h2>
            <p className="text-sm font-medium text-slate-500">
              Warehouses used when customers choose warehouse drop during shipment creation.
            </p>
          </div>
        </div>

        <form action={saveWarehouseAction} className="grid gap-4 md:grid-cols-3 mb-8">
          <input type="hidden" name="warehouseId" value={editWarehouse?.id || ""} />
          <input
            type="text"
            name="code"
            placeholder="Warehouse code"
            defaultValue={editWarehouse?.code || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Warehouse name"
            defaultValue={editWarehouse?.name || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            required
          />
          <select
            name="countryId"
            required
            defaultValue={editWarehouse?.countryId || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
          >
            <option value="">Warehouse country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="city"
            placeholder="City"
            defaultValue={editWarehouse?.city || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            defaultValue={editWarehouse?.phone || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal code"
            defaultValue={editWarehouse?.postalCode || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
          />
          <input
            type="text"
            name="street1"
            placeholder="Street address"
            defaultValue={editWarehouse?.street1 || ""}
            className="md:col-span-2 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
            required
          />
          <label className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 text-sm font-medium text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked={editWarehouse ? editWarehouse.isActive : true} />
            Active warehouse
          </label>
          <input
            type="text"
            name="state"
            placeholder="State"
            defaultValue={editWarehouse?.state || ""}
            className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
          />
          <input
            type="text"
            name="street2"
            placeholder="Street 2"
            defaultValue={editWarehouse?.street2 || ""}
            className="md:col-span-2 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none"
          />
          <button
            type="submit"
            className="md:col-span-3 h-12 rounded-xl bg-[#1E1B4B] text-white font-bold text-sm hover:bg-slate-900 transition-colors"
          >
            {editWarehouse ? "Update Warehouse" : "Save Warehouse"}
          </button>
        </form>

        <div className="space-y-3">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-bold text-slate-900">
                  {warehouse.name} ({warehouse.code})
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {warehouse.city}, {warehouse.country.name}
                  {warehouse.phone ? ` · ${warehouse.phone}` : ""}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {warehouse.street1}
                  {warehouse.street2 ? `, ${warehouse.street2}` : ""}
                </p>
              </div>
              <span
                className="flex items-center gap-2"
              >
                <Link
                  href={`/admin/rates?editWarehouse=${warehouse.id}`}
                  className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <form action={deleteWarehouseAction}>
                  <input type="hidden" name="warehouseId" value={warehouse.id} />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </form>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    warehouse.isActive ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {warehouse.isActive ? "Active" : "Inactive"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
