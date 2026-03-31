import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  ChevronLeft,
  ContactRound,
  FileSpreadsheet,
  MapPin,
  PencilLine,
  Trash2,
  UserRound,
} from "lucide-react";
import { deleteAddressAction, importAddressesCsvAction, saveAddressAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAddressesPage({
  searchParams,
}: {
  searchParams?:
    | Promise<{ editAddress?: string; notice?: string }>
    | { editAddress?: string; notice?: string };
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const [customers, countries, addresses] = await Promise.all([
    prisma.customerProfile.findMany({
      include: {
        user: true,
      },
      orderBy: [{ companyName: "asc" }, { createdAt: "desc" }],
    }),
    prisma.country.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    }),
    prisma.address.findMany({
      include: {
        customerProfile: {
          include: {
            user: true,
          },
        },
        country: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  const editAddress = resolvedSearchParams?.editAddress
    ? addresses.find((address) => address.id === resolvedSearchParams.editAddress)
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
          Addresses
        </div>
        <p className="mt-2 pl-10 text-sm font-medium text-slate-500">
          Add customer pickup addresses manually or bulk upload Excel CSV lists for the full address book.
        </p>
      </div>

      {resolvedSearchParams?.notice ? (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-medium text-blue-800">
          {resolvedSearchParams.notice}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                <ContactRound className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Address Entry</h2>
                <p className="text-sm font-medium text-slate-500">
                  Save pickup, office, or warehouse-linked customer addresses from one place.
                </p>
              </div>
            </div>

            <form action={saveAddressAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="addressId" value={editAddress?.id || ""} />

              <select
                name="customerProfileId"
                required
                defaultValue={editAddress?.customerProfileId || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.companyName || customer.user.name || customer.user.email} ({customer.user.email})
                  </option>
                ))}
              </select>

              <select
                name="countryId"
                required
                defaultValue={editAddress?.countryId || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              >
                <option value="">Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="label"
                placeholder="Label, e.g. Main Office"
                defaultValue={editAddress?.label || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="name"
                placeholder="Contact person"
                defaultValue={editAddress?.name || ""}
                required
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={editAddress?.phone || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                defaultValue={editAddress?.postalCode || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="street1"
                placeholder="Street address"
                defaultValue={editAddress?.street1 || ""}
                required
                className="md:col-span-2 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="street2"
                placeholder="Street 2"
                defaultValue={editAddress?.street2 || ""}
                className="md:col-span-2 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={editAddress?.city || ""}
                required
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                defaultValue={editAddress?.state || ""}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none"
              />

              <label className="md:col-span-2 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="isDefault"
                  defaultChecked={editAddress ? editAddress.isDefault : false}
                />
                Mark as default pickup address
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#1E1B4B] px-6 text-sm font-bold text-white transition-colors hover:bg-slate-900"
                >
                  {editAddress ? "Update Address" : "Save Address"}
                </button>
                {editAddress ? (
                  <Link
                    href="/admin/addresses"
                    className="inline-flex h-12 items-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel Edit
                  </Link>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">Excel / CSV Upload</h2>
                <p className="text-sm font-medium text-slate-500">
                  Export from Excel as CSV, then upload using the template columns below.
                </p>
              </div>
            </div>

            <form action={importAddressesCsvAction} className="space-y-4">
              <input
                type="file"
                name="csvFile"
                accept=".csv,text/csv"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#1E1B4B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                required
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
              >
                Import Address List
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">CSV headers</p>
              <p className="mt-2 break-all font-mono text-xs text-slate-500">
                customer_email,label,name,phone,street1,street2,city,state,postal_code,country_code,is_default
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E1B4B]">Saved Customer Addresses</h2>
              <p className="text-sm font-medium text-slate-500">
                Live address book used by customer accounts and shipment pickup flows.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              {addresses.length} addresses
            </span>
          </div>

          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No addresses saved yet.
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-bold text-slate-900">
                          {address.label || "Address"} {address.isDefault ? "· Default" : ""}
                        </p>
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {address.country.code}
                        </span>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-slate-400" />
                          {address.customerProfile.companyName ||
                            address.customerProfile.user.name ||
                            address.customerProfile.user.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <ContactRound className="h-4 w-4 text-slate-400" />
                          {address.name}
                          {address.phone ? ` · ${address.phone}` : ""}
                        </p>
                        <p className="flex items-start gap-2 sm:col-span-2">
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

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/addresses?editAddress=${address.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Link>
                      <form action={deleteAddressAction}>
                        <input type="hidden" name="addressId" value={address.id} />
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
    </div>
  );
}
