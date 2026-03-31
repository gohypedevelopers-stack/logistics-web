import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
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
  const invoices = customer?.invoices || [];

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
  const shipmentCalendar = shipments
    .filter((shipment) => shipment.pickupDate)
    .sort((a, b) => new Date(a.pickupDate as Date).getTime() - new Date(b.pickupDate as Date).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto min-h-full max-w-[1500px] p-6 lg:p-8">
      <RefreshHandler />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="app-card p-6 transition-all hover:-translate-y-0.5 hover:border-blue-200"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-[5px] border ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="app-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Shipments</h2>
              <p className="mt-1 text-sm text-slate-500">Latest updates from your shipment activity.</p>
            </div>
            <Link href="/customer/shipments" className="text-sm font-semibold text-blue-600">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {shipments.length === 0 ? (
              <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No shipments yet. Create your first shipment to start tracking.
              </div>
            ) : (
              shipments.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/customer/shipments/${shipment.id}`}
                  className="block rounded-[5px] border border-slate-200 bg-slate-50/90 p-5 transition-colors hover:border-blue-200 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{shipment.trackingId}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {shipment.country?.name || "Destination pending"} ·{" "}
                        {formatDistanceToNow(new Date(shipment.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="space-y-8">
          <section className="app-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-blue-50 text-blue-600">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Shipment Calendar</h2>
                <p className="text-sm text-slate-500">Upcoming scheduled shipment dates from your live orders.</p>
              </div>
            </div>

            <div className="space-y-4">
              {shipmentCalendar.length === 0 ? (
                <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No scheduled shipment dates available yet.
                </div>
              ) : (
                shipmentCalendar.map((shipment) => (
                  <div key={shipment.id} className="app-card-subtle p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{shipment.trackingId}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {shipment.pickupAddress?.city || "Pickup"} to {shipment.receiverAddress?.city || "Destination"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(shipment.pickupDate as Date).toLocaleDateString("en-GB")}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Pickup
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="app-card p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Billing Snapshot</h2>

            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                  No invoices available.
                </div>
              ) : (
                invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="app-card-subtle p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                        <p className="mt-1 text-sm text-slate-500">${invoice.amount}</p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="app-card relative overflow-hidden p-8">
          <div className="absolute inset-0 opacity-70">
            <div className="courier-loop-track absolute left-8 right-8 top-1/2 -translate-y-1/2" />
            <div className="courier-loop-dot courier-loop-dot-a" />
            <div className="courier-loop-dot courier-loop-dot-b" />
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Courier Loop
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Live shipment lane preview
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-500">
              Animated shipment lane preview driven by your latest order details.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[5px] border border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Pickup</p>
                <p className="mt-2 font-medium text-slate-900">{featuredShipment?.pickupAddress?.city || "No pickup city"}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {featuredShipment?.pickupAddress?.street1 || "No shipment selected"}
                </p>
              </div>
              <div className="rounded-[5px] border border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Drop</p>
                <p className="mt-2 font-medium text-slate-900">{featuredShipment?.receiverAddress?.city || "No destination city"}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {featuredShipment?.receiverAddress?.street1 || "No shipment selected"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="app-card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-indigo-50 text-indigo-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
              <p className="text-sm text-slate-500">Latest shipment details from live database records.</p>
            </div>
          </div>

          {featuredShipment ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="app-card-subtle p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">PCS</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{featuredShipment.pcs ?? "-"}</p>
              </div>
              <div className="app-card-subtle p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Weight</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {featuredShipment.weight ? `${featuredShipment.weight} KG` : "-"}
                </p>
              </div>
              <div className="app-card-subtle p-4 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Description</p>
                <p className="mt-2 text-sm text-slate-700">{featuredShipment.content || "No description"}</p>
              </div>
              <div className="app-card-subtle p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Value</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  {featuredShipment.amount != null ? `$${featuredShipment.amount}` : "-"}
                </p>
              </div>
              <div className="app-card-subtle p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Pickup / Warehouse Drop
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
