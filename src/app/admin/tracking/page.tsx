import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Activity, ArrowRight, ChevronLeft, MapPin, Search } from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  buildShipmentTimeline,
  formatShipmentStatus,
  getShipmentStatusMeta,
} from "@/lib/shipment-utils";

export const dynamic = "force-dynamic";

export default async function AdminTracking({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const trackingQuery = resolvedSearchParams.q?.trim() || "";

  const [searchedShipment, recentShipments] = await Promise.all([
    trackingQuery
      ? prisma.shipment.findFirst({
          where: {
            OR: [
              { trackingId: { equals: trackingQuery, mode: "insensitive" } },
              { awb: { equals: trackingQuery, mode: "insensitive" } },
            ],
          },
          include: {
            customer: {
              include: {
                user: true,
              },
            },
            country: true,
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
            statusHistory: {
              orderBy: { createdAt: "desc" },
            },
            events: {
              orderBy: { createdAt: "desc" },
            },
          },
        })
      : Promise.resolve(null),
    prisma.shipment.findMany({
      orderBy: { updatedAt: "desc" },
      take: 12,
      include: {
        customer: {
          include: {
            user: true,
          },
        },
        pickupAddress: true,
        receiverAddress: true,
      },
    }),
  ]);

  async function trackAction(formData: FormData) {
    "use server";

    const value = formData.get("trackingId");
    if (typeof value === "string" && value.trim()) {
      redirect(`/admin/tracking?q=${encodeURIComponent(value.trim())}`);
    }
    redirect("/admin/tracking");
  }

  const timeline = searchedShipment
    ? buildShipmentTimeline(searchedShipment.statusHistory, searchedShipment.events)
    : [];
  const statusMeta = searchedShipment
    ? getShipmentStatusMeta(searchedShipment.status)
    : null;

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      {trackingQuery ? <RefreshHandler interval={30000} /> : <RefreshHandler interval={45000} />}

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/dashboard" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Shipment Tracking
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Locate any shipment in the global network by Tracking ID or AWB.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-sm text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rapid Lookup</h2>
              <p className="text-sm font-medium text-slate-400">
                Enter an AWB number or tracking ID to retrieve complete lifecycle data.
              </p>
            </div>
            <form action={trackAction} className="relative group max-w-xl mx-auto">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="trackingId"
                defaultValue={trackingQuery}
                placeholder="Enter Tracking ID or AWB"
                className="w-full h-16 pl-12 pr-40 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-400/5 focus:border-blue-300 transition-all"
              />
              <button type="submit" className="absolute right-2 top-2 h-12 px-8 bg-[#1E1B4B] text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all">
                Track Now
              </button>
            </form>
          </div>
        </div>

        {trackingQuery && !searchedShipment ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm text-center">
            <h3 className="text-xl font-bold text-slate-900">Shipment not found</h3>
            <p className="mt-2 text-sm text-slate-500">
              No shipment matched <span className="font-semibold text-slate-900">{trackingQuery}</span>.
            </p>
          </div>
        ) : null}

        {trackingQuery && searchedShipment ? (
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                      {searchedShipment.trackingId}
                    </h3>
                    <StatusBadge status={searchedShipment.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{statusMeta?.summary}</p>
                </div>
                <Link
                  href={`/admin/shipments/${searchedShipment.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  Open Shipment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {timeline.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No tracking updates available yet.
                </div>
              ) : (
                <div className="relative space-y-5 pl-8">
                  <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-200" />
                  {timeline.map((entry) => (
                    <div key={entry.id} className="relative">
                      <div className="absolute left-[-30px] top-6 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="font-medium text-slate-900">{entry.title}</p>
                            {entry.status ? (
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                {formatShipmentStatus(entry.status)}
                              </p>
                            ) : null}
                            {entry.note ? <p className="mt-3 text-sm text-slate-600">{entry.note}</p> : null}
                            {entry.location ? (
                              <p className="mt-3 text-sm font-medium text-slate-700">{entry.location}</p>
                            ) : null}
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {format(entry.createdAt, "dd MMM yyyy, h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-8">
              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Shipment Snapshot</h3>

                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-500">AWB:</span> {searchedShipment.awb || "Pending"}</p>
                  <p><span className="font-semibold text-slate-500">Reference:</span> {searchedShipment.referenceNo || "Not assigned"}</p>
                  <p>
                    <span className="font-semibold text-slate-500">Customer:</span>{" "}
                    {searchedShipment.customer.companyName ||
                      searchedShipment.customer.user?.name ||
                      searchedShipment.customer.user?.email ||
                      "Private customer"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-500">Destination:</span>{" "}
                    {searchedShipment.receiverAddress?.city || "-"},{" "}
                    {searchedShipment.receiverAddress?.country?.name ||
                      searchedShipment.country?.name ||
                      "-"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Package Details</h3>

                <div className="mt-5 space-y-4 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-500">Description:</span> {searchedShipment.content || "No description"}</p>
                  <p><span className="font-semibold text-slate-500">PCS:</span> {searchedShipment.pcs ?? "-"}</p>
                  <p><span className="font-semibold text-slate-500">Weight:</span> {searchedShipment.weight ? `${searchedShipment.weight} KG` : "-"}</p>
                  <p>
                    <span className="font-semibold text-slate-500">Pickup:</span>{" "}
                    {searchedShipment.pickupAddress?.city || "-"},{" "}
                    {searchedShipment.pickupAddress?.country?.name || "-"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {recentShipments.map((ship) => (
              <div key={ship.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col justify-between h-[260px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-bold text-slate-800 text-base uppercase group-hover:text-blue-700 transition-colors tracking-tight">{ship.trackingId}</div>
                  <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase rounded border border-slate-100">{ship.status.replace(/_/g, " ")}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Last Update</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{ship.pickupAddress?.city || "HUB-A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{ship.receiverAddress?.city || "HUB-B"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-300 uppercase truncate max-w-[140px]">
                    {ship.customer?.companyName || ship.customer?.user?.name || "Private Client"}
                  </div>
                  <Link href={`/admin/shipments/${ship.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
