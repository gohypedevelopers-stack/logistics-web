import prisma from "@/lib/prisma";
import Link from "next/link";
import { User, Mail, Phone, ChevronLeft, Search, Plus, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminCustomers() {
  const customers = await prisma.customerProfile.findMany({
    include: {
      user: true,
      shipments: { select: { id: true } }
    },
    orderBy: { createdAt: 'desc' }
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
              Customer Directory
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Manage client accounts, contact details, and visibility.
            </div>
          </div>
          <button className="px-5 h-11 bg-[#1E1B4B] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-md">
            <Plus className="w-4 h-4" /> Create Profile
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
                placeholder="Find customer by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
           </div>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
           {customers.length === 0 ? (
             <div className="col-span-full py-20 text-center text-slate-400 italic">No customers found.</div>
           ) : (
             customers.map((customer) => (
               <div key={customer.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col justify-between h-[300px]">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 flex items-center justify-center font-bold text-lg group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                          {(customer.companyName || customer.user.name || "C").charAt(0).toUpperCase()}
                       </div>
                       <div className="flex-1 truncate">
                          <h4 className="font-bold text-slate-800 text-lg truncate group-hover:text-blue-700 transition-colors uppercase tracking-tight">{customer.companyName || 'Private Client'}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Account</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-medium text-slate-600 truncate">{customer.user.email}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-medium text-slate-600 truncate">{customer.phone || 'No phone'}</span>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                        <p className="text-xl font-black text-[#1E1B4B] tracking-tight mt-0.5">{customer.shipments.length}</p>
                     </div>
                     <Link href={`/admin/customers/${customer.id}`} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#1E1B4B] hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
