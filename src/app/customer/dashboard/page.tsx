import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  FileText,
  MapPin,
  Package2,
  Receipt,
  Truck,
} from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      shipments: {
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          country: true,
          pickupAddress: true,
          receiverAddress: true,
        },
      },
      invoices: true,
      quotations: true,
    },
  });

  const shipments = customer?.shipments || [];
  const [ongoingShipments, completedShipments, outstandingBills, activeQuotations] = customer
    ? await Promise.all([
        prisma.shipment.count({
          where: {
            customerId: customer.id,
            status: {
              in: [
                "CREATED",
                "WAITING",
                "SUBMITTED",
                "ON_HOLD",
                "ACCEPTED",
                "PICKUP_SCHEDULED",
                "PICKED_UP",
                "AT_WAREHOUSE",
                "PROCESSING",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
              ],
            } as any,
          },
        }),
        prisma.shipment.count({
          where: {
            customerId: customer.id,
            status: "DELIVERED",
          },
        }),
        prisma.invoice.count({
          where: {
            customerId: customer.id,
            status: {
              in: ["UNPAID", "PARTIAL", "OVERDUE"],
            },
          },
        }),
        prisma.quotation.count({
          where: {
            customerId: customer.id,
            status: {
              in: ["DRAFT", "SENT"],
            },
          },
        }),
      ])
    : [0, 0, 0, 0];

  const cards = [
    {
      label: "Active Quotations",
      value: activeQuotations,
      href: "/customer/rates",
      icon: FileText,
      tone: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      label: "Ongoing Shipments",
      value: ongoingShipments,
      href: "/customer/shipments?tab=ongoing",
      icon: Truck,
      tone: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Completed Shipments",
      value: completedShipments,
      href: "/customer/shipments?tab=completed",
      icon: Package2,
      tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      label: "Outstanding Bills",
      value: outstandingBills,
      href: "/customer/shipments",
      icon: Receipt,
      tone: "bg-orange-50 text-orange-700 border-orange-100",
    },
  ];

  const featuredShipment = shipments[0] ?? null;
  const recentShipments = shipments.slice(0, 3);
  const shipmentCalendar = shipments
    .filter((shipment) => shipment.pickupDate)
    .sort((a, b) => new Date(a.pickupDate as Date).getTime() - new Date(b.pickupDate as Date).getTime())
    .slice(0, 3);
  const shipmentsWithoutSchedule = shipments.filter((shipment) => !shipment.pickupDate).length;

  return (
    <div className="mx-auto min-h-full max-w-[1460px] p-5 lg:p-6">
      <RefreshHandler />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Customer Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your live view of shipments, tracking progress, quotations, and billing.
          </p>
        </div>

        <Link
          href="/customer/shipments/new"
          className="app-button-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
        >
          Create Shipment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="app-card flex min-h-[168px] flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-[5px] border ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-[2.1rem] font-semibold tracking-tight text-slate-900">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <details className="app-card group h-full overflow-hidden lg:min-h-[236px]">
          <summary className="flex min-h-[236px] cursor-pointer list-none items-start justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-blue-50 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">Recent Shipments</h2>
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                      {recentShipments.length} recent
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Open to view the latest shipment activity.</p>
                </div>
              </div>

              {recentShipments[0] ? (
                <div className="mt-4 rounded-[5px] border border-slate-200 bg-slate-50/90 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold tracking-tight text-slate-900">{recentShipments[0].trackingId}</p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {recentShipments[0].pickupAddress?.city || "Pickup"} to{" "}
                        {recentShipments[0].receiverAddress?.city || "Destination"}
                      </p>
                    </div>
                    <StatusBadge status={recentShipments[0].status} />
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[5px] border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">
                  No shipments yet. Create your first shipment to start tracking.
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-transform duration-200 group-open:rotate-180">
                <ChevronDown className="h-5 w-5" />
              </span>
            </div>
          </summary>

          <div className="border-t border-slate-200 px-6 pb-6 pt-4">
            <div className="mb-4 flex justify-end">
              <Link href="/customer/shipments" className="text-sm font-semibold text-blue-600">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {shipments.length === 0 ? (
                <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No shipments yet. Create your first shipment to start tracking.
                </div>
              ) : (
                recentShipments.map((shipment) => (
                  <Link
                    key={shipment.id}
                    href={`/customer/shipments/${shipment.id}`}
                    className="group block overflow-hidden rounded-[5px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-0 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)]"
                  >
                    <div className="flex h-full flex-col gap-4 border-l-4 border-blue-500 px-5 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                              <Truck className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold tracking-tight text-slate-900">{shipment.trackingId}</p>
                              <p className="mt-1 text-sm text-slate-500">
                                {shipment.country?.name || "Destination pending"}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={shipment.status} />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-[5px] border border-slate-200 bg-white/90 px-3 py-3 text-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Last Update
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {formatDistanceToNow(new Date(shipment.updatedAt), { addSuffix: true })}
                            </p>
                          </div>
                          <div className="rounded-[5px] border border-slate-200 bg-white/90 px-3 py-3 text-sm">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Route
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {shipment.pickupAddress?.city || "Pickup"} to {shipment.receiverAddress?.city || "Destination"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 transition-colors group-hover:text-blue-700">
                        View Details
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </details>

        <section className="app-card flex h-full min-h-[236px] flex-col p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-blue-50 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">Shipment Calendar</h2>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                    {shipmentCalendar.length} upcoming
                  </span>
                </div>
                <p className="text-sm text-slate-500">Pickup dates scheduled from your shipment requests.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {shipmentCalendar.length === 0 ? (
              <div className="border-t border-dashed border-slate-200 pt-4">
                <p className="text-sm font-semibold text-slate-900">No pickup dates scheduled yet.</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Upcoming scheduled shipments will appear here automatically.{" "}
                  {shipmentsWithoutSchedule > 0
                    ? `${shipmentsWithoutSchedule} recent shipment requests are still waiting for a schedule.`
                    : "Once scheduled, dates will appear here."}
                </p>
              </div>
            ) : (
              shipmentCalendar.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/customer/shipments/${shipment.id}`}
                  className="block rounded-[5px] border border-slate-200 bg-slate-50/85 p-4 transition-colors hover:border-blue-200 hover:bg-white"
                >
                  <div className="flex gap-4">
                    <div className="flex min-w-[76px] shrink-0 flex-col items-center justify-center rounded-[5px] border border-blue-100 bg-white px-3 py-3 text-center shadow-sm">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                        {format(new Date(shipment.pickupDate as Date), "MMM")}
                      </p>
                      <p className="mt-1 text-2xl font-semibold leading-none text-slate-900">
                        {format(new Date(shipment.pickupDate as Date), "dd")}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                        {format(new Date(shipment.pickupDate as Date), "EEE")}
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{shipment.trackingId}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {shipment.pickupAddress?.city || "Pickup"} to {shipment.receiverAddress?.city || "Destination"}
                          </p>
                        </div>
                        <StatusBadge status={shipment.status} />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[5px] border border-slate-200 bg-white px-3 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Scheduled Date
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {format(new Date(shipment.pickupDate as Date), "dd MMM yyyy")}
                          </p>
                        </div>
                        <div className="rounded-[5px] border border-slate-200 bg-white px-3 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Collection Mode
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {shipment.warehouseId ? "Warehouse drop" : "Pickup"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
        <section className="app-card overflow-hidden p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Courier Loop
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                Whiteboard courier loop
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Short looping route visual for pickup to delivery movement.
              </p>
            </div>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
              Loop Video
            </span>
          </div>

          <div className="overflow-hidden rounded-[5px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]">
            <object
              data="/courier-loop-whiteboard.svg"
              type="image/svg+xml"
              aria-label="Courier loop whiteboard animation"
              className="block h-auto w-full"
            >
              <img
                src="/courier-loop-whiteboard.svg"
                alt="Courier loop whiteboard animation"
                className="h-auto w-full"
              />
            </object>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[5px] border border-slate-200 bg-slate-50/90 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pickup</p>
              <p className="mt-2 font-medium text-slate-900">{featuredShipment?.pickupAddress?.city || "No pickup city"}</p>
              <p className="mt-1 text-sm text-slate-500">
                {featuredShipment?.pickupAddress?.street1 || "No shipment selected"}
              </p>
            </div>
            <div className="rounded-[5px] border border-slate-200 bg-slate-50/90 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Drop</p>
              <p className="mt-2 font-medium text-slate-900">{featuredShipment?.receiverAddress?.city || "No destination city"}</p>
              <p className="mt-1 text-sm text-slate-500">
                {featuredShipment?.receiverAddress?.street1 || "No shipment selected"}
              </p>
            </div>
          </div>
        </section>

        <section className="app-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-indigo-50 text-indigo-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
              <p className="text-sm text-slate-500">Latest shipment details from live database records.</p>
            </div>
          </div>

          {featuredShipment ? (
            <div className="space-y-4">
              <div className="rounded-[5px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Active Order
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                      {featuredShipment.trackingId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Updated {formatDistanceToNow(new Date(featuredShipment.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={featuredShipment.status} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">PCS</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{featuredShipment.pcs ?? "-"}</p>
                </div>
                <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Weight</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {featuredShipment.weight ? `${featuredShipment.weight} KG` : "-"}
                  </p>
                </div>
                <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Value</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {featuredShipment.amount != null ? `$${featuredShipment.amount}` : "-"}
                  </p>
                </div>
                <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Collection
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {featuredShipment.warehouseId ? "Warehouse Drop" : "Pickup"}
                  </p>
                </div>
              </div>

              <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Description</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{featuredShipment.content || "No description"}</p>
              </div>

              <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Pickup / Destination
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-700">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>
                    {featuredShipment.pickupAddress?.city || "Pickup"} to{" "}
                    {featuredShipment.receiverAddress?.city || "Drop"}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No shipment details available yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
