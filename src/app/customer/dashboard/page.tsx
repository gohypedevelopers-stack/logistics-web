import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  FileText,
  Package2,
  Receipt,
  Truck,
} from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  TRANSIT_STATUS_QUERY_VALUES,
  WAITING_STATUS_QUERY_VALUES,
} from "@/lib/shipment-utils";
import {
  countActiveQuotations,
  getCustomerQuotationsByUserId,
  getQuotationStatusMeta,
} from "@/lib/quotation-utils";

export const dynamic = "force-dynamic";

type CustomerDashboardSearchParams =
  | Promise<{ order?: string | string[] }>
  | { order?: string | string[] };

export default async function CustomerDashboard({
  searchParams,
}: {
  searchParams?: CustomerDashboardSearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Access denied. Please sign in.</div>;
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
    },
  });

  const shipments = customer?.shipments || [];
  const [ongoingShipments, completedShipments, outstandingBills, activeQuotations, recentQuotationUpdates] = customer
    ? await Promise.all([
        prisma.shipment.count({
          where: {
            customerId: customer.id,
            status: {
              in: [...WAITING_STATUS_QUERY_VALUES, ...TRANSIT_STATUS_QUERY_VALUES],
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
        countActiveQuotations(customer.id),
        getCustomerQuotationsByUserId(session.user.id, 4),
      ])
    : [0, 0, 0, 0, []];

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
  const selectedOrderId = Array.isArray(resolvedSearchParams?.order)
    ? resolvedSearchParams?.order[0]
    : resolvedSearchParams?.order;
  const selectedShipment =
    shipments.find((shipment) => shipment.id === selectedOrderId) ?? null;

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

      <div className="grid gap-6">
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
                  <div
                    key={shipment.id}
                    className={`group relative overflow-hidden rounded-[5px] border bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-0 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)] ${
                      selectedShipment?.id === shipment.id
                        ? "border-blue-300 shadow-[0_18px_40px_rgba(37,99,235,0.08)]"
                        : "border-slate-200 hover:border-blue-200"
                    }`}
                  >
                    <Link
                      href={`/customer/shipments/${shipment.id}`}
                      aria-label={`View shipment ${shipment.trackingId}`}
                      className="absolute inset-0 z-0 rounded-[5px]"
                    />

                    <div className="relative z-10 flex h-full flex-col gap-4 border-l-4 border-blue-500 px-5 py-4 pointer-events-none">
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

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 transition-colors group-hover:text-blue-700">
                          View Details
                        </span>

                        <Link
                          href={`/customer/dashboard?order=${shipment.id}#order-details`}
                          className="app-button-secondary pointer-events-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold"
                          aria-label={`Show order details for ${shipment.trackingId}`}
                        >
                          <Eye className="h-4 w-4" />
                          Order Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </details>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
        <section className="app-card overflow-hidden p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Courier Loop
              </p>
              <h2 className="hidden">Whiteboard courier loop</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500">
                Short looping route visual for pickup to delivery movement.
              </p>
            </div>
            <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
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

        <section id="order-details" className="app-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-indigo-50 text-indigo-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Order Details</h2>
              <p className="text-sm text-slate-500">Select a shipment to view its order details here.</p>
            </div>
          </div>

          {selectedShipment ? (
            <div className="space-y-4">
              <div className="rounded-[5px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Selected Order
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                      {selectedShipment.trackingId}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Updated {formatDistanceToNow(new Date(selectedShipment.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={selectedShipment.status} />
                </div>
              </div>

              <div className="overflow-hidden rounded-[5px] border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-800">
                    Order Details
                  </p>
                </div>

                <div className="divide-y divide-slate-200">
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
                    <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">PCS</p>
                    <p className="font-medium text-slate-900">{selectedShipment.pcs ?? "-"}</p>
                  </div>
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
                    <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">Weight</p>
                    <p className="font-medium text-slate-900">
                      {selectedShipment.weight ? `${selectedShipment.weight} KG` : "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
                    <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">Description</p>
                    <p className="font-medium leading-6 text-slate-900">
                      {selectedShipment.content || "No description"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
                    <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">Value</p>
                    <p className="font-medium text-slate-900">
                      {selectedShipment.amount != null ? `$${selectedShipment.amount}` : "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm">
                    <p className="font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Pickup / Warehouse Drop
                    </p>
                    <p className="font-medium text-slate-900">
                      {selectedShipment.collectionType === "WAREHOUSE_DROP" ? "Warehouse Drop" : "Pickup"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              Select a shipment from Recent Shipments to view its order details here.
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 app-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-orange-50 text-orange-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Quotation Updates</h2>
            <p className="text-sm text-slate-500">
              Approved or rejected quotation updates appear here after review.
            </p>
          </div>
        </div>

        {recentQuotationUpdates.length === 0 ? (
          <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            No quotation requests have been submitted yet.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {recentQuotationUpdates.map((quotation) => {
              const statusMeta = getQuotationStatusMeta(quotation.status);

              return (
                <div
                  key={quotation.id}
                  className="rounded-[5px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fafcff_100%)] p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{quotation.quoteNumber}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {quotation.description || "No route details provided."}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusMeta.tone}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {statusMeta.summary}
                        </p>
                      </div>
                      <div className="rounded-[5px] border border-slate-200 bg-white px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Updated
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatDistanceToNow(new Date(quotation.updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
