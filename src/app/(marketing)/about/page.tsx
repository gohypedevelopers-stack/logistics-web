import { Shield, Eye, Users, Globe2, Award, CheckCircle, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "20+", label: "Countries Delivered To" },
  { value: "15k+", label: "Daily Shipments" },
  { value: "99.8%", label: "On-Time Air Freq." },
  { value: "24/7", label: "Live Intelligence" },
];

const principles = [
  {
    icon: Shield,
    title: "Reliability First",
    desc: "In the world of global trade, uncertainty is the enemy. We solve this through mission-critical processes and enterprise-tier multi-region systems that also guarantee commanding reliability.",
    dark: false,
  },
  {
    icon: Zap,
    title: "Intelligence",
    desc: "Data is only valuable if, through our intelligence system, it has enabled you to make better decisions for tomorrow.",
    dark: true,
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "At no point does a shipment 'disappear.' Every client gets a real 'milestone' map from staging centers across the world.",
    dark: false,
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Our promise is built by engineers, and proved by partners. We measure our success through the growth of the businesses we transport.",
    dark: false,
  },
];

const team = [
  { name: "Arun Mehta", role: "Chief Executive Officer", initials: "AM", bg: "bg-slate-800" },
  { name: "Sarah Chen", role: "Chief Operations Officer", initials: "COO", bg: "bg-slate-200" },
  { name: "David Wilson", role: "Chief Technology Officer", initials: "CTTO", bg: "bg-slate-300" },
  { name: "Sanjay Gupta", role: "Head of India Compliance", initials: "SG", bg: "bg-slate-700" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[10px] font-bold tracking-widest uppercase mb-8">
                <Zap className="w-3 h-3 fill-current" /> Connected Now to the World
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-[#1e4b7a] tracking-tight leading-[1.1] mb-6">
                Intelligence in<br />Every Mile.
              </h1>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-8 max-w-md">
                We are ship2sell - the definitive intelligence layer for international logistics into India. Brilliantly combining regulatory landscapes with precision technology and human expertise.
              </p>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <Globe2 className="w-5 h-5 text-[#1e4b7a] shrink-0" />
                <span>Directly registered across the 20 zones of linkage through unified daily intelligence.</span>
              </div>
            </div>

            {/* Right globe card */}
            <div className="relative">
              <div className="bg-[#1e4b7a] rounded-3xl h-72 flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e4b7a] to-[#0d0c2b]"></div>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, rgba(129,140,248,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#fe6801] to-orange-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <div className="text-center">
                      <p className="text-white font-black text-[13px] tracking-widest leading-tight">GLOBAL</p>
                      <p className="text-orange-200 font-black text-[13px] tracking-widest leading-tight">TRADE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* â”€â”€ STATS BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-[#1e4b7a] py-12">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</p>
                <p className="text-[11px] font-bold text-orange-300 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ SOLVING THE COMPLEX â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-black text-[#1e4b7a] tracking-tight leading-tight">
                Solving the<br />Complex.
              </h2>
            </div>
            <div>
              <p className="text-slate-600 font-medium text-base leading-relaxed mb-6">
                Founded in 2018, ship2sell was born from a singular observation: the logistics industry into India wasn't suffering from a lack of transport, but a lack of transparency.
              </p>
              <p className="text-slate-500 font-medium text-base leading-relaxed">
                India's unique geography and regulatory framework required more than just trucks and ships - it required a navigator. We built a platform that integrates real-time customs intelligence, warehouse licensing, and automated compliance into a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CORE PRINCIPLES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-20 bg-[#FAFAFD]">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-[#1e4b7a] tracking-tight mb-3">Core Principles</h2>
            <p className="text-slate-500 font-medium text-sm">The values that guide us as we work across every border and every mile.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Reliability First (tall left card) */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-[#1e4b7a]" />
              </div>
              <h3 className="text-[18px] font-black text-[#1e4b7a] mb-3 tracking-tight">Reliability First</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                In the world of global trade, uncertainty is the enemy. We solve this through mission-critical processes and enterprise-tier multi-region systems that also guarantee commanding reliability.
              </p>
            </div>

            {/* Warehouse image */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-72 relative">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop"
                alt="Warehouse"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Intelligence - dark */}
            <div className="bg-[#1e4b7a] rounded-2xl p-8 border border-[#1e4b7a] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-5 h-5 text-[#fe6801]" />
                </div>
                <h3 className="text-[18px] font-black text-white mb-3 tracking-tight">Intelligence</h3>
                <p className="text-orange-200/80 font-medium text-sm leading-relaxed">
                  Data is only valuable if, through our intelligence system, it has enabled you to make better decisions for tomorrow.
                </p>
              </div>
            </div>

            {/* Transparency */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-[18px] font-black text-[#1e4b7a] mb-3 tracking-tight">Transparency</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                At no point does a shipment 'disappear'. Every client gets a real 'milestone' map from staging centers across the world.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-[18px] font-black text-[#1e4b7a] mb-3 tracking-tight">Customer First</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Our promise is built by engineers, and proved by partners. We measure our success through the growth of the businesses we transport.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* â”€â”€ GLOBAL LEADERSHIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#1e4b7a] tracking-tight mb-3">Global Leadership</h2>
            <p className="text-slate-500 font-medium text-sm max-w-md mx-auto">Meet the minds redefining the future of Indian logistics through innovation and expertise.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className={`w-full aspect-square rounded-2xl ${member.bg} flex items-center justify-center mb-4 overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-lg transition-all`}>
                  {i === 0 ? (
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : i === 3 ? (
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-2xl font-black text-white/60 tracking-widest">{member.initials}</span>
                  )}
                </div>
                <p className="font-black text-[#1e4b7a] text-[14px] mb-1">{member.name}</p>
                <p className="text-[11px] font-medium text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ COMPLIANCE STANDARDS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-16 bg-[#FAFAFD] border-t border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-black text-[#1e4b7a] mb-2">Global Compliance Standards</h3>
              <p className="text-slate-500 font-medium text-sm">Certified to meet the world's most stringent security and regulatory frameworks.</p>
            </div>
            <div className="flex items-center gap-10 flex-wrap justify-center">
              {['ISO 27001', 'AEO CERTIFIED', 'GDPR COMPLIANT'].map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="font-black text-[#1e4b7a] text-[13px] tracking-wide">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <div className="bg-gradient-to-br from-[#1e4b7a] to-[#1e4b7a] rounded-3xl p-14 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight mb-4">Ready to Navigate?</h2>
              <p className="text-orange-100/80 font-medium text-base mb-10 max-w-lg mx-auto leading-relaxed">
                Join 2,500+ global brands leveraging our multi-partner platform to scale their operations to India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="px-8 py-4 bg-orange-400 text-[#1e4b7a] font-black text-sm rounded-2xl hover:bg-orange-300 transition-colors shadow-lg">
                    Start Planning
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                    Talk to an Expert
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


