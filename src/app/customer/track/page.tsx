import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Clock3, MapPinned, Package2, Search, Truck } from "lucide-react";
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
  type TrackShipmentRecord = Prisma.ShipmentGetPayload<{
    include: {
      country: true;
      receiverAddress: {
        include: {
          country: true;
        };
      };
      pickupAddress: {
        include: {
          country: true;
        };
      };
      statusHistory: true;
      events: true;
    };
  }>;

  let shipment: TrackShipmentRecord | null = null;

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
  const latestUpdate = timeline[0] ?? null;
  const timelineCount = timeline.length;

  return (
    <div className="mx-auto min-h-full max-w-[1280px] p-6 lg:p-8">
      {trackingQuery ? <RefreshHandler interval={30000} /> : null}

      <div className="mb-8 overflow-hidden rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f6f9ff_45%,#eef5ff_100%)] shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Link
                href="/customer/shipments"
                className="app-button-secondary flex h-10 w-10 items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
                Live Tracking
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-[2.4rem]">
              Track Shipment
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 lg:text-base">
              Enter an AWB or tracking ID to view the live shipment timeline, latest updates, and route snapshot in one place.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Lookup</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">AWB or Tracking ID</p>
              </div>
              <div className="rounded-[18px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Refresh</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Auto-updates while open</p>
              </div>
              <div className="rounded-[18px] border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">History</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Timeline plus status cards</p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.05)]">
            <form action={trackAction} className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  name="trackingId"
                  type="text"
                  defaultValue={trackingQuery || ""}
                  placeholder="Enter tracking ID or AWB"
                  className="app-input h-14 w-full rounded-[16px] border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium"
                />
              </div>
              <button type="submit" className="app-button-primary h-14 rounded-[16px] px-8 text-sm font-semibold">
                Track
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                Search by AWB
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                Search by tracking ID
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                Live tracking updates
              </span>
            </div>
          </div>
        </div>
      </div>

      {trackingQuery && !shipment ? (
        <div className="app-card border border-rose-100 bg-[linear-gradient(180deg,#fffafa_0%,#ffffff_100%)] p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600">
            <Package2 className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">Shipment Not Found</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            No shipment matched <strong className="text-slate-900">{trackingQuery}</strong>. Check the AWB or tracking ID and try again.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/customer/shipments" className="app-button-secondary px-5 py-3 text-sm font-semibold">
              Back to shipments
            </Link>
            <Link href="/customer/shipments/new" className="app-button-primary px-5 py-3 text-sm font-semibold">
              Create shipment
            </Link>
          </div>
        </div>
      ) : null}

      {trackingQuery && shipment ? (
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
          <section className="app-card overflow-hidden p-0">
            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Live Timeline
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                    {shipment.trackingId}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{meta?.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={shipment.status} />
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {timelineCount} updates
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">AWB</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{shipment.awb || "Pending"}</p>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Reference</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {shipment.referenceNo || "Not assigned"}
                  </p>
                </div>
                <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Latest Update
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {latestUpdate ? format(latestUpdate.createdAt, "dd MMM yyyy, h:mm a") : "No updates yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              {timeline.length === 0 ? (
                <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                  No tracking updates available yet.
                </div>
              ) : (
                <div className="relative space-y-5 pl-8">
                  <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-200" />
                  {timeline.map((entry) => (
                    <div key={entry.id} className="relative">
                      <div className="absolute left-[-30px] top-6 h-3.5 w-3.5 rounded-full border-2 border-white bg-orange-600 shadow-sm" />
                      <div className="rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-slate-950">{entry.title}</p>
                            {entry.status ? (
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                {formatShipmentStatus(entry.status)}
                              </p>
                            ) : null}
                            {entry.note ? <p className="mt-3 text-sm leading-6 text-slate-600">{entry.note}</p> : null}
                            {entry.location ? (
                              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
                                <MapPinned className="h-4 w-4 text-slate-400" />
                                {entry.location}
                              </div>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            <Clock3 className="h-4 w-4" />
                            {format(entry.createdAt, "dd MMM yyyy, h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-8">
            <div className="app-card overflow-hidden p-0">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Shipment Snapshot
                    </p>
                    <h3 className="text-lg font-semibold text-slate-950">Current shipment overview</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Destination
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {shipment.receiverAddress?.city || "-"},{" "}
                      {shipment.receiverAddress?.country?.name || shipment.country?.name || "-"}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Receiver
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {shipment.receiverName || shipment.receiverAddress?.name || "-"}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">PCS</p>
                    <p className="mt-1 font-semibold text-slate-900">{shipment.pcs ?? "-"}</p>
                  </div>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Weight
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {shipment.weight ? `${shipment.weight} KG` : "-"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Description
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {shipment.content || "No description"}
                  </p>
                </div>
              </div>
            </div>

            <div className="app-card p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Next Step
                  </p>
                  <h3 className="text-lg font-semibold text-slate-950">What to do now</h3>
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Active
                </span>
              </div>

              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <p>1. Review the latest timeline entry for the current shipment state.</p>
                <p>2. Compare AWB and tracking ID when sharing shipment details with support.</p>
                <p>3. Open the shipment record if you need the full order and history page.</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/customer/shipments" className="app-button-secondary px-4 py-2 text-sm font-semibold">
                  View Shipments
                </Link>
                <Link href="/customer/shipments/new" className="app-button-primary px-4 py-2 text-sm font-semibold">
                  Create Shipment
                </Link>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="app-card p-8">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">How tracking works</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your AWB or tracking ID to see the live route, timeline, and shipment snapshot.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Find ID</p>
                <p className="mt-2 font-semibold text-slate-900">Use the AWB from shipment booking</p>
                <p className="mt-2 text-sm text-slate-600">You can paste either the AWB or the tracking ID.</p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Track Live</p>
                <p className="mt-2 font-semibold text-slate-900">View timeline updates in real time</p>
                <p className="mt-2 text-sm text-slate-600">The page refreshes automatically when a shipment is selected.</p>
              </div>
            </div>
          </section>

          <section className="app-card p-8">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recent guidance</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-[18px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Check the booking confirmation</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The confirmation email or order page contains the AWB or tracking ID you need.
                </p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Use the latest shipment record</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  When you have multiple shipments, use the most recent one from the dashboard or shipment list.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/customer/shipments" className="app-button-secondary px-4 py-2 text-sm font-semibold">
                  Open Shipments
                </Link>
                <Link href="/customer/shipments/new" className="app-button-primary px-4 py-2 text-sm font-semibold">
                  New Shipment
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
