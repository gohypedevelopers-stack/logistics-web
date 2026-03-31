import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  PackageSearch,
  ReceiptText,
  Truck,
} from "lucide-react";
import { RefreshHandler } from "@/components/RefreshHandler";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalShipments,
    waitingShipments,
    transitShipments,
    deliveredShipments,
    activeQuoteRequests,
    supportedCountries,
    activeRoutes,
    recentActivity,
    topCountryGroup,
  ] = await Promise.all([
    prisma.shipment.count(),
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
    prisma.shipment.count({ where: { status: "DELIVERED" } }),
    prisma.quotation.count({
      where: {
        status: {
          in: ["DRAFT", "SENT"],
        },
      },
    }),
    prisma.country.count({ where: { isActive: true } }),
    prisma.route.count({ where: { isActive: true } }),
    prisma.shipmentEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        shipment: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    }),
    prisma.shipment.groupBy({
      by: ["countryId"],
      where: {
        countryId: {
          not: null,
        },
      },
      _count: {
        countryId: true,
      },
      orderBy: {
        _count: {
          countryId: "desc",
        },
      },
      take: 1,
    }),
  ]);

  const topCountryId = topCountryGroup[0]?.countryId;
  const topCountry = topCountryId
    ? await prisma.country.findUnique({
        where: { id: topCountryId },
        select: { name: true, code: true },
      })
    : null;

  const stats = [
    {
      label: "Total Shipments",
      value: totalShipments,
      href: "/admin/shipments",
      icon: PackageSearch,
      tone: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      label: "Waiting Shipments",
      value: waitingShipments,
      href: "/admin/shipments?status=waiting",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      label: "In Transit",
      value: transitShipments,
      href: "/admin/shipments?status=in_transit",
      icon: Truck,
      tone: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      label: "Delivered",
      value: deliveredShipments,
      href: "/admin/shipments?status=delivered",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      label: "Request a Quote",
      value: activeQuoteRequests,
      href: "/customer/rates",
      icon: ReceiptText,
      tone: "bg-orange-50 text-orange-700 border-orange-100",
    },
  ];

  return (
    <div className="mx-auto min-h-full max-w-[1600px] p-6 lg:p-8">
      <RefreshHandler />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Logistics Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            One operational view across shipments, live activity, countries, and routes.
          </p>
        </div>

        <Link
          href="/admin/rates"
          className="app-button-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
        >
          Manage Countries & Routes <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="app-card p-6 transition-all hover:-translate-y-0.5 hover:border-blue-200"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-[5px] border ${stat.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="app-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Shipment Activity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest tracking updates added by operations.
              </p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="rounded-[5px] border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                No shipment activity yet.
              </div>
            ) : (
              recentActivity.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/shipments/${event.shipmentId}`}
                  className="block rounded-[5px] border border-slate-200 bg-slate-50/90 p-5 transition-colors hover:border-blue-200 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-slate-900">{event.title}</p>
                        {event.status ? <StatusBadge status={event.status} /> : null}
                      </div>
                      <p className="text-sm text-slate-600">{event.note || "Tracking update added."}</p>
                      <p className="text-sm text-slate-500">
                        {event.shipment.customer.companyName ||
                          event.shipment.customer.user?.name ||
                          "Private customer"}{" "}
                        · {event.shipment.trackingId}
                      </p>
                      {event.location ? (
                        <p className="text-sm font-medium text-slate-600">{event.location}</p>
                      ) : null}
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="space-y-8">
          <section className="app-card p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[5px] border border-emerald-100 bg-emerald-50">
                <Globe2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Network Coverage</h3>
                <p className="text-sm text-slate-500">Active countries and shipment lanes.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="app-card-subtle p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Supported Countries
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {supportedCountries}
                </p>
              </div>
              <div className="app-card-subtle p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Active Routes
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {activeRoutes}
                </p>
              </div>
              <div className="app-card-subtle p-5 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Maximum Country
                </p>
                <p className="mt-3 text-xl font-semibold text-slate-900">
                  {topCountry ? `${topCountry.name} (${topCountry.code})` : "No shipment country data"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {topCountryGroup[0]?._count.countryId ?? 0} shipments currently point to this
                  country.
                </p>
              </div>
            </div>
          </section>

          <section className="app-card p-8">
            <h3 className="mb-4 font-semibold text-slate-900">Operational Priorities</h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p>Waiting shipments move into the review queue as soon as customers create them.</p>
              <p>Tracking updates feed both admin detail and customer tracking without duplicate data.</p>
              <p>Country and route changes affect supported shipment lanes immediately after save.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
