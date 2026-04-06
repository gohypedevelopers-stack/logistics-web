import { Package, Zap, Globe2, BarChart2, Truck, MessageSquare, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const flowSteps = [
  { num: "01", title: "Premium Pickup", desc: "Our certified pickup agents come to your door on time, verifying cargo weight and packing class." },
  { num: "02", title: "Smart Transit", desc: "Optimized across our freight network for speed, visibility, and reliable handoffs." },
  { num: "03", title: "Digital Customs", desc: "All documentation and clearance processed digitally from our centralized intelligence platform." },
  { num: "04", title: "Final Delivery", desc: "Certified delivery teams complete each shipment with live confirmation and status updates." },
];

const intelFeatures = [
  { title: "Customs Engine", desc: "Advanced algorithms flag compliance risks with 200+ regulatory rules." },
  { title: "IoT Sensors", desc: "Temperature, humidity, and location sensors streaming live to your dashboard." },
  { title: "Blockchain Audit Trail", desc: "Immutable audit logs keep shipment documentation secure and traceable." },
  { title: "Control Desk", desc: "Human experts monitoring high-value or sensitive cargo around the clock." },
];

const testimonials = [
  {
    quote: "We moved medical prototypes from Germany to Italy with complete confidence. Global Navigator's reliability insights gave our surgical team the assurance it needed.",
    name: "Arun Mehta",
    role: "HEAD OF OPS, BIOTECH GLOBAL",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&fit=crop",
  },
  {
    quote: "Predictive alerts saved us three days during peak distribution. Their alerting workflow improved our tracking accuracy by 8%.",
    name: "Sarah Collins",
    role: "SUPPLY CHAIN DIRECTOR, FINSURE LTD",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop",
  },
];

export default function CustomerExperiencePage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold tracking-widest uppercase mb-8">
                Customer Experience
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#1E1B4B] tracking-tight leading-[1.1] mb-6">
                Beyond<br />Logistics:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-teal-400">An Exceptional<br />Journey</span>
              </h1>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-10 max-w-md">
                Global Navigator delivers high-value cargo with clarity, control, and consistent communication from origin to destination.
              </p>
              <div className="flex gap-4">
                <Link href="/register">
                  <button className="h-11 px-7 bg-[#1E1B4B] text-white font-bold text-sm rounded-xl hover:bg-[#2A377B] transition-colors shadow-md flex items-center gap-2">
                    Track a Journey <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: airplane photo card */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden h-80 shadow-xl border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop"
                  alt="Cargo Plane"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-black text-[#1E1B4B] text-[12px]">Customs Verified</p>
                  <p className="text-[10px] text-slate-500 font-medium">Indira Gandhi, August 24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ORIGIN TO DESTINATION FLOW ────────────── */}
      <section className="py-20 bg-[#FAFAFD]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-[28px] font-black text-[#1E1B4B] tracking-tight mb-3">The Origin-to-Destination Flow</h2>
            <p className="text-slate-500 font-medium text-sm">From a single warehouse to a global doorstep, refined at every step of the journey.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flowSteps.map((step, i) => (
              <div key={i} className={`rounded-2xl p-7 border transition-all hover:shadow-md ${i === 1 ? 'bg-[#1E1B4B] border-[#2A377B] text-white' : 'bg-white border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${i === 1 ? 'bg-white/15' : 'bg-indigo-50'}`}>
                  {i === 0 && <Package className="w-5 h-5 text-[#1E1B4B]" />}
                  {i === 1 && <Zap className="w-5 h-5 text-[#818CF8]" />}
                  {i === 2 && <Globe2 className="w-5 h-5 text-[#1E1B4B]" />}
                  {i === 3 && <Truck className="w-5 h-5 text-[#1E1B4B]" />}
                </div>
                <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${i === 1 ? 'text-indigo-300' : 'text-slate-400'}`}>{step.num}</p>
                <h3 className={`font-black text-[15px] mb-2 ${i === 1 ? 'text-white' : 'text-[#1E1B4B]'}`}>{step.title}</h3>
                <p className={`text-[12px] font-medium leading-relaxed ${i === 1 ? 'text-indigo-200' : 'text-slate-500'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE BEHIND THE TRANSIT ───────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: 4 mini cards */}
            <div className="grid grid-cols-2 gap-5">
              {intelFeatures.map((feat, i) => (
                <div key={i} className={`rounded-2xl p-6 border ${i === 1 ? 'bg-[#1E1B4B] border-[#2A377B]' : 'bg-slate-50 border-slate-100'} hover:shadow-md transition-all`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${i === 1 ? 'bg-white/15' : 'bg-indigo-50'}`}>
                    {i === 0 && <Globe2 className="w-4 h-4 text-[#1E1B4B]" />}
                    {i === 1 && <BarChart2 className="w-4 h-4 text-[#818CF8]" />}
                    {i === 2 && <Package className="w-4 h-4 text-[#1E1B4B]" />}
                    {i === 3 && <MessageSquare className="w-4 h-4 text-[#1E1B4B]" />}
                  </div>
                  <h4 className={`font-black text-[13px] mb-1.5 ${i === 1 ? 'text-white' : 'text-[#1E1B4B]'}`}>{feat.title}</h4>
                  <p className={`text-[11px] font-medium leading-relaxed ${i === 1 ? 'text-indigo-200' : 'text-slate-500'}`}>{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Right: text */}
            <div>
              <h2 className="text-[32px] font-black text-[#1E1B4B] tracking-tight leading-tight mb-6">
                The Intelligence Behind<br />the Transit.
              </h2>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-8">
                We don't just move boxes. We manage data. Our proprietary technology layer sits above the physical network, ensuring that you are never left wondering about status, conditions or ETA.
              </p>
              <div className="space-y-4">
                {[
                  { label: "Live ETA Tracking", desc: "Real-time ETA visibility across key milestones and delivery checkpoints." },
                  { label: "Condition Monitoring", desc: "Ongoing oversight for high-value electronics, healthcare shipments, and sensitive cargo." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mt-0.5 shrink-0">
                      <Check className="w-3 h-3 text-teal-600" />
                    </div>
                    <div>
                      <span className="font-bold text-[#1E1B4B] text-sm">{item.label}</span>
                      <span className="text-slate-500 text-sm font-medium"> - {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL SUPPORT LOCAL EXPERTISE ───────── */}
      <section className="py-20 bg-[#1E1B4B]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[32px] font-black text-white tracking-tight leading-tight mb-6">
                Global Support,<br />Local Expertise
              </h2>
              <p className="text-indigo-200 font-medium text-base leading-relaxed mb-10">
                When you need support, you need it quickly. Our teams in London, Mumbai, and New York provide informed guidance with local operational context.
              </p>
              <div className="grid grid-cols-3 gap-8 mb-8">
                {[{ val: "24/7", label: "Global Support" }, { val: "15m", label: "Response Time" }, { val: "50+", label: "Specialists" }].map((s, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black text-white tracking-tight mb-1">{s.val}</p>
                    <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chat UI mockup */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
              <div className="space-y-3 mb-5">
                {[
                  { label: "Customer Support", msg: "My shipment GN-94821 has reached customs. Can you expedite clearance?", ours: false },
                  { label: "Mumbai Operations Hub", msg: "This shipment has been escalated to our senior clearance broker. Expected clearance time is 90 minutes.", ours: true },
                ].map((msg, i) => (
                  <div key={i} className={`flex items-start gap-3 ${msg.ours ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black ${msg.ours ? 'bg-teal-500 text-white' : 'bg-indigo-200 text-[#1E1B4B]'}`}>
                      {msg.ours ? 'GN' : 'YOU'}
                    </div>
                    <div className={`rounded-2xl p-4 max-w-[80%] ${msg.ours ? 'bg-[#2A377B] text-white' : 'bg-white text-[#1E1B4B]'}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${msg.ours ? 'text-indigo-300' : 'text-slate-400'}`}>{msg.label}</p>
                      <p className="text-[12px] font-medium leading-relaxed">{msg.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full h-11 bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Initiate Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-black text-[#1E1B4B] tracking-tight mb-3">Trusted by Global Leaders</h2>
            <p className="text-slate-500 font-medium text-sm">Hear from businesses that have entrusted their most critical shipments with Global Navigator.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-8 hover:shadow-md transition-all">
                <p className="text-slate-600 font-medium text-[15px] leading-relaxed mb-8 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" loading="lazy" />
                  <div>
                    <p className="font-black text-[#1E1B4B] text-[14px]">{t.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────── */}
      <section className="py-20 bg-[#1E1B4B] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Experience the<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-teal-300">Navigator Difference.</span>
          </h2>
          <p className="text-indigo-200 font-medium text-base mb-12 max-w-lg mx-auto leading-relaxed">
            Ready to turn your shipping workflow into a strategic advantage?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="px-8 py-4 bg-teal-400 text-[#1E1B4B] font-black text-sm rounded-2xl hover:bg-teal-300 transition-colors shadow-lg">
                Request a Personalized Demo
              </button>
            </Link>
            <Link href="/contact">
              <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                Speak with a Specialist
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="border-t border-slate-700/30 py-10 bg-[#0d0c2b]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white text-[15px] mb-1">Global Navigator</p>
            <p className="text-[11px] text-indigo-400 font-medium">Logistics intelligence for the modern world.</p>
            <p className="text-[10px] text-slate-600 font-medium mt-1">Copyright 2024 Global Navigator Logistics. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-500">
            {['Privacy Policy', 'Terms of Service', 'Global Compliance', 'Contact Support', 'Carrier Relations'].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
