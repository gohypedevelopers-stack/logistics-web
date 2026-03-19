import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Edit, Save, ActivitySquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Need all 16 exactly matching prisma schema
const ALL_STATUSES = [
  'DRAFT', 'CREATED', 'PICKUP_SCHEDULED', 'PICKUP_COMPLETED',
  'RECEIVED_AT_ORIGIN_WAREHOUSE', 'PACKAGE_VERIFICATION_COMPLETED',
  'DISPATCHED_FROM_ORIGIN_WAREHOUSE', 'FLIGHT_DEPARTED', 'IN_TRANSIT',
  'FLIGHT_LANDED_IN_INDIA', 'UNDER_CUSTOMS_REVIEW', 'CUSTOMS_CLEARED',
  'RECEIVED_AT_DELHI_WAREHOUSE', 'PACKAGE_VERIFICATION_AT_DELHI_WAREHOUSE',
  'READY_FOR_FINAL_DELIVERY', 'DELIVERED'
];

export default async function AdminShipmentDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <div>Unauthorized</div>;

  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      pickupAddress: true,
      receiverAddress: true,
      logisticsCompany: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      route: { include: { destinationCountry: true, originCountry: true } }
    }
  });

  if (!shipment) return <div className="p-16 text-center text-slate-500 font-black tracking-widest bg-white rounded-3xl shadow-xl mt-10">ENTITY NOT FOUND</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-6">
          <Link href="/admin/shipments">
            <Button variant="ghost" size="icon" className="rounded-2xl w-14 h-14 bg-slate-50 hover:bg-slate-200 border border-slate-200">
              <ArrowLeft className="w-6 h-6 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
               {shipment.trackingId}
               <Badge className="bg-slate-900 text-white uppercase tracking-widest text-xs px-3 py-1.5 shadow-md border-0 ring-4 ring-slate-100">
                 {shipment.status.replace(/_/g, ' ')}
               </Badge>
            </h1>
            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mt-3 bg-slate-50 px-3 py-1 inline-block rounded-lg">
               System Record ID: {shipment.id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* STATUS MUTATION SIDE (Admin Only function) */}
         <div className="lg:col-span-5 space-y-8">
            <form className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2">
                  <ActivitySquare className="w-64 h-64 text-slate-800/50" />
               </div>
               
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-800 pb-4 relative z-10 flex items-center gap-3">
                 <Edit className="w-4 h-4" /> Operations Control
               </h3>
               
               <div className="space-y-6 relative z-10">
                  <div>
                     <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 mb-3 uppercase">Trigger Workflow Step</label>
                     <select 
                       defaultValue={shipment.status}
                       className="w-full h-14 px-4 rounded-xl bg-slate-800 border border-slate-600 text-white font-black uppercase text-xs tracking-widest focus:ring-2 focus:ring-primary appearance-none hover:bg-slate-700 cursor-pointer transition-all"
                     >
                        {ALL_STATUSES.map(s => (
                           <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 mb-3 uppercase">Location Tag (Optional)</label>
                     <input 
                       type="text" 
                       placeholder="E.g. JFK Airport, Cargo Terminal 4"
                       className="w-full h-14 px-4 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-sm tracking-wide focus:ring-2 focus:ring-primary placeholder:text-slate-600 outline-none" 
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-black tracking-[0.2em] text-slate-400 mb-3 uppercase">Internal / Public Notes</label>
                     <textarea 
                       placeholder="Note to appear in timeline..."
                       rows={3}
                       className="w-full p-4 rounded-xl bg-slate-800 border border-slate-600 text-white font-bold text-sm tracking-wide focus:ring-2 focus:ring-primary placeholder:text-slate-600 outline-none resize-none" 
                     />
                  </div>

                  {/* Note: Dummy submission layout */}
                  <Button type="button" className="w-full h-16 rounded-xl bg-white text-primary hover:bg-slate-200 font-black tracking-[0.2em] uppercase text-sm shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 mt-8">
                     <Save className="w-5 h-5" /> 
                     Force Push Update
                  </Button>
               </div>
            </form>

            {/* Quick Audit Data */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Lifecycle Audit</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                     <span className="text-slate-500 uppercase tracking-widest text-[10px]">Created</span>
                     <span className="text-slate-900">{new Date(shipment.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-t border-slate-50 pt-4">
                     <span className="text-slate-500 uppercase tracking-widest text-[10px]">Last Mutated</span>
                     <span className="text-slate-900">{new Date(shipment.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-t border-slate-50 pt-4">
                     <span className="text-slate-500 uppercase tracking-widest text-[10px]">Financial Status</span>
                     <Badge className={shipment.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {shipment.paymentStatus}
                     </Badge>
                  </div>
               </div>
            </div>
         </div>

         {/* DATA READ SIDE */}
         <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-[#1A1F4C] text-white">
                  <h2 className="text-xl font-black tracking-tight uppercase">Master Consignment Data</h2>
               </div>
               
               <div className="p-8 grid md:grid-cols-2 gap-8 bg-white">
                  <div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Profile / Bill To</div>
                     <div className="font-black text-lg text-slate-800">{shipment.customer?.companyName || 'Not Set'}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Tax ID: {shipment.customer?.taxId || 'N/A'}</div>
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Logistics / Partner Carrier</div>
                     <div className="font-black text-lg text-slate-800">{shipment.logisticsCompany?.name || 'Unassigned'}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Provider Ref: Null</div>
                  </div>
                  <div className="md:col-span-2 border-t border-slate-100 pt-8 mt-4 grid grid-cols-3 gap-6">
                     <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Weight</div>
                        <div className="font-black text-2xl text-slate-800">{shipment.weight ? `${shipment.weight} KG` : '???'}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</div>
                        <div className="font-black text-2xl text-slate-800">{shipment.amount ? `$${shipment.amount}` : '-'}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Delivery</div>
                        <div className="font-black text-lg text-slate-800">{shipment.expectedArrivalDate ? new Date(shipment.expectedArrivalDate).toLocaleDateString() : 'TBD'}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-md font-black text-slate-600 tracking-widest uppercase">Routing Addresses</h2>
               </div>
               <div className="p-8 grid md:grid-cols-2 gap-8 relative">
                  <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-slate-100"></div>
                  <div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        Pickup Coordinate
                     </div>
                     {shipment.pickupAddress ? (
                        <div className="font-medium text-slate-700 leading-relaxed text-sm">
                           <strong className="block text-slate-900 text-base mb-1">{shipment.pickupAddress.name}</strong>
                           {shipment.pickupAddress.street1}<br/>
                           {shipment.pickupAddress.city}, {shipment.pickupAddress.state} {shipment.pickupAddress.postalCode}<br/>
                           Origin Country Code
                        </div>
                     ) : <div className="text-slate-400 font-bold italic">No Pickup Address Set</div>}
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Delivery Coordinate
                     </div>
                     {shipment.receiverAddress ? (
                        <div className="font-medium text-slate-700 leading-relaxed text-sm">
                           <strong className="block text-slate-900 text-base mb-1">{shipment.receiverAddress.name}</strong>
                           {shipment.receiverAddress.street1}<br/>
                           {shipment.receiverAddress.city}, {shipment.receiverAddress.postalCode}<br/>
                           Delivery Country Code
                        </div>
                     ) : <div className="text-slate-400 font-bold italic">No Receiver Address Set</div>}
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
