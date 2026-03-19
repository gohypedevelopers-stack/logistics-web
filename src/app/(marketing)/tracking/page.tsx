"use client";

import { useState } from "react";
import { Search, Plane, CheckCircle2, Clock, Headphones, Download, MapPin } from "lucide-react";
import Link from "next/link";

const DEMO_TRACKING = {
  id: "GN-9482109",
  status: "Customs Cleared",
  statusSub: "New Delhi, India (DEL)",
  estimatedDelivery: "Oct 24, 2024",
  deliveryNote: "By end of day",
  origin: { city: "London, UK", airport: "Heathrow Airport (LHR)" },
  destination: { city: "New Delhi, IN", airport: "Indira Gandhi Int'l (DEL)" },
  weight: "12.5 kg",
  partner: "SkyCargo",
  serviceLevel: "Priority Intelligence",
  timeline: [
    { label: "Customs Cleared", sub: "New Delhi (DEL) Hub — Destination Clearance", time: "Today, 09:42 AM", done: true, active: true },
    { label: "Under Customs Review", sub: "IGI International Airport, Delhi", time: "Today, 04:15 AM", done: true, active: false },
    { label: "Flight Landed in India", sub: "Flight BA143, New Delhi", time: "Yesterday, 11:30 PM", done: true, active: false },
    { label: "In Transit", sub: "Cross-continental Transit Phase", time: "Yesterday, 02:20 PM", done: true, active: false },
    { label: "Flight Departed", sub: "London Heathrow Airport (LHR)", time: "Yesterday, 11:05 AM", done: true, active: false },
    { label: "Dispatched from Origin Warehouse", sub: "London Gateway Hub", time: "Oct 21, 09:12 PM", done: true, active: false },
    { label: "Package Verification Completed", sub: "Origin Facility, London", time: "", done: false, active: false },
    { label: "Shipment Created", sub: "Oct 19, 04:02 PM", time: "", done: false, active: false },
  ],
};

export default function TrackingPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof DEMO_TRACKING | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(DEMO_TRACKING);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">

      {/* ── HERO BANNER ──────────────────────────────── */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* BG */}
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

          {/* Search Bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="Enter Tracking ID (e.g., GN-9482109)"
                className="w-full h-12 bg-white rounded-xl pl-11 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal shadow-lg"
              />
            </div>
            <button
              onClick={handleTrack}
              disabled={loading}
              className="h-12 px-7 bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shrink-0"
            >
              {loading ? "Searching…" : "Track Shipment"}
            </button>
          </div>
        </div>
      </section>

      {/* ── RESULT AREA ──────────────────────────────── */}
      {result && (
        <section className="py-12">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Status Card */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Status</p>
                      <h2 className="text-[26px] font-black text-[#1E1B4B] tracking-tight mb-1">{result.status}</h2>
                      <p className="text-sm font-medium text-slate-500">{result.statusSub}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Estimated Delivery</p>
                      <p className="text-[22px] font-black text-teal-600 tracking-tight">{result.estimatedDelivery}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{result.deliveryNote}</p>
                    </div>
                  </div>

                  {/* Tracking ID pill */}
                  <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#1E1B4B] text-[14px]">ID: {result.id}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Package verification completed at London Gateway</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Workflow */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[17px] font-black text-[#1E1B4B] tracking-tight mb-7">Tracking Workflow</h3>

                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-100"></div>

                    <div className="space-y-0">
                      {result.timeline.map((step, i) => (
                        <div key={i} className="relative flex gap-5 pb-7 last:pb-0">
                          {/* Dot */}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            step.active
                              ? 'bg-[#1E1B4B] border-[#1E1B4B]'
                              : step.done
                              ? 'bg-teal-50 border-teal-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}>
                            {step.active
                              ? <CheckCircle2 className="w-4 h-4 text-white" />
                              : step.done
                              ? <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>
                              : <Clock className="w-3.5 h-3.5 text-slate-300" />
                            }
                          </div>

                          <div className="flex-1 min-w-0 flex items-start justify-between gap-4 pt-2">
                            <div>
                              <p className={`font-bold text-[14px] leading-tight ${step.done ? 'text-[#1E1B4B]' : 'text-slate-400'}`}>{step.label}</p>
                              <p className="text-[12px] font-medium text-slate-400 mt-0.5">{step.sub}</p>
                            </div>
                            {step.time && (
                              <span className={`text-[11px] font-bold tracking-wide shrink-0 whitespace-nowrap px-3 py-1 rounded-lg ${
                                step.active ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
                              }`}>{step.time}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN ── */}
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
                      <p className="font-black text-[#1E1B4B] text-[15px]">{result.origin.city}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{result.origin.airport}</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-4 mb-7 pb-7 border-b border-slate-100">
                    <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
                      <Plane className="w-4 h-4 text-teal-600 rotate-45" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Destination</p>
                      <p className="font-black text-[#1E1B4B] text-[15px]">{result.destination.city}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{result.destination.airport}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    {[
                      { label: "Weight", value: result.weight },
                      { label: "Logistics Partner", value: result.partner },
                      { label: "Service Level", value: result.serviceLevel },
                    ].map((row, i) => (
                      <div key={i} className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-500 font-medium">{row.label}</span>
                        <span className={`font-bold ${i === 2 ? 'text-[#1E1B4B]' : 'text-slate-800'}`}>{row.value}</span>
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
                  <Link href="/contact">
                    <button className="w-full h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-colors border border-white/10">
                      <Headphones className="w-4 h-4" /> Contact Support
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Placeholder when no result */}
      {!result && !loading && (
        <section className="py-20 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-indigo-300" />
          </div>
          <p className="text-slate-400 font-medium text-sm">Enter a tracking ID above to see real-time shipment intelligence.</p>
          <p className="text-slate-300 text-xs mt-1 font-medium">Try demo ID: <span className="font-bold text-indigo-400">GN-9482109</span></p>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 mt-10 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-[#1E1B4B] text-[15px] mb-1">Global Navigator</p>
            <p className="text-[11px] text-slate-400 font-medium">© 2024 Global Navigator Intelligence. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-400">
            {['Privacy Policy', 'Terms of Service', 'Global Compliance', 'Sustainability Report', 'Contact Support'].map(l => (
              <a key={l} href="#" className="hover:text-[#1E1B4B] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
