import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Search, ChevronLeft, Plus, LayoutList, Clock, PackageOpen, Truck, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function AdminShipments({ searchParams }: { searchParams: Promise<{ status?: string }> | { status?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <div>Unauthorized</div>;

  const resolvedSearchParams = await searchParams;
  const filterStatus = resolvedSearchParams.status || 'all';

  // Fetch data directly from the DB
  const filter: any = {};
  if (filterStatus !== 'all') {
    if (filterStatus === 'PENDING') filter.status = 'SUBMITTED';
    else if (filterStatus === 'ACTIVE') filter.status = { in: ['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] };
    else filter.status = filterStatus;
  }

  const shipments = await prisma.shipment.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      pickupAddress: true,
      receiverAddress: true,
    }
  });

  const counts: Record<string, number> = {
    all: await prisma.shipment.count(),
    PENDING: await prisma.shipment.count({ where: { status: 'SUBMITTED' } }),
    ACTIVE: await prisma.shipment.count({ 
      where: { 
        status: { in: ['ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } 
      } 
    }),
    DELIVERED: await prisma.shipment.count({ where: { status: 'DELIVERED' } }),
  };

  const tabs = [
    { label: "All Records", value: "all", count: counts.all, icon: LayoutList },
    { label: "Pending", value: "PENDING", count: counts.PENDING, icon: Clock },
    { label: "Active", value: "ACTIVE", count: counts.ACTIVE, icon: Truck },
    { label: "Delivered", value: "DELIVERED", count: counts.DELIVERED, icon: CheckCircle },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] min-h-screen font-sans">
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/dashboard" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Universal Shipment Ledger
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Monitor and manage all global logistics operations.
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-5 h-11 bg-[#1E1B4B] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md">
                <Plus className="w-4 h-4" /> Manual Entry
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mt-8 overflow-x-auto no-scrollbar gap-10">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/shipments?status=${tab.value}`}
              className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative flex items-center gap-2.5 ${
                filterStatus === tab.value
                  ? "text-[#1E1B4B]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-black border transition-all",
                filterStatus === tab.value 
                  ? "bg-[#1E1B4B] text-white border-[#1E1B4B]" 
                  : "bg-slate-100 text-slate-400 border-slate-200"
              )}>
                {tab.count}
              </span>
              {filterStatus === tab.value && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#1E1B4B] rounded-t-full" />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="p-8 flex-1">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[600px] overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Tracking ID or Customer..."
                className="w-full text-sm font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/5 transition-all"
              />
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="pl-8 py-4 w-[20%]">Tracking / AWB</th>
                  <th className="px-6 py-4 w-[20%] text-center">Entity Node</th>
                  <th className="px-6 py-4 w-[20%] text-center">Route Flow</th>
                  <th className="px-6 py-4 w-[20%] text-center">Status</th>
                  <th className="pr-8 py-4 text-right">Database Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic opacity-60">
                      No records found in this partition.
                    </td>
                  </tr>
                ) : (
                  shipments.map((ship) => (
                    <tr key={ship.id} className="group hover:bg-slate-50 transition-colors cursor-default">
                      <td className="pl-8 py-6">
                        <div className="font-extrabold text-[#1E1B4B] group-hover:text-blue-700 transition-colors uppercase tracking-tight">{ship.trackingId}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{ship.awb || "Wait AWB"}</div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="font-bold text-slate-800 text-sm">{ship.customer?.companyName || "Private"}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-1">{ship.customer?.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center gap-2 font-bold text-slate-700 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {ship.pickupAddress?.city || '-'} 
                          <span className="text-slate-300">→</span>
                          {ship.receiverAddress?.city || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider border
                          ${ship.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          ${ship.status === 'DELIVERED' ? 'bg-teal-50 text-teal-700 border-teal-200' : ''}
                          ${ship.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                          ${!['REJECTED', 'DELIVERED', 'SUBMITTED'].includes(ship.status) ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                        `}>
                          {ship.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="pr-8 py-6 text-right">
                        <Link 
                          href={`/admin/shipments/${ship.id}`} 
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-[#1E1B4B] hover:text-white hover:border-[#1E1B4B] transition-all shadow-sm"
                        >
                          OPEN BRIDGE
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
