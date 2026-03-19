import prisma from "@/lib/prisma";
import Link from "next/link";
import { Truck, DollarSign, Users, AlertCircle, Calendar, MapPin, MessageSquare, Anchor, Package } from "lucide-react";

export default async function AdminDashboard() {
  // Mock DB values corresponding to the image.
  // In reality, these would be aggregated from Prisma
  const activeShipments = 14285;
  const customersCount = 892;

  return (
    <div className="p-8 lg:p-12 max-w-[1400px] mx-auto min-h-full pb-20">
       
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
         <div>
            <h1 className="text-[32px] font-black text-[#1E1B4B] tracking-tight mb-2">Intelligence Hub</h1>
            <p className="text-slate-600 font-medium text-[15px]">Operational overview for <span className="font-bold text-[#1E1B4B]">June 24, 2024</span></p>
         </div>
         <div className="flex items-center gap-4">
            <button className="h-10 px-5 rounded-xl bg-slate-200/50 text-slate-700 font-bold text-sm tracking-wide gap-2 flex items-center hover:bg-slate-200 transition-colors">
               <Calendar className="w-4 h-4" /> Last 30 Days
            </button>
            <div className="h-10 w-10 rounded-xl bg-orange-100 border border-orange-200 overflow-hidden cursor-pointer shadow-sm">
               {/* Dummy Avatar */}
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
         </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         
         <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
               <div className="w-10 h-10 bg-[#eff2ff] rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#2A377B]" />
               </div>
               <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold tracking-wide">+12.5%</div>
            </div>
            <div>
               <p className="text-[11px] font-medium text-slate-500 mb-1">Total Shipments</p>
               <h3 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">14,285</h3>
            </div>
         </div>

         <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
               <div className="w-10 h-10 bg-[#e0f7fa] rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#00838f]" />
               </div>
               <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold tracking-wide">+8.2%</div>
            </div>
            <div>
               <p className="text-[11px] font-medium text-slate-500 mb-1">Revenue (USD)</p>
               <h3 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">$4.2M</h3>
            </div>
         </div>

         <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
               <div className="w-10 h-10 bg-[#e8eaf6] rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#3949ab]" />
               </div>
               <div className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold tracking-wide">Stable</div>
            </div>
            <div>
               <p className="text-[11px] font-medium text-slate-500 mb-1">Active Customers</p>
               <h3 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">892</h3>
            </div>
         </div>

         <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(255,0,0,0.06)] border border-slate-100 flex flex-col justify-between h-40 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
            <div className="flex items-start justify-between">
               <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
               </div>
               <div className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold tracking-wide">High</div>
            </div>
            <div>
               <p className="text-[11px] font-medium text-slate-500 mb-1">Pending Clearances</p>
               <h3 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">24</h3>
            </div>
         </div>

      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
         
         {/* Chart Card */}
         <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-[20px] font-bold text-[#1E1B4B] tracking-tight">Volume & Revenue Trend</h3>
               <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100">
                  <button className="px-4 py-1.5 rounded-full bg-[#1E1B4B] text-xs font-bold text-white shadow-sm">Volume</button>
                  <button className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Revenue</button>
               </div>
            </div>

            <div className="flex-1 relative border-b border-t border-slate-100 flex items-end justify-between px-4 pb-4 pt-12">
               {/* Dummy bars using exact sizes and colors from the mock */}
               
               {/* MON */}
               <div className="w-10 h-[30%] bg-[#e6e8eff] bg-[#e2e4f0] rounded-sm"></div>
               {/* TUE */}
               <div className="w-10 h-[45%] bg-[#b3e0e6] rounded-sm relative"><div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-widest text-[#1E1B4B]"></div></div>
               {/* WED */}
               <div className="w-10 h-[40%] bg-[#e2e4f0] rounded-sm"></div>
               {/* THU */}
               <div className="w-10 h-[80%] bg-[#2A377B] rounded-sm"></div>
               {/* FRI */}
               <div className="w-10 h-[70%] bg-[#e2e4f0] rounded-sm"></div>
               {/* SAT */}
               <div className="w-10 h-[35%] bg-[#b3e0e6] rounded-sm"></div>
               {/* SUN */}
               <div className="w-10 h-[75%] bg-[#1E1B4B] rounded-sm"></div>
               {/* MON */}
               <div className="w-10 h-[45%] bg-[#e2e4f0] rounded-sm"></div>
               {/* TUE */}
               <div className="w-10 h-[85%] bg-[#b3e0e6] rounded-sm"></div>
               {/* WED */}
               <div className="w-10 h-[65%] bg-[#2A377B] rounded-sm"></div>
            </div>
            
            <div className="flex justify-between px-4 pt-4 text-[9px] font-bold tracking-widest text-slate-400 uppercase">
               <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span><span>MON</span><span>TUE</span><span>WED</span>
            </div>
         </div>

         {/* Sidebar Widgets */}
         <div className="space-y-6 flex flex-col h-[400px]">
            
            {/* Commands Card */}
            <div className="bg-[#1b195c] rounded-3xl p-6 border border-[#2A377B] shadow-lg flex-1">
               <h3 className="text-white font-bold text-lg tracking-tight mb-6">Instant Commands</h3>
               <div className="grid grid-cols-2 gap-4 h-[calc(100%-50px)]">
                  <button className="bg-[#2A377B] hover:bg-[#3b4dbf] transition-colors rounded-2xl flex flex-col items-center justify-center gap-3 border border-[#3b4dbf]/50">
                     <MapPin className="w-6 h-6 text-white" />
                     <span className="text-[9px] uppercase font-bold text-white tracking-widest">Route Search</span>
                  </button>
                  <button className="bg-[#2A377B] hover:bg-[#3b4dbf] transition-colors rounded-2xl flex flex-col items-center justify-center gap-3 border border-[#3b4dbf]/50">
                     <MessageSquare className="w-6 h-6 text-white" />
                     <span className="text-[9px] uppercase font-bold text-white tracking-widest">Manage Rates</span>
                  </button>
               </div>
            </div>

            {/* Alert Card */}
            <div className="bg-[#ffecd6] rounded-3xl p-6 border border-[#ffdbbb] shadow-sm flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#d97706]" />
                  <h3 className="font-bold text-[#1E1B4B] text-[15px]">Clearance Alert</h3>
               </div>
               <p className="text-[13px] text-slate-700 font-medium leading-relaxed mb-4">
                  Warehouse #4 in Singapore reports a 12-hour customs delay affecting 4 shipments.
               </p>
               <a href="#" className="text-sm font-bold text-[#1E1B4B] underline hover:no-underline decoration-2 underline-offset-4">Resolve Now</a>
            </div>

         </div>

      </div>

      {/* TERMINAL ACTIVITY */}
      <div className="bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 p-8 mb-10 overflow-hidden">
         <div className="flex justify-between items-end mb-8">
            <h3 className="text-[20px] font-bold text-[#1E1B4B] tracking-tight">Terminal Activity</h3>
            <span className="text-sm font-bold text-[#3b4dbf] hover:text-[#1E1B4B] cursor-pointer transition-colors">View History</span>
         </div>
         
         <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#eff2ff] flex items-center justify-center shrink-0">
                     <Anchor className="w-5 h-5 text-[#3b4dbf]" />
                  </div>
                  <div>
                     <h4 className="text-[15px] font-bold text-[#1E1B4B] mb-0.5">Port Arrival: MS Evergrand</h4>
                     <p className="text-[13px] font-medium text-slate-500">Scheduled docking verified. Preparing offload protocol.</p>
                  </div>
               </div>
               <div className="text-right flex items-center justify-end gap-6 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">08:42 AM</span>
                  <div className="w-24">
                     <span className="px-3 py-1 bg-[#ccfbf1] text-teal-800 rounded-lg text-[9px] font-bold tracking-widest uppercase block text-center">In Transit</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#ffecd6] flex items-center justify-center shrink-0">
                     <Package className="w-5 h-5 text-[#d97706]" />
                  </div>
                  <div>
                     <h4 className="text-[15px] font-bold text-[#1E1B4B] mb-0.5">Inventory Restock: Berlin Hub</h4>
                     <p className="text-[13px] font-medium text-slate-500">Automated warehouse update: 450 units of high-value electronics received.</p>
                  </div>
               </div>
               <div className="text-right flex items-center justify-end gap-6 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">07:15 AM</span>
                  <div className="w-24">
                     <span className="px-3 py-1 bg-slate-200/80 text-slate-600 rounded-lg text-[9px] font-bold tracking-widest uppercase block text-center">Completed</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] flex items-center justify-center shrink-0">
                     <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                     <h4 className="text-[15px] font-bold text-[#1E1B4B] mb-0.5">Compliance Flag: SHP-992-K</h4>
                     <p className="text-[13px] font-medium text-slate-500">Documentation mismatch detected for chemicals shipment. Held at Rotterdam.</p>
                  </div>
               </div>
               <div className="text-right flex items-center justify-end gap-6 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">04:30 AM</span>
                  <div className="w-24">
                     <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[9px] font-bold tracking-widest uppercase block text-center">Critical</span>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-200/70 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between">
         <div className="flex items-center gap-6 text-[13px]">
            <span className="font-bold text-[#1E1B4B] text-[15px]">Global Navigator</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-medium">© 2024 Global Navigator Logistics. All rights reserved.</span>
         </div>
         <div className="flex gap-8 text-[12px] font-bold mt-4 md:mt-0">
            <a href="#" className="text-slate-500 hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4 decoration-slate-300">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4 decoration-slate-300">Sustainability</a>
            <a href="#" className="text-slate-500 hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4 decoration-slate-300">Global Compliance</a>
         </div>
      </div>

    </div>
  );
}
