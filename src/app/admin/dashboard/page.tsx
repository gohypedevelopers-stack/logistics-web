import prisma from "@/lib/prisma";
import Link from "next/link";
import { 
  LayoutList, 
  Clock, 
  PackageOpen, 
  Truck, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Zap,
  Ticket,
  Search,
  Users,
  Settings,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Real Database Counts
  const totalShipments = await prisma.shipment.count();
  const pendingReview = await prisma.shipment.count({ where: { status: 'SUBMITTED' } });
  const accepted = await prisma.shipment.count({ where: { status: 'ACCEPTED' } });
  const inTransit = await prisma.shipment.count({ 
    where: { 
      status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKUP_SCHEDULED', 'ACCEPTED'] } 
    } 
  });
  const delivered = await prisma.shipment.count({ where: { status: 'DELIVERED' } });
  const rejected = await prisma.shipment.count({ where: { status: 'REJECTED' } });
  const customerCount = await prisma.customerProfile.count();

  // Recent Shipments
  const recentShipments = await prisma.shipment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      customer: true,
      pickupAddress: true,
      receiverAddress: true
    }
  });

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight mb-4">Admin Command Center</h1>
        
        {/* Operations Banner */}
        <div className="bg-[#EEF2FF] rounded-xl p-6 border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
             <h2 className="text-[#1E3A8A] font-bold text-lg flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" /> System Status: Operational
             </h2>
             <p className="text-slate-600 font-medium text-sm mt-1">Global logistics ledger is synchronized. {pendingReview} shipments require administrative review.</p>
          </div>
          <Link href="/admin/shipments?status=SUBMITTED" className="whitespace-nowrap bg-[#1E3A8A] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-900/10">
            Review Queue
          </Link>
        </div>
      </div>

      {/* Top Stats Row - Customer Dashboard Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <Link href="/admin/shipments" className="bg-[#F4F7FA] rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <LayoutList className="w-5 h-5 text-blue-600" />
             </div>
             <span className="text-[#1E3A8A] font-bold text-xs uppercase tracking-wider">Total Ledger</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(totalShipments).padStart(2, '0')}</div>
        </Link>
        
        <Link href="/admin/shipments?status=SUBMITTED" className="bg-[#FFFDF5] rounded-2xl p-6 border border-amber-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
             </div>
             <span className="text-amber-700 font-bold text-xs uppercase tracking-wider">Pending</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(pendingReview).padStart(2, '0')}</div>
        </Link>

        <Link href="/admin/shipments" className="bg-[#F2FCF5] rounded-2xl p-6 border border-green-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <PackageOpen className="w-5 h-5 text-green-600" />
             </div>
             <span className="text-green-700 font-bold text-xs uppercase tracking-wider">Accepted</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(accepted).padStart(2, '0')}</div>
        </Link>

        <Link href="/admin/shipments" className="bg-[#F5F3FF] rounded-2xl p-6 border border-purple-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
             </div>
             <span className="text-purple-700 font-bold text-xs uppercase tracking-wider">In Transit</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(inTransit).padStart(2, '0')}</div>
        </Link>

        <Link href="/admin/shipments" className="bg-[#F0FDFA] rounded-2xl p-6 border border-teal-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600" />
             </div>
             <span className="text-teal-700 font-bold text-xs uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(delivered).padStart(2, '0')}</div>
        </Link>

        <Link href="/admin/shipments" className="bg-[#FFF5F5] rounded-2xl p-6 border border-red-100 hover:shadow-md transition-all flex flex-col justify-between h-36">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
             </div>
             <span className="text-red-700 font-bold text-xs uppercase tracking-wider">Rejections</span>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tighter">{String(rejected).padStart(2, '0')}</div>
        </Link>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        
        {/* Quick Actions - Admin Version */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
             <Zap className="w-4 h-4 text-amber-500" /> Administrative Actions
           </h3>
           <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/shipments" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/10 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:bg-blue-100">
                       <Ticket className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 leading-tight">Manage Shipments</p>
                       <p className="text-[11px] text-slate-500 font-medium">Review and update status</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/admin/customers" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-300 hover:bg-purple-50/10 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:bg-purple-100">
                       <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 leading-tight">Customer Directory</p>
                       <p className="text-[11px] text-slate-500 font-medium">{customerCount} registered accounts</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/admin/rates" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-300 hover:bg-teal-50/10 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100 group-hover:bg-teal-100">
                       <Search className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 leading-tight">Rates & Routes</p>
                       <p className="text-[11px] text-slate-500 font-medium">Configure global tariffs</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </Link>

              <Link href="/admin/settings" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100">
                       <Settings className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 leading-tight">System Settings</p>
                       <p className="text-[11px] text-slate-500 font-medium">Platform configuration</p>
                    </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </Link>
           </div>
        </div>

        {/* Recent Shipments - Simplified List Version */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#1E293B] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" /> Recent Operations
              </h3>
              <Link href="/admin/shipments" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                 {recentShipments.map((ship) => (
                    <Link key={ship.id} href={`/admin/shipments/${ship.id}`} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-2 h-10 rounded-full",
                            ship.status === 'SUBMITTED' ? "bg-amber-400" : 
                            ship.status === 'ACCEPTED' ? "bg-green-400" :
                            ship.status === 'DELIVERED' ? "bg-teal-400" : "bg-blue-400"
                          )} />
                          <div>
                             <p className="text-sm font-bold text-slate-800 leading-tight">{ship.trackingId}</p>
                             <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-1 uppercase tracking-tight">
                               {ship.customer?.companyName || 'Guest'} <span className="text-slate-200">|</span> {ship.pickupAddress?.city} → {ship.receiverAddress?.city}
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-800">{format(new Date(ship.createdAt), "MMM d")}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{ship.status.replace(/_/g, ' ')}</p>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
