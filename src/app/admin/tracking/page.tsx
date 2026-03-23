import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, MapPin, ChevronLeft, ArrowRight, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminTracking() {
  const recentShipments = await prisma.shipment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 12,
    include: {
      customer: true,
      pickupAddress: true,
      receiverAddress: true,
    }
  });

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/dashboard" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Shipment Tracking
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Locate any shipment in the global network by Tracking ID or AWB.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12">
        {/* Search Hero */}
        <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-sm text-center">
           <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rapid Lookup</h2>
                 <p className="text-sm font-medium text-slate-400">Enter a Tracking ID to retrieve complete lifecycle data.</p>
              </div>
              <div className="relative group max-w-xl mx-auto">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   placeholder="Enter Tracking ID (e.g. TRK-X902)..."
                   className="w-full h-16 pl-12 pr-40 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-400/5 focus:border-blue-300 transition-all"
                 />
                 <button className="absolute right-2 top-2 h-12 px-8 bg-[#1E1B4B] text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-all">
                    Track Now
                 </button>
              </div>
           </div>
        </div>

        {/* Recent Updates */}
        <div className="space-y-6">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Recent Activity</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {recentShipments.map((ship) => (
                <div key={ship.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col justify-between h-[260px]">
                   <div className="flex items-center justify-between mb-6">
                      <div className="font-bold text-slate-800 text-base uppercase group-hover:text-blue-700 transition-colors tracking-tight">{ship.trackingId}</div>
                      <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase rounded border border-slate-100">{ship.status.replace(/_/g, ' ')}</span>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                            <Activity className="w-4 h-4" />
                         </div>
                         <div className="flex-1 truncate">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Last Update</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{ship.pickupAddress?.city || 'HUB-A'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                            <MapPin className="w-4 h-4" />
                         </div>
                         <div className="flex-1 truncate">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{ship.receiverAddress?.city || 'HUB-B'}</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-[10px] font-bold text-slate-300 uppercase truncate max-w-[120px]">
                         {ship.customer?.companyName || 'Private Client'}
                      </div>
                      <Link href={`/admin/shipments/${ship.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                         <ArrowRight className="w-4 h-4" />
                      </Link>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
