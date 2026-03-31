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
  ReceiptText,
  Route,
  UserRound,
} from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  ALL_SHIPMENT_STATUS_OPTIONS,
  buildShipmentTimeline,
  createTrackingSummary,
  formatShipmentStatus,
  getShipmentStatusMeta,
  isWaitingStatus,
} from "@/lib/shipment-utils";
import { StatusUpdateForm } from "./StatusUpdateForm";
import { QuickActions } from "./QuickActions";
import { BillingInfo } from "./BillingInfo";
import { TrackingEventForm } from "./TrackingEventForm";

export const dynamic = "force-dynamic";

export default async function AdminShipmentDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const shipment = await prisma.shipment.findUnique({
    where: { id: resolvedParams.id },
    include: {
      customer: {
        include: {
          user: true,
        },
      },
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
      logisticsCompany: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
      events: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shipment) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-10">
        <h2 className="text-xl font-semibold text-slate-800">Shipment not found</h2>
        <Link href="/admin/shipments" className="mt-6 text-sm font-semibold text-blue-600 hover:underline">
          Return to shipments
        </Link>
      </div>
    );
  }

  const timeline = buildShipmentTimeline(shipment.statusHistory, shipment.events);
  const statusMeta = getShipmentStatusMeta(shipment.status);

  return (
    <div className="mx-auto min-h-full max-w-[1440px] p-6 lg:p-8">
      <RefreshHandler interval={30000} />

      <div className="mb-8 space-y-5">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Link
            href="/admin/shipments"
            className="app-button-secondary flex h-10 w-10 items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span>Shipment Detail</span>
        </div>

        <div className="app-card p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  {shipment.trackingId}
                </h1>
                <StatusBadge status={shipment.status} />
              </div>
              <p className="text-sm text-slate-500">
                {statusMeta.summary} Created on {format(new Date(shipment.createdAt), "PPP p")}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
              <div className="app-card-subtle px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">AWB</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{shipment.awb || "Not assigned"}</p>
              </div>
              <div className="app-card-subtle px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Reference</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.referenceNo || "Not assigned"}
                </p>
              </div>
              <div className="app-card-subtle px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Destination Country
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {shipment.country?.name || shipment.receiverAddress?.country?.name || "Not assigned"}
                </p>
              </div>
              <div className="app-card-subtle px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Payment</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{shipment.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <section className="app-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <UserRound className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-slate-900">Client Details</h2>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Customer</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {shipment.customer.companyName || shipment.customer.user?.name || "Private customer"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Email</p>
                  <p className="mt-1 text-slate-700">{shipment.customer.user?.email || "Not available"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Phone</p>
                  <p className="mt-1 text-slate-700">
                    {shipment.customer.phone || shipment.receiverPhone || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            <section className="app-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Package2 className="h-5 w-5" />
                </div>
                <h2 className="font-semibold text-slate-900">Shipment Payload</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">PCS</p>
                  <p className="mt-1 font-medium text-slate-900">{shipment.pcs ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Weight</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {shipment.weight ? `${shipment.weight} KG` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Declared Value</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {shipment.amount != null ? `$${shipment.amount}` : "-"}
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
          </div>

          <section className="app-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Route className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Route & Delivery</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="app-card-subtle p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pickup</p>
                <p className="font-medium text-slate-900">
                  {shipment.pickupAddress?.name || shipment.customer.user?.name || "Sender"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {shipment.pickupAddress?.street1 || "No pickup address"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {shipment.pickupAddress?.city || "-"},{" "}
                  {shipment.pickupAddress?.country?.name || shipment.route?.originCountry?.name || "-"}
                </p>
              </div>

              <div className="app-card-subtle p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Destination</p>
                <p className="font-medium text-slate-900">
                  {shipment.receiverName || shipment.receiverAddress?.name || "Receiver"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {shipment.receiverAddress?.street1 || "No destination address"}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {shipment.receiverAddress?.city || "-"},{" "}
                  {shipment.receiverAddress?.country?.name || shipment.country?.name || "-"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {shipment.receiverPhone || shipment.receiverAddress?.phone || "No phone"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="app-card-subtle px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Active Lane</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.route
                    ? `${shipment.route.originCountry.code} -> ${shipment.route.destinationCountry.code}`
                    : "No route assigned"}
                </p>
              </div>
              <div className="app-card-subtle px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Service Level</p>
                <p className="mt-1 font-medium text-slate-900">{shipment.route?.serviceLevel || "Standard"}</p>
              </div>
              <div className="app-card-subtle px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Collection Type</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.collectionType === "WAREHOUSE_DROP" ? "Warehouse Drop" : "Pickup"}
                </p>
              </div>
              <div className="app-card-subtle px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Transit Days</p>
                <p className="mt-1 font-medium text-slate-900">
                  {shipment.route?.transitDays ? `${shipment.route.transitDays} days` : "-"}
                </p>
              </div>
            </div>

            {shipment.warehouse ? (
              <div className="app-card-subtle mt-6 p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Warehouse Drop</p>
                <p className="font-medium text-slate-900">
                  {shipment.warehouse.name} ({shipment.warehouse.code})
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {shipment.warehouse.street1}, {shipment.warehouse.city}, {shipment.warehouse.country.name}
                </p>
              </div>
            ) : null}
          </section>

          <section className="app-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <ReceiptText className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-slate-900">Tracking Timeline</h2>
            </div>

            {timeline.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No tracking events recorded yet.
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
                          <p className="font-medium text-slate-900">
                            {entry.title || createTrackingSummary(entry.status)}
                          </p>
                          {entry.status ? (
                            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              {formatShipmentStatus(entry.status)}
                            </p>
                          ) : null}
                          {entry.note || entry.location ? (
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                              {entry.note ? <p>{entry.note}</p> : null}
                              {entry.location ? (
                                <p className="flex items-center gap-2 font-medium text-slate-700">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  {entry.location}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          <CalendarDays className="h-4 w-4" />
                          {format(entry.createdAt, "dd MMM yyyy, h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {isWaitingStatus(shipment.status) ? <QuickActions shipmentId={shipment.id} /> : null}

          <StatusUpdateForm
            shipmentId={shipment.id}
            currentStatus={shipment.status}
            currentAwb={shipment.awb || ""}
            currentReferenceNo={shipment.referenceNo || ""}
            allStatuses={[...ALL_SHIPMENT_STATUS_OPTIONS]}
          />

          <TrackingEventForm shipmentId={shipment.id} allStatuses={[...ALL_SHIPMENT_STATUS_OPTIONS]} />

          <BillingInfo
            shipmentId={shipment.id}
            currentStatus={shipment.status}
            paymentStatus={shipment.paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}
