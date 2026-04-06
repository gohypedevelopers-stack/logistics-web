import { Plane, Anchor, Building2, ShieldCheck, ArrowRight, Check, ChevronDown, Globe2, Zap, Map } from "lucide-react";
import Link from "next/link";

const faqs = [
  { q: "How do I track my international shipment?", a: "You can track your shipment in real-time through our tracking portal using your unique tracking ID provided at booking." },
  { q: "Do you handle hazardous materials on the ITAR list?", a: "We operate within strict compliance frameworks. Certain restricted goods require pre-approval and documentation. Contact our compliance team for specifics." },
  { q: "What insurance options are available for high-value goods?", a: "We offer cargo insurance through our GlobalNavigator Trust program, covering declared values up to $50,000 per shipment." },
];

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end pb-20 pt-32 overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=2000&auto=format&fit=crop"
            alt="Container port"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c2b]/90 via-[#1E1B4B]/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-16 relative z-10 max-w-6xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[10px] font-bold tracking-widest uppercase mb-8">
            <Zap className="w-3 h-3 fill-current" /> Core Services
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 max-w-2xl">
            End-to-End<br />Logistics<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-teal-300">Intelligence</span>
          </h1>
          <p className="text-indigo-100/90 font-medium text-lg max-w-xl leading-relaxed mb-10">
            From final-mile delivery to customs coordination, we simplify complex supply chains with clear visibility and dependable execution.
          </p>
          <Link href="/contact">
            <button className="h-12 px-8 bg-white text-[#1E1B4B] font-black text-sm rounded-xl hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2">
              Talk to a Specialist <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="mb-14">
            <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight mb-3">Our Core Capabilities</h2>
            <p className="text-slate-500 font-medium text-base max-w-lg">Our network is designed to move your business across borders with precision and efficiency.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Air Freight */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Plane className="w-5 h-5 text-[#1E1B4B]" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">Express Available</span>
              </div>
              <h3 className="text-[20px] font-black text-[#1E1B4B] mb-3 tracking-tight">Air Freight</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                Priority cargo movement across major commercial networks with door-to-door visibility for time-sensitive shipments.
              </p>
              <button className="flex items-center gap-2 text-[#1E1B4B] font-bold text-sm hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Ocean Freight */}
            <div className="bg-[#1E1B4B] border border-[#2A377B] rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                    <Anchor className="w-5 h-5 text-[#818CF8]" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200 bg-white/10 border border-white/10 px-2 py-1 rounded-full">FCL / LCL</span>
                </div>
                <h3 className="text-[20px] font-black text-white mb-3 tracking-tight">Ocean Freight</h3>
                <p className="text-indigo-200/80 font-medium text-sm leading-relaxed mb-6">
                  Connected to 12+ ocean carriers for LCL and FCL movement at competitive global rates, linked through major Asian and European export hubs.
                </p>
                <button className="flex items-center gap-2 text-teal-300 font-bold text-sm hover:gap-3 transition-all">
                  More Routes <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warehousing */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <h3 className="text-[20px] font-black text-[#1E1B4B] mb-3 tracking-tight">Warehousing</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                Short-term layover storage and dedicated B2B warehousing with advanced inventory management systems integrated into our platform in real-time.
              </p>
              <button className="flex items-center gap-2 text-[#1E1B4B] font-bold text-sm hover:gap-3 transition-all">
                Explore Facilities <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Customs Brokerage — featured dark */}
            <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-8 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-teal-100 bg-white/15 px-2 py-1 rounded-full">Taxes</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-teal-100 bg-white/15 px-2 py-1 rounded-full">Customs Filing</span>
                  </div>
                </div>
                <h3 className="text-[20px] font-black text-white mb-3 tracking-tight">Customs Brokerage</h3>
                <p className="text-teal-50/80 font-medium text-sm leading-relaxed mb-6">
                  Our licensed brokers support compliant entry for regulated goods, including customs filing and clearance coordination for high-value commercial shipments.
                </p>
                <button className="h-10 px-6 bg-white text-teal-700 font-black text-sm rounded-xl hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 w-max">
                  Contact a Broker <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── NEXT-GEN VISIBILITY ENGINE ───────────────────────────── */}
      <section className="py-24 bg-[#FAFAFD]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-6">
                AI Powered
              </div>
              <h2 className="text-4xl font-black text-[#1E1B4B] tracking-tight leading-tight mb-6">
                Next-Gen<br />Visibility Engine
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed text-base mb-8">
                Real-time shipment visibility with predictive ETA updates, route adjustments, and milestone alerts across your network.
              </p>
              <div className="space-y-4">
                {[
                  { label: "99.8% Forecast Accuracy", desc: "AI predictions validated by monitoring thousands of global flight data inputs" },
                  { label: "Full Document Tracking", desc: "Live monitoring from departure warehouse through clearance verification and delivery" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-teal-600 font-bold" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1E1B4B] text-sm mb-0.5">{item.label}</p>
                      <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
                {/* Fake mini dashboard */}
                <div className="bg-[#1E1B4B] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 tracking-widest">Live Dashboard</span>
                  <div className="w-3"></div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-500">GN-94821 | In Transit | ETA Oct 24</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Air: 84', 'Ocean: 58', 'Docs: 24'].map((s, i) => (
                      <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                        <p className="text-[10px] font-black text-[#1E1B4B]">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {['LHR to DEL | Flight BA-214 | On Time', 'SOU to BOM | Vessel Evergrand | Day 12', 'JFK to CCU | FedEx International | Customs Hold'].map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        <span className="text-[10px] font-medium text-slate-600">{r}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Accent glow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-indigo-300/20 blur-2xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL COVERAGE ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight mb-3">Global Coverage</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">Our operations combine elite partnerships and deep regional expertise right across every major trade lane.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { region: 'London to Mumbai Corridor', tag: '🇬🇧', desc: 'Our flagship UK-India channel: 5-day air / 21-day ocean connections.', tags: ['Air Freight', 'LCL Ocean', 'Overnight Docs'], status: 'Fully Operational' },
              { region: 'NYC to Delhi | Strategic Lane', tag: '🇺🇸', desc: 'Premium B2B tier. Technology and pharmaceutical specialists.', tags: ['Priority Tier', 'Temperature Sensitive', 'Priority Assist'], status: 'High Priority' },
              { region: '130+ Countries', tag: '🌍', desc: 'Full-service shipping capacity across 6 continents and 130+ countries.', tags: [], status: 'Global Reach' },
            ].map((c, i) => (
              <div key={i} className={`rounded-2xl p-7 border ${i === 2 ? 'bg-[#1E1B4B] border-[#2A377B] text-white' : 'bg-slate-50 border-slate-100'} hover:shadow-md transition-all`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-2xl">{c.tag}</span>
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase ${
                    i === 1 ? 'bg-orange-100 text-orange-700' : i === 2 ? 'bg-white/15 text-teal-200' : 'bg-green-100 text-green-700'
                  }`}>{c.status}</span>
                </div>
                <h3 className={`font-black text-[15px] mb-3 tracking-tight ${i === 2 ? 'text-white' : 'text-[#1E1B4B]'}`}>{c.region}</h3>
                <p className={`text-sm font-medium leading-relaxed mb-4 ${i === 2 ? 'text-indigo-200' : 'text-slate-500'}`}>{c.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t, j) => (
                    <span key={j} className={`text-[9px] font-bold px-2.5 py-1 rounded-lg tracking-wide ${i === 2 ? 'bg-white/10 text-indigo-200' : 'bg-white border border-slate-200 text-slate-600'}`}>{t}</span>
                  ))}
                  {i === 2 && (
                    <button className="mt-4 w-full h-10 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
                      <Globe2 className="w-4 h-4" /> View Site Map
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAFAFD]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#1E1B4B] tracking-tight mb-3">Common Inquiries</h2>
            <p className="text-slate-500 font-medium">Answers to common logistics and shipping questions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-slate-100 rounded-2xl p-6 group shadow-sm hover:shadow-md transition-all cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-[#1E1B4B] text-[15px] list-none select-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mt-4 border-t border-slate-50 pt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2A377B] rounded-3xl p-14 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">
                Ready to scale your global<br />operations?
              </h2>
              <p className="text-indigo-100/80 font-medium text-base mb-10 max-w-lg mx-auto leading-relaxed">
                Join over 10,000 businesses navigating the global markets with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="h-13 px-8 py-4 bg-white text-[#1E1B4B] font-black text-sm rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg">
                    Get a Quote
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="h-13 px-8 py-4 bg-white/10 border border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                    Schedule a Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
