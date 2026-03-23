import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { 
  ChevronLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  History, 
  Edit3,
  Truck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { updateShipmentAction } from "./actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

const ALL_STATUSES = [
  'SUBMITTED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'PICKED_UP',
  'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'REJECTED', 'ON_HOLD'
];

export default async function AdminShipmentDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return <div>Unauthorized</div>;

  const shipment = await prisma.shipment.findUnique({
    where: { id: resolvedParams.id },
    include: {
      customer: { include: { user: true } },
      pickupAddress: { include: { country: true } },
      receiverAddress: { include: { country: true } },
      logisticsCompany: true,
      statusHistory: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 font-sans">
        <AlertCircle className="w-16 h-16 text-slate-200 mb-6" />
        <h2 className="text-xl font-bold text-slate-800">Shipment Not Found</h2>
        <Link href="/admin/shipments" className="mt-6 text-blue-600 font-bold hover:underline capitalize">
          Return to shipments list
        </Link>
      </div>
    );
  }

  const isPending = shipment.status === 'SUBMITTED';

  return (
    <div className="p-8 lg:p-10 max-w-[1400px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      {/* Header / Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-slate-500 mb-4 text-sm font-medium">
          <Link href="/admin/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/shipments" className="hover:text-blue-600">Shipments</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">{shipment.trackingId}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">{shipment.trackingId}</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Booked on {format(new Date(shipment.createdAt), "PPP")}</p>
           </div>
           <div className="flex items-center gap-4">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm",
                shipment.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                shipment.status === 'DELIVERED' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                shipment.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              )}>
                 {shipment.status.replace(/_/g, ' ')}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">
        
        {/* Left Column - Shipment Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <User className="w-5 h-5" />
                   </div>
                   <h3 className="font-bold text-[#1E293B]">Customer Details</h3>
                </div>
                <div className="space-y-4">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company / Name</p>
                      <p className="font-bold text-slate-800 text-lg">{shipment.customer?.companyName || shipment.customer?.user?.name || 'Private Client'}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                         <p className="text-sm font-medium text-slate-600 truncate">{shipment.customer?.user?.email}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                         <p className="text-sm font-medium text-slate-600">{shipment.customer?.phone || 'N/A'}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <Package className="w-5 h-5" />
                   </div>
                   <h3 className="font-bold text-[#1E293B]">Package Details</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight</p>
                         <p className="font-bold text-slate-800 text-2xl">{shipment.weight} <span className="text-sm font-medium text-slate-400">kg</span></p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value (USD)</p>
                         <p className="font-bold text-slate-800 text-2xl">${shipment.amount || 0}</p>
                      </div>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Content Description</p>
                      <p className="text-sm font-medium text-slate-600 italic mt-1 line-clamp-2">
                         {shipment.content || 'No description provided'}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Route Section */}
          <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                   <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1E293B]">Shipment Route</h3>
             </div>

             <div className="grid md:grid-cols-2 gap-12 relative">
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-slate-100 -translate-x-1/2" />
                
                {/* Pickup */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 text-[10px] font-bold text-slate-600 flex items-center justify-center border border-slate-200">A</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pickup Address</span>
                   </div>
                   {shipment.pickupAddress ? (
                     <div className="pl-8">
                        <p className="font-bold text-[#1E1B4B] text-lg">{shipment.pickupAddress.name}</p>
                        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                          {shipment.pickupAddress.street1}<br />
                          {shipment.pickupAddress.city}, {shipment.pickupAddress.country?.name} {shipment.pickupAddress.postalCode}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase mt-4 border border-blue-100">
                           <MapPin className="w-3 h-3" /> {shipment.pickupAddress.city} HUB
                        </div>
                     </div>
                   ) : <p className="pl-8 text-sm italic text-slate-400">Pickup address not assigned.</p>}
                </div>

                {/* Receiver */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#1E1B4B] text-[10px] font-bold text-white flex items-center justify-center">B</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Address</span>
                   </div>
                   {shipment.receiverAddress ? (
                     <div className="pl-8">
                        <p className="font-bold text-[#1E1B4B] text-lg">{shipment.receiverAddress.name}</p>
                        <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                          {shipment.receiverAddress.street1}<br />
                          {shipment.receiverAddress.city}, {shipment.receiverAddress.country?.name} {shipment.receiverAddress.postalCode}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase mt-4 border border-green-100">
                           <MapPin className="w-3 h-3" /> {shipment.receiverAddress.city} POINT
                        </div>
                     </div>
                   ) : <p className="pl-8 text-sm italic text-slate-400">Receiver address not assigned.</p>}
                </div>
             </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm font-sans">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                   <History className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1E293B]">Shipment History</h3>
             </div>

             <div className="space-y-8 relative pl-4">
                <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-slate-100" />
                {shipment.statusHistory.map((history, idx) => (
                  <div key={history.id} className="relative pl-12 last:pb-0">
                     <div className={cn(
                       "absolute left-0 top-1 w-10 h-10 rounded-xl border ring-[6px] ring-white flex items-center justify-center z-10",
                       idx === 0 ? "bg-[#1E1B4B] border-[#1E1B4B] text-white" : "bg-white border-slate-200 text-slate-300"
                     )}>
                        {idx === 0 ? <Clock className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                     </div>
                     
                     <div className={cn(
                       "p-6 rounded-2xl border transition-all",
                       idx === 0 ? "bg-[#f8f9fa] border-blue-100" : "bg-white border-slate-100"
                     )}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white border border-slate-200 rounded">{history.status.replace(/_/g, ' ')}</span>
                              {history.location && (
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 opacity-70">
                                   <MapPin className="w-3 h-3" /> {history.location}
                                </span>
                              )}
                           </div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {format(new Date(history.createdAt), "dd MMM yyyy, h:mm a")}
                           </span>
                        </div>
                        {history.notes && <p className="text-sm font-medium text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-4 py-1">{history.notes}</p>}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column - Controls */}
        <div className="lg:col-span-1 space-y-8 h-full sticky top-8">
           
           {/* Quick Actions (Accept/Reject) */}
           {isPending && (
             <div className="bg-white rounded-2xl p-8 border border-amber-200 shadow-lg shadow-amber-900/5">
                <div className="flex items-center gap-3 mb-6">
                   <ShieldAlert className="w-5 h-5 text-amber-500" />
                   <h3 className="font-bold text-[#1E293B]">Action Required</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   <form action={updateShipmentAction}>
                      <input type="hidden" name="shipmentId" value={shipment.id} />
                      <input type="hidden" name="status" value="ACCEPTED" />
                      <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-[#1E1B4B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-all">
                         <CheckCircle2 className="w-4 h-4" /> ACCEPT SHIPMENT
                      </button>
                   </form>
                   <form action={updateShipmentAction}>
                      <input type="hidden" name="shipmentId" value={shipment.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-all">
                         <XCircle className="w-4 h-4" /> REJECT / BLOCK
                      </button>
                   </form>
                </div>
             </div>
           )}

           {/* Full Controls */}
           <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                 <Edit3 className="w-4 h-4 text-blue-500" /> Update Status
              </h3>
              
              <form action={updateShipmentAction} className="space-y-6">
                 <input type="hidden" name="shipmentId" value={shipment.id} />
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Status</label>
                    <select name="status" defaultValue={shipment.status} className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all">
                       {ALL_STATUSES.map(s => (
                         <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assign AWB / Tracking</label>
                    <input 
                      name="awb" 
                      type="text" 
                      defaultValue={shipment.awb || ""} 
                      placeholder="e.g. DHL-901-X"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Current Location</label>
                    <input 
                      name="location" 
                      type="text" 
                      placeholder="e.g. Heathrow Gateway"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Notes / Instructions</label>
                    <textarea 
                      name="notes" 
                      placeholder="Add an update for the customer..." 
                      rows={4}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all resize-none"
                    />
                 </div>

                 <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-[#1E1B4B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                    <Send className="w-4 h-4" /> SAVE CHANGES
                 </button>
              </form>
           </div>

           {/* Secondary Controls - Payment Status etc */}
           <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <CreditCard className="w-3 h-3" /> Billing Info
              </h3>
              <form action={updateShipmentAction} className="space-y-4">
                 <input type="hidden" name="shipmentId" value={shipment.id} />
                 <input type="hidden" name="status" value={shipment.status} />
                 <select 
                    name="paymentStatus" 
                    defaultValue={shipment.paymentStatus} 
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                 >
                    {['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'].map(ps => (
                      <option key={ps} value={ps}>{ps}</option>
                    ))}
                 </select>
                 <button type="submit" className="w-full text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase py-2">
                    Update Payment
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
