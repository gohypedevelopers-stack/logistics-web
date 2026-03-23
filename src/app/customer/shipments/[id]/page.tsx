import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowLeft, Box, CheckCircle2, PackageSearch, Plane, ScrollText, Timer, Truck, FileCheck2, Warehouse, Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Workflow Statuses array ensuring correct chronological order for timeline
const WORKFLOW_STEPS = [
  { status: 'SUBMITTED', label: 'Order Submitted', icon: ScrollText },
  { status: 'ACCEPTED', label: 'Accepted by Admin', icon: PackageSearch },
  { status: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', icon: Timer },
  { status: 'PICKED_UP', label: 'Picked Up', icon: Truck },
  { status: 'IN_TRANSIT', label: 'In Transit', icon: Plane },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered Successfully', icon: CheckCircle2 }
];

export default async function ShipmentDetail({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const shipment = await prisma.shipment.findUnique({
    where: { id: resolvedParams.id, 
             // Ensure only customer viewing their own OR an admin viewing
             ...(session.user.role === 'CUSTOMER' ? { customer: { userId: session.user.id } } : {})
           },
    include: {
      pickupAddress: true,
      receiverAddress: true,
      logisticsCompany: true,
      statusHistory: { orderBy: { createdAt: 'desc' } },
      events: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!shipment) {
    return <div className="p-16 text-center text-slate-500 font-bold bg-white rounded-xl shadow-lg border border-slate-100 mt-10 max-w-2xl mx-auto">Shipment tracking record not found or inaccessible.</div>;
  }

  // Determine Current Step Index for timeline rendering
  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.status === shipment.status) || 0;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 opacity-5">
           <PackageSearch className="w-96 h-96" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <Link href="/customer/shipments">
            <Button variant="ghost" size="icon" className="rounded-full w-12 h-12 bg-slate-50 hover:bg-slate-200">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
               {shipment.trackingId}
               <Badge className="bg-primary hover:bg-indigo-800 uppercase tracking-widest text-[10px] shadow-md px-3 py-1">
                 {shipment.status.replace(/_/g, ' ')}
               </Badge>
            </h1>
            <p className="text-lg font-bold text-slate-400 tracking-widest uppercase mt-2">
               AWB: {shipment.awb || 'Pending Generation'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 relative z-10">
          <Button variant="outline" className="h-12 border-slate-300 font-bold px-6 shadow-sm rounded-xl" disabled>Download Waybill</Button>
          <Button variant="outline" className="h-12 border-slate-300 font-bold px-6 shadow-sm rounded-xl" disabled>View Commercial Invoice</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* LEFT COLUMN: MAIN TIMELINE */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-12 self-start w-full border-b border-slate-100 pb-6 uppercase">Tracking Timeline</h3>
               
               <div className="w-full relative px-4 md:px-8">
                  {/* Timeline Line */}
                  <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                  
                  {WORKFLOW_STEPS.map((step, idx) => {
                     const isCompleted = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     const Icon = step.icon;

                     // Verify if it exists in DB history to fetch real date
                     const historyLog = shipment.statusHistory.find((h: any) => h.status === step.status);

                     return (
                        <div key={idx} className={`relative flex items-center mb-12 last:mb-0 transition-opacity duration-500 ${!isCompleted ? 'opacity-40' : 'opacity-100'}`}>
                           <div className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isCompleted ? 'bg-primary text-white ring-4 ring-indigo-50' : 'bg-white text-slate-300 border-2 border-slate-200'}`}>
                              <Icon className={isCurrent ? 'w-6 h-6 animate-pulse' : 'w-5 h-5'} />
                           </div>
                           
                           <div className="ml-6 md:ml-10">
                              <h4 className={`text-xl font-bold tracking-tight ${isCurrent ? 'text-primary' : 'text-slate-800'}`}>
                                 {step.label} {isCurrent && <span className="text-[10px] uppercase font-black tracking-widest bg-yellow-100 text-yellow-800 px-2 py-1 rounded ml-2 align-middle">Current Event</span>}
                              </h4>
                              {isCompleted && historyLog && (
                                 <div className="flex gap-4 mt-2">
                                     <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{new Date(historyLog.createdAt).toLocaleString()}</span>
                                     {historyLog.location && <span className="text-sm font-semibold text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {historyLog.location}</span>}
                                 </div>
                              )}
                              {isCompleted && historyLog?.notes && (
                                 <p className="mt-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">"{historyLog.notes}"</p>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: CARGO & ROUTES DATA */}
         <div className="space-y-8">
            {/* Cargo Meta */}
            <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Consignment Info</h3>
               
               <div className="space-y-6 relative z-10">
                  <div>
                    <div className="text-xs font-bold text-slate-500 tracking-wider">Commodity</div>
                    <div className="text-xl font-black">{shipment.content || 'N/A'}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <div className="text-xs font-bold text-slate-500 tracking-wider">Weight</div>
                       <div className="text-xl font-black font-mono bg-slate-800 px-3 py-1 rounded-lg inline-block">{shipment.weight ? `${shipment.weight} KG` : '-'}</div>
                     </div>
                     <div>
                       <div className="text-xs font-bold text-slate-500 tracking-wider">Value</div>
                       <div className="text-xl font-black font-mono bg-slate-800 px-3 py-1 rounded-lg inline-block">{shipment.amount ? `$${shipment.amount}` : '-'}</div>
                     </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-500 tracking-wider">Internal Reference</div>
                    <div className="font-bold text-slate-300">{shipment.referenceNo || 'None'}</div>
                  </div>
               </div>
            </div>

            {/* Entities */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
               <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Entities & Routing</h3>
               
               <div className="space-y-8">
                  {/* Carrier */}
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Assigned Carrier</span>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-black text-slate-800">
                        {shipment.logisticsCompany?.name || 'Pending Assignment'}
                     </div>
                  </div>

                  {/* Consignee */}
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <Box className="w-5 h-5 text-secondary stroke-2" />
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Final Consignee in India</span>
                     </div>
                     <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 font-medium">
                        {shipment.receiverAddress ? (
                           <>
                             <div className="font-black text-slate-900 mb-1">{shipment.receiverAddress.name}</div>
                             <div className="text-slate-600 text-sm leading-relaxed">
                                {shipment.receiverAddress.street1}<br/>
                                {shipment.receiverAddress.street2 && <>{shipment.receiverAddress.street2}<br/></>}
                                {shipment.receiverAddress.city}, {shipment.receiverAddress.state} {shipment.receiverAddress.postalCode}<br/>
                                <span className="font-bold mt-2 block">Phone: {shipment.receiverAddress.phone || 'N/A'}</span>
                             </div>
                           </>
                        ) : 'Unassigned'}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
