import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Package2,
  Phone,
  UserRound,
} from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  buildShipmentTimeline,
  formatShipmentStatus,
  getShipmentStatusMeta,
} from "@/lib/shipment-utils";

export const dynamic = "force-dynamic";

export default async function ShipmentDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const shipment = await prisma.shipment.findFirst({
    where: {
      id: resolvedParams.id,
      ...(session.user.role === "CUSTOMER" ? { customer: { userId: session.user.id } } : {}),
    },
    include: {
      country: true,
      route: {
        include: {
          originCountry: true,
          destinationCountry: true,
        },
      },
      warehouse: {
        include: {
          country: true,
        },
      },
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
      invoice: true,
    },
  });

  if (!shipment) {
    return (
      <div className="mx-auto mt-10 max-w-2xl rounded-[20px] border border-slate-200 bg-white p-16 text-center text-slate-500 shadow-sm">
        Shipment record not found or inaccessible.
      </div>
    );
  }

  const timeline = buildShipmentTimeline(shipment.statusHistory, shipment.events);
  const statusMeta = getShipmentStatusMeta(shipment.status);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 pb-24 pt-6 lg:px-8">
      <RefreshHandler interval={30000} />

      <div className="app-card p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Link
              href="/customer/shipments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back to shipments
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {shipment.trackingId}
              </h1>
              <StatusBadge status={shipment.status} />
            </div>

            <p className="text-sm text-slate-500">{statusMeta.summary}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:w-[380px]">
            <div className="app-card-subtle px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">AWB</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{shipment.awb || "Pending assignment"}</p>
            </div>
            <div className="app-card-subtle px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Reference</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{shipment.referenceNo || "Not assigned"}</p>
            </div>
            <div className="app-card-subtle px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Country</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {shipment.country?.name || shipment.receiverAddress?.country?.name || "Not assigned"}
              </p>
            </div>
            <div className="app-card-subtle px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Payment</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {shipment.invoice ? shipment.invoice.status : shipment.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="app-card p-8">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">Tracking Timeline</h2>

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
                        {entry.note ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{entry.note}</p> : null}
                        {entry.location ? (
                          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {entry.location}
                          </p>
                        ) : null}
                      </div>
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <CalendarDays className="h-4 w-4" />
                        {format(entry.createdAt, "dd MMM yyyy, h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-8">
          <section className="app-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Package2 className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Shipment Summary</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">PCS</p>
                <p className="mt-1 font-medium text-slate-900">{shipment.pcs ?? "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Weight</p>
                <p className="mt-1 font-medium text-slate-900">{shipment.weight ? `${shipment.weight} KG` : "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Declared Value</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.amount != null ? `$${shipment.amount}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Collection Type</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.collectionType === "WAREHOUSE_DROP" ? "Warehouse Drop" : "Pickup"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pickup Date</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.pickupDate ? format(new Date(shipment.pickupDate), "PPP") : "-"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Description</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {shipment.content || "No description supplied."}
              </p>
            </div>
          </section>

          <section className="app-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserRound className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Receiver</h2>
            </div>

            <div className="space-y-3 text-sm">
              <p className="font-medium text-slate-900">
                {shipment.receiverName || shipment.receiverAddress?.name || "Receiver"}
              </p>
              <p className="leading-relaxed text-slate-600">
                {shipment.receiverAddress?.street1 || "No destination address"}
              </p>
              <p className="text-slate-600">
                {shipment.receiverAddress?.city || "-"},{" "}
                {shipment.receiverAddress?.country?.name || shipment.country?.name || "-"}
              </p>
              <p className="flex items-center gap-2 font-medium text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" />
                {shipment.receiverPhone || shipment.receiverAddress?.phone || "No phone"}
              </p>

              {shipment.warehouse ? (
                <div className="app-card-subtle mt-4 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Selected Warehouse
                  </p>
                  <p className="mt-2 font-medium text-slate-900">
                    {shipment.warehouse.name} ({shipment.warehouse.code})
                  </p>
                  <p className="mt-1 text-slate-600">
                    {shipment.warehouse.street1}, {shipment.warehouse.city}, {shipment.warehouse.country.name}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
