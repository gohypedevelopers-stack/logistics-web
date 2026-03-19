"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, Activity, ShieldCheck, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const carriers = [
  { name: "SkyCargo", sub: "Premium Air Freight", initials: "SC", bg: "bg-green-100 text-green-700", level: "Priority", levelColor: "bg-orange-500 text-white", transit: "2–4 Business Days", rate: "$12.40", rateNote: "" },
  { name: "Maersk", sub: "LCL Container Service", initials: "MK", bg: "bg-blue-100 text-blue-700", level: "Economy", levelColor: "bg-slate-200 text-slate-700", transit: "18–24 Business Days", rate: "$3.85", rateNote: "" },
  { name: "FedEx", sub: "Direct Door Courier", initials: "FX", bg: "bg-red-100 text-red-700", level: "Express", levelColor: "bg-[#1E1B4B] text-white", transit: "3–5 Business Days", rate: "$15.90", rateNote: "" },
];

const faqs = [
  {
    q: "How are rates calculated?",
    a: "Rates are calculated based on 'Dimensional Weight' — a calculation of actual weight plus the volume your cargo occupies. We also factor in current fuel surcharges and seasonal demand peaks.",
  },
  {
    q: "Are there hidden fees?",
    a: "Absolutely not. Our quotes are all-inclusive, including terminal handling and fees, destination customs clearance, local taxes or duties at the destination and the one optional variables.",
  },
  {
    q: "Can I lock in a rate for future shipments?",
    a: "Yes, for enterprise clients, we offer 'fixed rates' up to 90 days in advance to help you manage your supply chain budget with absolute certainty.",
  },
];

const included = [
  { icon: FileText, title: "Customs Documentation", desc: "Automated generation of Bill of Lading, Commercial Invoices, and Packing Lists." },
  { icon: Activity, title: "Real-Time Tracking", desc: "First-class GPS monitoring from factory floor to final destination port." },
  { icon: ShieldCheck, title: "Standard Insurance", desc: "Shipment protection covering up to $50,000 in value on all standard routes." },
];

export default function PricingPage() {
  const [origin, setOrigin] = useState("United Kingdom (UK)");
  const [dest] = useState("India");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#F8F9FC] min-h-screen font-sans">

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-white pt-28 pb-16 border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold tracking-widest uppercase mb-8">
                Global Logistics
              </div>
              <h1 className="text-5xl font-black text-[#1E1B4B] tracking-tight leading-[1.1] mb-6">
                Transparent<br />Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-teal-400">Global<br />Logistics</span>
              </h1>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-10 max-w-md">
                Navigate the complexities of international trade with real-time rate intelligence. No hidden surcharges — just clarity across every border.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/register">
                  <button className="h-11 px-7 bg-[#1E1B4B] text-white font-bold text-sm rounded-xl hover:bg-[#2A377B] transition-colors shadow-md flex items-center gap-2">
                    Start Shipping <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <button className="h-11 px-7 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  View API Documentation
                </button>
              </div>
            </div>

            {/* Right — port photo */}
            <div className="rounded-2xl overflow-hidden h-64 lg:h-80 shadow-xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop"
                alt="Container port"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── INSTANT RATE CALCULATOR ───────────────────── */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#1E1B4B]" />
              </div>
              <h2 className="text-[16px] font-black text-[#1E1B4B]">Instant Rate Calculator</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Origin Country</label>
                <select
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 ring-indigo-500/20 appearance-none"
                >
                  <option>United Kingdom (UK)</option>
                  <option>United States (US)</option>
                  <option>Germany (DE)</option>
                  <option>France (FR)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Destination</label>
                <div className="relative">
                  <div className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center text-sm font-bold text-slate-500 cursor-not-allowed">
                    India
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-500">IN</span>
                  </div>
                </div>
              </div>
              <button className="h-11 bg-[#1E1B4B] text-white font-bold text-sm rounded-xl hover:bg-[#2A377B] transition-colors shadow-md">
                Update Results ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────── */}
      <section className="py-6 pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-[26px] font-black text-[#1E1B4B] tracking-tight mb-2">Market Comparative Rates</h2>
            <p className="text-slate-500 font-medium text-sm">Live calculations based on current network demand at full tailoring.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F4F5F9] border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Logistics Provider</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Level</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Transit Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cost Per KG</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {carriers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl text-[11px] font-black flex items-center justify-center shrink-0 ${c.bg}`}>
                            {c.initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#1E1B4B] text-[13px]">{c.name}</p>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">{c.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${c.levelColor}`}>{c.level}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-semibold text-slate-600">{c.transit}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[18px] font-black text-[#1E1B4B] tracking-tight">{c.rate}</span>
                      </td>
                      <td className="px-6 py-5">
                        <button className="h-9 px-5 rounded-xl bg-slate-100 hover:bg-[#1E1B4B] hover:text-white text-slate-700 font-bold text-[12px] transition-colors">
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/50">
              <p className="text-[11px] font-medium text-slate-400">Showing top results for Singapore routing. For other periods, please see our <span className="text-[#1E1B4B] font-bold cursor-pointer underline underline-offset-2">detailed matrix</span>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPREHENSIVE VALUE ───────────────────────── */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-black text-[#1E1B4B] tracking-tight mb-3">Comprehensive Value</h2>
            <p className="text-slate-500 font-medium text-sm">Every rate includes our full-service intelligence suite as standard. No surprise add-ons.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {included.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#1E1B4B]" />
                </div>
                <h3 className="font-black text-[#1E1B4B] text-[15px] mb-2">{title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-black text-[#1E1B4B] tracking-tight mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-[#1E1B4B] text-[14px]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 border-t border-slate-50">
                    <p className="text-slate-500 text-sm font-medium leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2A377B] rounded-3xl p-14 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight mb-4">Ready for precise logistics?</h2>
              <p className="text-indigo-100/80 font-medium text-base mb-10 max-w-lg mx-auto leading-relaxed">
                Join 2,500+ global businesses operating their trade routes with our all-in price platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="px-8 py-4 bg-teal-400 text-[#1E1B4B] font-black text-sm rounded-2xl hover:bg-teal-300 transition-colors shadow-lg">
                    Get a Custom Quote
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-10 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-[#1E1B4B] text-[15px] mb-1">Global Navigator</p>
            <p className="text-[11px] text-slate-400 font-medium">© 2024 Global Navigator Logistics. All rights reserved.</p>
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
