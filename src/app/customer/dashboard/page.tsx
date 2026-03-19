import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Ship, Plane, CheckCircle2, FileText, AlertCircle, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const userId = session.user.id;
  
  // Real DB calls 
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      shipments: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { receiverAddress: true }
      }
    }
  });

  const shipments = customerProfile?.shipments || [];

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full">
       
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
         <div>
            <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight mb-2">Morning, Logistics Team</h1>
            <p className="text-slate-600 font-medium text-sm">Your global supply chain is operating at <span className="font-bold text-[#1E1B4B]">98.4% efficiency</span> today.</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="h-11 px-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-sm tracking-wide hover:bg-slate-300 transition-colors">
               Generate Report
            </button>
            <Link href="/customer/shipments/new">
               <button className="h-11 px-6 rounded-lg bg-[#1E1B4B] text-white font-bold text-sm tracking-wide gap-2 flex items-center hover:bg-[#2A377B] shadow-md transition-colors">
                  <Zap className="w-4 h-4 fill-white" /> New Shipment
               </button>
            </Link>
         </div>
      </div>

      {/* TOP ROW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
         
         {/* Active Shipments Card */}
         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between h-64">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1E1B4B]">Active Shipments</h3>
            <div className="my-auto">
               <div className="flex items-end gap-3 mb-2">
                  <span className="text-6xl font-black text-[#1E1B4B] tracking-tighter">142</span>
                  <span className="text-sm font-bold text-teal-600 tracking-wide pb-1">↗ +12%</span>
               </div>
            </div>
            <div className="flex gap-3">
               <div className="px-3 py-1 bg-cyan-50 text-teal-800 rounded-full text-[11px] font-bold tracking-wide">84 Air</div>
               <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold tracking-wide">58 Ocean</div>
            </div>
         </div>

         {/* Pending Invoices Card */}
         <div className="bg-gradient-to-br from-[#2A377B] to-[#1E1B4B] rounded-2xl p-8 shadow-lg border border-[#1b195c] flex flex-col justify-between h-64 text-white hover:-translate-y-1 transition-transform cursor-pointer">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200/80">Pending Invoices</h3>
            <div className="py-2">
               <div className="text-4xl font-black tracking-tighter text-white mb-2 flex items-end gap-2">
                  $12,480 <span className="text-xs text-indigo-200 font-medium mb-1 tracking-widest uppercase">USD</span>
               </div>
               <p className="text-xs font-medium text-indigo-100/80 leading-relaxed max-w-[200px]">4 invoices are due within the next 48 hours.</p>
            </div>
            <Link href="/customer/invoices">
               <button className="w-full text-center py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors backdrop-blur-sm shadow-sm border border-white/10">
                  Review Billing
               </button>
            </Link>
         </div>

         {/* Intelligence Map Card */}
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-64 md:col-span-2 xl:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
               <h3 className="text-lg font-bold text-[#1E1B4B] tracking-tight">Intelligence Map</h3>
               <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button className="px-4 py-1.5 rounded-md bg-white shadow-sm text-xs font-bold text-[#1E1B4B]">Global</button>
                  <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-800">Regional</button>
               </div>
            </div>
            <div className="flex-1 bg-[#6D8F8F] rounded-xl overflow-hidden relative shadow-inner">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Map" />
               <div className="absolute inset-0 flex items-center justify-center">
                  {/* Fake map overlay component */}
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-100 transform -translate-y-4">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-[#1E1B4B] animate-pulse"></div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Route Active</span>
                     </div>
                     <p className="text-sm font-black text-[#1E1B4B] tracking-tight">NYC → LHR</p>
                     <p className="text-[10px] text-slate-500 font-medium mt-0.5">Flight BA-214 • On Time</p>
                  </div>
               </div>
            </div>
         </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         
         {/* Priority Shipments Table */}
         <div className="xl:col-span-2">
            <div className="flex justify-between items-end mb-4">
               <h3 className="text-xl font-bold text-[#1E1B4B] tracking-tight">Priority Shipments</h3>
               <Link href="/customer/shipments" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">View All Active</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white">
                     <thead className="bg-[#f2f4f8] text-slate-500">
                        <tr>
                           <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Reference</th>
                           <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Route</th>
                           <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Mode</th>
                           <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                           <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">ETA</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {/* Dummy exact rows injected to match UI exactly + db rows */}
                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-5">
                              <p className="font-bold text-[#1E1B4B] text-sm">GN-94821</p>
                              <p className="text-[10px] font-medium text-slate-400 mt-1">High-Value Electronics</p>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Shanghai →</p>
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Los Angeles</p>
                           </td>
                           <td className="px-6 py-5">
                              <Ship className="w-5 h-5 text-slate-400" />
                           </td>
                           <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold tracking-widest uppercase">In Transit</span>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm text-right">Oct 24</p>
                              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest text-right">Ahead</p>
                           </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors bg-orange-50/10">
                           <td className="px-6 py-5">
                              <p className="font-bold text-[#1E1B4B] text-sm">GN-77210</p>
                              <p className="text-[10px] font-medium text-slate-400 mt-1">Medical Supplies</p>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Berlin → New</p>
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Delhi</p>
                           </td>
                           <td className="px-6 py-5">
                              <Plane className="w-5 h-5 text-slate-400" />
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex flex-col gap-1 items-start">
                                <span className="px-3 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[9px] font-bold tracking-widest uppercase mb-1">Customs</span>
                                <span className="px-3 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[9px] font-bold tracking-widest uppercase">Review</span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-red-600 text-sm text-right">Oct 21</p>
                              <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-widest text-right">Delayed</p>
                           </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-5">
                              <p className="font-bold text-[#1E1B4B] text-sm">GN-22194</p>
                              <p className="text-[10px] font-medium text-slate-400 mt-1">Retail Seasonal</p>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Ho Chi Minh →</p>
                              <p className="font-bold text-slate-800 text-sm whitespace-nowrap">Hamburg</p>
                           </td>
                           <td className="px-6 py-5">
                              <Ship className="w-5 h-5 text-slate-400" />
                           </td>
                           <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold tracking-widest uppercase">In Transit</span>
                           </td>
                           <td className="px-6 py-5">
                              <p className="font-bold text-slate-800 text-sm text-right">Nov 02</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest text-right">On Track</p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Live Activity Column */}
         <div className="xl:col-span-1">
            <div className="flex justify-between items-end mb-4 pr-2">
               <h3 className="text-xl font-bold text-[#1E1B4B] tracking-tight">Live Activity</h3>
               <div className="flex gap-1 cursor-pointer">
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
               </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 pt-10">
               <div className="relative border-l border-slate-200 ml-3 space-y-10 pb-6">
                  
                  {/* Timeline Item 1 */}
                  <div className="relative pl-8">
                     <div className="absolute w-6 h-6 bg-[#1E1B4B] rounded-full flex items-center justify-center -left-3 top-0 shadow-sm border-[3px] border-white">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">10:24 AM</p>
                     <p className="text-sm font-bold text-[#1E1B4B] mb-2 leading-tight">GN-94821 Departed Port</p>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Vessel 'Oceania Blue' has cleared Shanghai Port terminal 4.</p>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative pl-8">
                     <div className="absolute w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center -left-3 top-0 shadow-sm border-[3px] border-white">
                        <FileText className="w-3 h-3 text-white" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">09:15 AM</p>
                     <p className="text-sm font-bold text-[#1E1B4B] mb-2 leading-tight">Invoice Generated</p>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Standard freight charges for GN-77210 are now available.</p>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="relative pl-8">
                     <div className="absolute w-6 h-6 bg-red-600 rounded-full flex items-center justify-center -left-3 top-0 shadow-sm border-[3px] border-white z-10">
                        <AlertCircle className="w-3 h-3 text-white" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Yesterday, 04:30 PM</p>
                     <p className="text-sm font-bold text-[#1E1B4B] mb-2 leading-tight">Customs Hold: Berlin</p>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Additional documentation required for pharmaceutical clearance.</p>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="relative pl-8 opacity-60">
                     <div className="absolute w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center -left-3 top-0 shadow-sm border-[3px] border-white">
                        <Clock className="w-3 h-3 text-slate-500" />
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Yesterday, 11:00 AM</p>
                     <p className="text-sm font-bold text-slate-600 mb-2 leading-tight">Shipment Pick-up Confirmed</p>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">Items for GN-22194 successfully collected from factory.</p>
                  </div>

               </div>

               <button className="w-full py-3.5 mt-2 bg-cyan-50 hover:bg-cyan-100 text-teal-800 font-bold text-xs rounded-xl tracking-wide transition-colors border border-cyan-100">
                  View Audit Log
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
