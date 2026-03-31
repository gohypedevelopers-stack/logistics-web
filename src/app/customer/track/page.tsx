import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Search, Truck } from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  buildShipmentTimeline,
  formatShipmentStatus,
  getShipmentStatusMeta,
} from "@/lib/shipment-utils";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }> | { id?: string };
}) {
  const resolvedParams = await searchParams;
  const trackingQuery = resolvedParams.id?.trim();

  let shipment = null;

  if (trackingQuery) {
    shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingId: trackingQuery }, { awb: trackingQuery }],
      },
      include: {
        country: true,
        receiverAddress: {
          include: {
            country: true,
          },
        },
        pickupAddress: {
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
    });
  }

  async function trackAction(formData: FormData) {
    "use server";

    const id = formData.get("trackingId");
    if (id) {
      redirect(`/customer/track?id=${id}`);
    }
  }

  const timeline = shipment ? buildShipmentTimeline(shipment.statusHistory, shipment.events) : [];
  const meta = shipment ? getShipmentStatusMeta(shipment.status) : null;

  return (
    <div className="mx-auto min-h-full max-w-[1200px] p-6 lg:p-8">
      {trackingQuery ? <RefreshHandler interval={30000} /> : null}

      <div className="mb-8 flex items-center gap-3">
        <Link href="/customer/shipments" className="app-button-secondary flex h-10 w-10 items-center justify-center">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Track Shipment</h1>
          <p className="text-sm text-slate-500">
            Enter an AWB or tracking ID to view the live shipment timeline.
          </p>
        </div>
      </div>

      <div className="app-card mb-8 p-8">
        <form action={trackAction} className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              name="trackingId"
              type="text"
              defaultValue={trackingQuery || ""}
              placeholder="Enter tracking ID or AWB"
              className="app-input h-14 w-full pl-12 pr-4 text-sm font-medium"
            />
          </div>
          <button type="submit" className="app-button-primary h-14 px-8 text-sm font-semibold">
            Track
          </button>
        </form>
      </div>

      {trackingQuery && !shipment ? (
        <div className="app-card p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Shipment Not Found</h2>
          <p className="mt-2 text-slate-500">
            No shipment matched <strong>{trackingQuery}</strong>.
          </p>
        </div>
      ) : null}

      {trackingQuery && shipment ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="app-card p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{shipment.trackingId}</h2>
                <p className="mt-1 text-sm text-slate-500">{meta?.summary}</p>
              </div>
              <StatusBadge status={shipment.status} />
            </div>

            {timeline.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No tracking updates available yet.
              </div>
            ) : (
              <div className="relative space-y-5 pl-8">
                <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-200" />
                {timeline.map((entry) => (
                  <div key={entry.id} className="relative">
                    <div className="absolute left-[-30px] top-6 h-3.5 w-3.5 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />
                    <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-5">
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
            <div className="app-card p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Shipment Snapshot
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">Current shipment overview</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-500">AWB:</span> {shipment.awb || "Pending"}</p>
                <p><span className="font-semibold text-slate-500">Reference:</span> {shipment.referenceNo || "Not assigned"}</p>
                <p>
                  <span className="font-semibold text-slate-500">Destination:</span>{" "}
                  {shipment.receiverAddress?.city || "-"},{" "}
                  {shipment.receiverAddress?.country?.name || shipment.country?.name || "-"}
                </p>
              </div>
            </div>

            <div className="app-card p-8">
              <h3 className="mb-5 text-lg font-semibold text-slate-900">Shipment Details</h3>

              <div className="space-y-4 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-500">Description:</span> {shipment.content || "No description"}</p>
                <p><span className="font-semibold text-slate-500">PCS:</span> {shipment.pcs ?? "-"}</p>
                <p><span className="font-semibold text-slate-500">Weight:</span> {shipment.weight ? `${shipment.weight} KG` : "-"}</p>
                <p><span className="font-semibold text-slate-500">Receiver:</span> {shipment.receiverName || shipment.receiverAddress?.name || "-"}</p>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
