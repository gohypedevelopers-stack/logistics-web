import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, MapPin, Package, CheckCircle, Clock, XCircle, ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { RefreshHandler } from "@/components/RefreshHandler";

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> | { id?: string } }) {
  const resolvedParams = await searchParams;
  const trackingId = resolvedParams.id;

  let shipment = null;
  if (trackingId) {
    shipment = await prisma.shipment.findFirst({
      where: {
        OR: [
          { trackingId },
          { awb: trackingId }
        ]
      },
      include: {
        customer: true,
        receiverAddress: { include: { country: true } },
        pickupAddress: { include: { country: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });
  }

  // Create a proper server action if they submit the simple form
  async function trackAction(formData: FormData) {
    "use server";
    const id = formData.get("trackingId");
    if (id) redirect(`/customer/track?id=${id}`);
  }

  return (
    <div className="p-8 lg:p-10 max-w-[1200px] mx-auto min-h-full bg-[#f8f9fa]">
      {trackingId && <RefreshHandler interval={10000} />} {/* Refresh more often on track page */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/customer/shipments" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Track Shipment</h1>
          <p className="text-sm font-medium text-slate-500">View real-time status and timeline updates.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mb-8 relative z-10">
        <form action={trackAction} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              name="trackingId"
              type="text" 
              defaultValue={trackingId || ""}
              placeholder="Enter Tracking ID (e.g. TRK...)" 
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 shadow-inner"
            />
          </div>
          <button type="submit" className="h-14 px-8 bg-[#1E3A8A] text-white font-bold rounded-xl hover:bg-blue-900 transition-colors shadow-md">
            Track Node
          </button>
        </form>
      </div>

      {trackingId && !shipment && (
        <div className="bg-white border border-red-100 rounded-2xl p-12 text-center shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Shipment Not Found</h2>
          <p className="text-slate-500 font-medium">We couldn't locate any active shipment with the ID <strong>{trackingId}</strong>.</p>
        </div>
      )}

      {trackingId && shipment && (
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Timeline side */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
             <h2 className="text-lg font-black text-[#1E293B] mb-8 flex items-center gap-3 border-b border-slate-100 pb-4 tracking-tight">
               <ActivitySquareIcon className="w-5 h-5 text-blue-600" />
               Status Timeline
             </h2>
             
             <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-200 before:to-transparent">
               
               {shipment.statusHistory.map((history: any, i: number) => {
                 const isLatest = i === 0;
                 return (
                   <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white ${isLatest ? 'bg-blue-600 ring-4 ring-blue-100 shadow-md' : 'bg-slate-300'} absolute -left-[35px] md:relative md:left-auto md:mx-auto shrink-0 z-10 transition-colors`}>
                     </div>
                     <div className="w-[calc(100%-1rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-slate-100 shadow-sm bg-white hover:border-blue-200 transition-colors relative z-10">
                       <div className="flex items-center justify-between space-x-2 mb-2">
                         <div className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">
                           {history.status.replace(/_/g, ' ')}
                         </div>
                         <time className="font-bold text-[10px] text-slate-400 tracking-widest">{new Date(history.createdAt).toLocaleString()}</time>
                       </div>
                       {history.notes && <div className="text-slate-600 text-[13px] font-medium leading-relaxed">{history.notes}</div>}
                     </div>
                   </div>
                 )
               })}

             </div>
          </div>

          {/* Details Side */}
          <div className="space-y-8">
             {/* General Card */}
             <div className="bg-gradient-to-br from-[#1E293B] to-[#2A377B] rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
                   <Package className="w-48 h-48" />
                </div>
                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-2 relative z-10">Delivery Node</h3>
                <h2 className="text-3xl font-black mb-6 relative z-10">{shipment.trackingId}</h2>
                
                {shipment.awb && (
                  <div className="mb-6 relative z-10">
                    <span className="bg-white/10 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">AWB: {shipment.awb}</span>
                  </div>
                )}

                {(shipment as any).status === 'REJECTED' && (shipment as any).rejectionReason && (
                   <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl mt-4 relative z-10 text-sm">
                      <strong className="block text-red-200 mb-1">Reason for Rejection:</strong>
                      <span className="text-red-100">{(shipment as any).rejectionReason}</span>
                   </div>
                )}
             </div>

             {/* Specifics Card */}
             <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Consignment Data</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                   <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</span>
                      <span className="font-black text-slate-800 uppercase text-sm block">{shipment.status.replace(/_/g, ' ')}</span>
                   </div>
                   <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Declared Weight</span>
                      <span className="font-black text-slate-800 uppercase text-sm">{shipment.weight} KG</span>
                   </div>
                   <div className="col-span-2">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contents</span>
                      <span className="font-medium text-slate-700 text-sm">{shipment.content || 'N/A'}</span>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                      <div>
                         <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination</span>
                         <span className="font-black text-slate-800 text-sm block mb-1">{shipment.receiverAddress?.name}</span>
                         <span className="font-medium text-slate-600 text-xs block leading-relaxed max-w-[200px]">
                           {shipment.receiverAddress?.street1}<br/>
                           {shipment.receiverAddress?.city}, {shipment.receiverAddress?.country?.name} {shipment.receiverAddress?.postalCode}
                         </span>
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      )}
    </div>
  );
}

function ActivitySquareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M17 12h-2l-2 5-2-10-2 5H7" />
    </svg>
  )
}
