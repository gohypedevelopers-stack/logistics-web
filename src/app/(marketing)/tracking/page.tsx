import prisma from "@/lib/prisma";
import { Search, Plane, CheckCircle2, Clock, Headphones, Download, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TrackingPage({ searchParams }: { searchParams: Promise<{ id?: string }> | { id?: string } }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.id || "";

  let shipment = null;
  if (query) {
    shipment = await prisma.shipment.findFirst({
      where: {
        OR: [
          { trackingId: query },
          { awb: query }
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

  async function handleTrack(formData: FormData) {
    "use server";
    const id = formData.get("trackingId");
    if (id) redirect(`/tracking?id=${id}`);
    else redirect(`/tracking`);
  }

  // Map DB status history to the UI timeline format
  const timeline = shipment?.statusHistory.map((history: any, i: number) => ({
    label: history.status.replace(/_/g, ' '),
    sub: history.location || "Logistics Node Update",
    time: new Date(history.createdAt).toLocaleString('en-GB', { 
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }),
    done: true,
    active: i === 0,
    notes: history.notes
  })) || [];

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20">

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop"
            alt="Logistics"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B4B]/95 via-[#1E1B4B]/85 to-[#1E1B4B]/90"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-16 max-w-5xl pt-8">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Intelligence in Transit</h1>
          <p className="text-indigo-200 font-medium text-[15px] mb-8">Track your global assets with real-time logistical precision.</p>

          <form action={handleTrack} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="trackingId"
                type="text"
                defaultValue={query}
                placeholder="Enter Tracking ID or AWB..."
                className="w-full h-12 bg-white rounded-xl pl-11 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-7 bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shrink-0"
            >
              Track Shipment
            </button>
          </form>
        </div>
      </section>

      {/* Result Area */}
      {query && shipment && (
        <section className="py-12">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Status Card */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Status</p>
                      <h2 className="text-[26px] font-black text-[#1E1B4B] tracking-tight mb-1">
                        {shipment.status.replace(/_/g, ' ')}
                      </h2>
                      <p className="text-sm font-medium text-slate-500">
                        {timeline[0]?.sub || "In Transit"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Estimated Arrival</p>
                      <p className="text-[22px] font-black text-teal-600 tracking-tight">
                        {shipment.expectedArrivalDate ? new Date(shipment.expectedArrivalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Pending Review"}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Updated in real-time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#1E1B4B] text-[14px]">ID: {shipment.trackingId}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {timeline[0]?.notes || "Last logged activity for this consignment."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking Workflow */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[17px] font-black text-[#1E1B4B] tracking-tight mb-7">Tracking Workflow</h3>

                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-100"></div>

                    <div className="space-y-0">
                      {timeline.map((step, i) => (
                        <div key={i} className="relative flex gap-5 pb-7 last:pb-0">
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            step.active
                              ? 'bg-[#1E1B4B] border-[#1E1B4B]'
                              : 'bg-teal-50 border-teal-200'
                          }`}>
                            {step.active
                              ? <CheckCircle2 className="w-4 h-4 text-white" />
                              : <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
                            }
                          </div>

                          <div className="flex-1 min-w-0 flex items-start justify-between gap-4 pt-2">
                            <div>
                              <p className="font-bold text-[14px] leading-tight text-[#1E1B4B] uppercase tracking-tight">{step.label}</p>
                              <p className="text-[12px] font-medium text-slate-400 mt-0.5">{step.sub}</p>
                              {step.notes && <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">"{step.notes}"</p>}
                            </div>
                            <span className={`text-[11px] font-bold tracking-wide shrink-0 whitespace-nowrap px-3 py-1 rounded-lg ${
                              step.active ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
                            }`}>{step.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-5">

                {/* Shipment Intelligence */}
                <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
                  <h3 className="text-[16px] font-black text-[#1E1B4B] tracking-tight mb-6">Shipment Intelligence</h3>

                  {/* Origin */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                      <Plane className="w-4 h-4 text-[#1E1B4B] -rotate-45" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Origin</p>
                      <p className="font-black text-[#1E1B4B] text-[15px]">{shipment.pickupAddress?.city || "Gateway Origin"}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{shipment.pickupAddress?.country?.name || "Global Node"}</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-4 mb-7 pb-7 border-b border-slate-100">
                    <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                      <Plane className="w-4 h-4 text-teal-600 rotate-45" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Destination</p>
                      <p className="font-black text-[#1E1B4B] text-[15px]">{shipment.receiverAddress?.city}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{shipment.receiverAddress?.country?.name}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    {[
                      { label: "Weight", value: `${shipment.weight} kg` },
                      { label: "Consignment", value: shipment.content || "General Goods" },
                      { label: "Service Level", value: "Priority Intelligence" },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-500 font-medium">{row.label}</span>
                        <span className="font-bold text-slate-800">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Map Placeholder */}
                  <div className="mt-6 h-36 bg-slate-100 rounded-xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop&grayscale"
                      alt="Route map"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#1E1B4B] text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        Real-time GPS Active
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download */}
                <button className="w-full h-12 bg-white border border-slate-200 rounded-2xl font-bold text-[13px] text-[#1E1B4B] hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Tracking History
                </button>

                {/* Need Assistance */}
                <div className="bg-[#1E1B4B] rounded-2xl p-7 border border-[#2A377B] shadow-md">
                  <h4 className="font-black text-white text-[16px] mb-2">Need Assistance?</h4>
                  <p className="text-indigo-200 text-[12px] font-medium leading-relaxed mb-5">
                    Our global support team is available 24/7 for logistics intelligence.
                  </p>
                  <Link href="/contact" className="block text-center w-full h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors border border-white/10">
                    <Headphones className="w-4 h-4" /> Contact Support
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Not Found */}
      {query && !shipment && (
        <section className="py-20 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">Shipment Not Found</h2>
          <p className="text-slate-400 font-medium text-sm">We couldn't find a shipment with ID: <span className="text-slate-800 font-bold">{query}</span></p>
        </section>
      )}

      {/* Placeholder when no result */}
      {!query && (
        <section className="py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-indigo-300" />
          </div>
          <p className="text-slate-400 font-medium text-sm">Enter a tracking ID or AWB above to see real-time shipment intelligence.</p>
        </section>
      )}

    </div>
  );
}
