import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Prisma } from "@prisma/client";
import { AdminShipmentsFilters } from "./AdminShipmentsFilters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

function buildStatusWhere(status: string): Prisma.ShipmentWhereInput | undefined {
  if (!status || status === "all") return undefined;

  if (status === "waiting") {
    return { status: { in: ["CREATED", "WAITING", "SUBMITTED", "ON_HOLD"] } as any };
  }

  if (status === "in_transit") {
    return {
      status: {
        in: [
          "ACCEPTED",
          "PICKUP_SCHEDULED",
          "PICKED_UP",
          "AT_WAREHOUSE",
          "PROCESSING",
          "IN_TRANSIT",
          "OUT_FOR_DELIVERY",
        ],
      } as any,
    };
  }

  if (status === "delivered") {
    return { status: { in: ["DELIVERED"] } as any };
  }

  if (status === "closed") {
    return { status: { in: ["DELIVERED", "CANCELLED", "REJECTED"] } as any };
  }

  return { status: status.toUpperCase() as any };
}

export default async function AdminShipments({
  searchParams,
}: {
  searchParams:
    | Promise<{
        status?: string;
        country?: string;
        from?: string;
        to?: string;
        q?: string;
        page?: string;
      }>
    | {
        status?: string;
        country?: string;
        from?: string;
        to?: string;
        q?: string;
        page?: string;
      };
}) {
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams.status || "all";
  const country = resolvedSearchParams.country || "";
  const query = resolvedSearchParams.q?.trim() || "";
  const from = resolvedSearchParams.from || "";
  const to = resolvedSearchParams.to || "";
  const page = Math.max(Number(resolvedSearchParams.page || "1"), 1);

  const where: Prisma.ShipmentWhereInput = {
    ...(buildStatusWhere(status) ?? {}),
    ...(country ? { countryId: country } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
            ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
          },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { trackingId: { contains: query, mode: "insensitive" } },
            { awb: { contains: query, mode: "insensitive" } },
            { referenceNo: { contains: query, mode: "insensitive" } },
            { receiverName: { contains: query, mode: "insensitive" } },
            { country: { name: { contains: query, mode: "insensitive" } } },
            { country: { code: { contains: query, mode: "insensitive" } } },
            { customer: { companyName: { contains: query, mode: "insensitive" } } },
            { customer: { user: { name: { contains: query, mode: "insensitive" } } } },
            { customer: { user: { email: { contains: query, mode: "insensitive" } } } },
            { pickupAddress: { city: { contains: query, mode: "insensitive" } } },
            { receiverAddress: { city: { contains: query, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [countries, totalCount, shipments, waitingCount, inTransitCount, deliveredCount] =
    await Promise.all([
      prisma.country.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, code: true },
      }),
      prisma.shipment.count({ where }),
      prisma.shipment.findMany({
        where,
        include: {
          customer: {
            include: {
              user: true,
            },
          },
          country: true,
        },
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      }),
      prisma.shipment.count({
        where: {
          status: { in: ["CREATED", "WAITING", "SUBMITTED", "ON_HOLD"] } as any,
        },
      }),
      prisma.shipment.count({
        where: {
          status: {
            in: [
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
          status: "DELIVERED",
        },
      }),
    ]);

  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);

  function buildPageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (country) params.set("country", country);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (query) params.set("q", query);
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/admin/shipments?${params.toString()}`;
  }

  const stats = [
    { label: "Total Shipments", value: totalCount, href: buildPageHref(1) },
    { label: "Waiting", value: waitingCount, href: `/admin/shipments?status=waiting` },
    { label: "In Transit", value: inTransitCount, href: `/admin/shipments?status=in_transit` },
    { label: "Delivered", value: deliveredCount, href: `/admin/shipments?status=delivered` },
  ];

  return (
    <div className="mx-auto flex min-h-full max-w-[1600px] flex-col p-6 lg:p-8">
      <RefreshHandler interval={45000} />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="app-button-secondary flex h-10 w-10 items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                Shipment Operations
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Search and manage shipments by status, country, client, and date.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="app-card px-5 py-5 transition-colors hover:border-blue-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="app-card overflow-hidden">
        <AdminShipmentsFilters
          countries={countries}
          initialStatus={status}
          initialCountry={country}
          initialFrom={from}
          initialTo={to}
          initialQuery={query}
        />

        <div className="overflow-x-auto">
          <table className="app-table w-full min-w-[1100px]">
            <thead className="border-b border-slate-200/70">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-4">AWB / Tracking</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Country</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-sm text-slate-400">
                    No shipments match the current filters.
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-900">{shipment.awb || "Pending AWB"}</div>
                      <div className="mt-1 text-sm text-slate-500">{shipment.trackingId}</div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {shipment.referenceNo || "Not assigned"}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-slate-900">
                        {shipment.customer.companyName || shipment.customer.user?.name || "Private customer"}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {shipment.customer.user?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {shipment.country?.name || "Not assigned"}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">
                      {format(new Date(shipment.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/admin/shipments/${shipment.id}`}
                        className="app-button-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200/80 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}. Waiting: <span className="font-semibold text-slate-900">{waitingCount}</span>, in transit:{" "}
            <span className="font-semibold text-slate-900">{inTransitCount}</span>, delivered:{" "}
            <span className="font-semibold text-slate-900">{deliveredCount}</span>.
          </p>

          <div className="flex items-center gap-2">
            <Link
              href={buildPageHref(Math.max(page - 1, 1))}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors ${
                page === 1
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link
              href={buildPageHref(Math.min(page + 1, totalPages))}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-colors ${
                page >= totalPages
                  ? "pointer-events-none border-slate-100 text-slate-300"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
