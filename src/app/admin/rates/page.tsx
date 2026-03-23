import prisma from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Search, Plus, DollarSign, ChevronLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminRates() {
  const rates = await prisma.shipment.findMany({
    include: {
      logisticsCompany: true,
      route: {
        include: {
          originCountry: true,
          destinationCountry: true,
        }
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 12
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
              Shipping Rates & Tariffs
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Configure global shipping prices and active route master data.
            </div>
          </div>
          <button className="px-5 h-11 bg-[#1E1B4B] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md">
            <Plus className="w-4 h-4" /> New Tariff
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Search / Filter Utility */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Search by company or route..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
           </div>
        </div>

        {/* Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
           {rates.map((rate) => (
             <div key={rate.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between h-[240px]">
                <div className="flex items-center justify-between mb-6">
                   <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Active</span>
                </div>

                <div>
                   <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{rate.logisticsCompany?.name || 'Standard Tier'}</h4>
                   
                   <div className="flex items-center gap-2 mt-4 text-xs font-bold text-slate-500">
                      <div className="bg-slate-100 px-2 py-1 rounded">{rate.route?.originCountry?.code || '??'}</div>
                      <div className="text-slate-200">→</div>
                      <div className="bg-slate-100 px-2 py-1 rounded">{rate.route?.destinationCountry?.code || '??'}</div>
                   </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Rate</p>
                      <p className="text-2xl font-black text-[#1E1B4B] tracking-tight mt-0.5">${rate.amount || 0}</p>
                   </div>
                   <button className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors">Edit</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
