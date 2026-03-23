"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Upload, Search, SlidersHorizontal, CloudDownload } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const tabs = [
  { id: "all", label: "All Orders" },
  { id: "submitted", label: "Pending Review" },
  { id: "accepted", label: "Accepted" },
  { id: "packed", label: "Packed" }, 
  { id: "in_transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
  { id: "rejected", label: "Rejected" },
  { id: "on_hold", label: "On Hold" },
];

function ShipmentsContent({ shipments }: { shipments: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "all";

  const setActiveTab = (tab: string) => {
    router.push(`/customer/shipments?tab=${tab}`);
  };

  const filteredShipments = shipments.filter(ship => {
    if (activeTab === "all") return true;
    if (activeTab === "submitted") return ship.status === "SUBMITTED";
    if (activeTab === "accepted") return ["ACCEPTED", "PICKUP_SCHEDULED"].includes(ship.status);
    if (activeTab === "packed") return ship.status === "PICKUP_SCHEDULED";
    if (activeTab === "in_transit") return ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(ship.status);
    if (activeTab === "delivered") return ship.status === "DELIVERED";
    if (activeTab === "rejected") return ship.status === "REJECTED";
    if (activeTab === "on_hold") return ship.status === "ON_HOLD";
    return false;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-h-screen">
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/customer/dashboard" className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center hover:bg-blue-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Tracking &amp; Orders
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Monitor your active logistics pipeline.
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/customer/shipments/new">
              <button className="px-4 py-2 bg-[#1E3A8A] text-white rounded-md text-sm font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors">
                <Plus className="w-4 h-4" /> Create Shipment
              </button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-6 overflow-x-auto no-scrollbar gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#1E293B] font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1E293B] rounded-t-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
          {/* Toolbar */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Find Tracking Id..."
                  className="w-full text-sm pl-9 pr-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Table Headers */}
          <div className="bg-[#f8f9fa] border-b border-slate-100 flex items-center px-4 py-3 text-xs font-bold text-slate-500 tracking-wider uppercase">
             <div className="w-[15%]">Tracking ID / AWB</div>
             <div className="w-[15%] text-center">Date</div>
             <div className="w-[15%] text-center">Package details</div>
             <div className="w-[20%] text-center">Delivery To</div>
             <div className="w-[15%] flex justify-center">Live Status</div>
             <div className="flex-1 text-center">Payment</div>
          </div>

          {/* Table Body / Records */}
          <div className="flex-1 overflow-y-auto min-h-[400px]">
            {filteredShipments.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 opacity-50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-bold">No Records Found</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Try selecting a different filter tab or searching.</p>
              </div>
            ) : (
              filteredShipments.map((ship) => (
                <Link key={ship.id} href={`/customer/track?id=${ship.trackingId}`} className="border-b border-slate-50 flex items-center px-4 py-5 text-sm hover:bg-slate-50 transition-colors group cursor-pointer block">
                   <div className="w-[15%]">
                      <div className="font-black text-[#1E1B4B] group-hover:text-blue-700">{ship.trackingId}</div>
                      {ship.awb && <div className="text-[10px] font-bold text-slate-400 mt-1">AWB: {ship.awb}</div>}
                   </div>
                   <div className="w-[15%] text-center font-bold text-slate-500" suppressHydrationWarning>
                      {new Date(ship.createdAt).toLocaleDateString("en-GB")}
                   </div>
                   <div className="w-[15%] text-center">
                      <div className="font-bold text-slate-700 truncate px-2">{ship.content || '-'}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-0.5">{ship.weight ? `${ship.weight} kg` : '-'}</div>
                   </div>
                   <div className="w-[20%] text-center font-medium text-slate-600">
                      {ship.receiverAddress?.city}, {ship.receiverAddress?.country?.name || 'India'}
                   </div>
                   <div className="w-[15%] flex justify-center">
                     <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider
                       ${ship.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                       ${ship.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                       ${ship.status === 'SUBMITTED' ? 'bg-slate-100 text-slate-600' : ''}
                       ${!['REJECTED', 'DELIVERED', 'SUBMITTED'].includes(ship.status) ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                     `}>
                       {ship.status.replace(/_/g, ' ')}
                     </span>
                   </div>
                   <div className="flex-1 text-center font-medium flex flex-col items-center justify-center gap-1">
                     {ship.paymentStatus === 'UNPAID' && <span className="text-[10px] bg-red-50 text-red-600 px-2 rounded-full font-bold">Unpaid: ${ship.amount}</span>}
                     {ship.paymentStatus === 'PAID' && <span className="text-[10px] bg-green-50 text-green-600 px-2 rounded-full font-bold">Paid</span>}
                   </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}export default function ClientShipmentsPage({ shipments }: { shipments: any[] }) {
  return (
    <Suspense fallback={
       <div className="flex h-screen w-full items-center justify-center bg-[#f8f9fa]">
          <div className="animate-pulse flex flex-col items-center">
             <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-slate-200 animate-spin mb-4"></div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Live Intel...</p>
          </div>
       </div>
    }>
      <ShipmentsContent shipments={shipments} />
    </Suspense>
  );
}
