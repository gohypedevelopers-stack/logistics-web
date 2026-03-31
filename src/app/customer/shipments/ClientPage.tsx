"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Search } from "lucide-react";
import { CUSTOMER_STATUS_TABS, matchCustomerShipmentTab } from "@/lib/shipment-utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

function ShipmentsContent({ shipments }: { shipments: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const activeTab = searchParams.get("tab") || "all";

  const filteredShipments = shipments
    .filter((shipment) => matchCustomerShipmentTab(shipment.status, activeTab))
    .filter((shipment) => {
      if (!query.trim()) return true;
      const value = query.toLowerCase();
      return [
        shipment.trackingId,
        shipment.awb,
        shipment.referenceNo,
        shipment.receiverName,
        shipment.country?.name,
        shipment.receiverAddress?.city,
      ]
        .filter(Boolean)
        .some((item: string) => item.toLowerCase().includes(value));
    });

  return (
    <div className="flex min-h-full flex-col">
      <div className="p-6 pb-0 lg:p-8 lg:pb-0">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/customer/dashboard" className="app-button-secondary flex h-10 w-10 items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Shipments</h1>
              <p className="mt-1 text-sm text-slate-500">
                View ongoing and completed shipments from one list.
              </p>
            </div>
          </div>

          <Link
            href="/customer/shipments/new"
            className="app-button-primary inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> Create Shipment
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {CUSTOMER_STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => router.push(`/customer/shipments?tab=${tab.id}`)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 lg:p-8 lg:pt-0">
        <div className="app-card overflow-hidden">
          <div className="border-b border-slate-200/80 p-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tracking ID, AWB, reference, destination"
                className="app-input w-full pl-11 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="app-table w-full min-w-[980px]">
              <thead className="border-b border-slate-200/70">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-6 py-4">Tracking</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-sm text-slate-400">
                      No shipments match the current view.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">{shipment.trackingId}</div>
                        <div className="mt-1 text-sm text-slate-500">{shipment.awb || "AWB pending"}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-700">
                        {shipment.referenceNo || "Not assigned"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-900">{shipment.receiverAddress?.city || "-"}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          {shipment.country?.name || shipment.receiverAddress?.country?.name || "Country pending"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-700">{shipment.content || "No description"}</div>
                        <div className="mt-1 text-sm text-slate-500">
                          {shipment.pcs ?? "-"} pcs · {shipment.weight ?? "-"} kg
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/customer/shipments/${shipment.id}`}
                          className="app-button-secondary inline-flex items-center px-4 py-2 text-xs font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientShipmentsPage({ shipments }: { shipments: any[] }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex animate-pulse flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Loading shipments
            </p>
          </div>
        </div>
      }
    >
      <ShipmentsContent shipments={shipments} />
    </Suspense>
  );
}
