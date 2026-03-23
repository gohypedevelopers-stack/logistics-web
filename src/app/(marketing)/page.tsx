import Link from "next/link";
import { Search, Plane, Shield, MessageSquare, ArrowRight, Anchor, Zap, Globe2, Truck, CheckCircle2, PackageCheck, Activity, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      
      {/* HERO SECTION - RECENTLY RESTORED TO FULL-WIDTH STYLE */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[85vh] pt-24 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/hero-bg.png" alt="Global high-tech logistics network" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1E1B4B]/50"></div>
          {/* Smooth fade-out at bottom connecting to next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E1B4B]/20 to-white"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-teal-300 border border-teal-300/30 font-black text-[10px] tracking-widest uppercase mb-10 backdrop-blur-xl shadow-2xl">
            <Zap className="w-3.5 h-3.5 fill-teal-300" /> Next-Gen Global Logistics
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)]">
            Global Movement<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-[#C4E9EC]">Perfected.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white/90 mb-14 max-w-3xl font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            The ultimate intelligence layer for international shipping. We combine high-speed air cargo with precision ground networks to deliver into India with unmatched transparency.
          </p>

          <form action={async (formData) => {
            "use server";
            const id = formData.get("id");
            if (id) {
              const { redirect } = await import("next/navigation");
              redirect(`/tracking?id=${id}`);
            }
          }} className="flex flex-col sm:flex-row bg-white/20 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 w-full max-w-3xl focus-within:ring-4 ring-indigo-500/50 transition-all gap-2">
            <div className="flex-1 flex items-center bg-white rounded-2xl px-5 h-16 w-full shadow-lg">
              <Search className="w-6 h-6 text-slate-400 mr-4" />
              <input 
                name="id"
                type="text" 
                placeholder="Enter tracking ID or AWB..." 
                className="w-full h-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-bold text-base md:text-lg"
              />
            </div>
            <button type="submit" className="h-16 px-10 text-white bg-[#1E1B4B] hover:bg-[#2D2A6E] transition-all font-black tracking-wide text-sm rounded-2xl whitespace-nowrap shadow-xl flex items-center justify-center">
              Track Journey
            </button>
          </form>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: "2,500+", label: "Daily Shipments" },
              { val: "19k", label: "Pin Codes Covered" },
              { val: "99.9%", label: "On-Time Delivery" },
              { val: "24/7", label: "Global Live Support" },
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left border-l-2 md:border-l-0 md:border-t-2 border-indigo-100 md:pt-4 pl-4 md:pl-0">
                <p className="text-3xl font-black text-[#1E1B4B] tracking-tight">{s.val}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE STEP EXPERIENCE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1E1B4B] tracking-tight mb-4 text-balance">Simple Journeys. Extraordinary Logic.</h2>
            <p className="text-slate-500 font-medium text-[15px] max-w-xl mx-auto">We've removed the complexity from global shipping. One platform, total control.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                icon: PackageCheck, 
                title: "Register & Book", 
                desc: "Create your free account and book your shipment in under 2 minutes. No contracts required." 
              },
              { 
                step: "02", 
                icon: Activity, 
                title: "Collect & Verify", 
                desc: "Our agents collect from your door, verifying cargo class and weight for absolute quote accuracy." 
              },
              { 
                step: "03", 
                icon: Globe2, 
                title: "Track & Release", 
                desc: "Monitor your parcel move across continents. Automated customs clearance handles the rest." 
              },
            ].map((s, i) => (
              <div key={i} className="group relative bg-slate-50 border border-slate-100 p-10 rounded-[32px] hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                    <s.icon className="w-6 h-6 text-[#1E1B4B]" />
                 </div>
                 <p className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em] mb-3">{s.step} Experience</p>
                 <h3 className="text-xl font-black text-[#1E1B4B] mb-4">{s.title}</h3>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl text-center">
           <h2 className="text-[32px] font-black text-[#1E1B4B] tracking-tight mb-16">Intelligence in Every Corridor.</h2>
           
           <div className="grid md:grid-cols-3 gap-6">
              {/* Air Cargo */}
              <div className="bg-[#1E1B4B] text-white p-10 rounded-[40px] text-left flex flex-col justify-between h-[450px] relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                       <Plane className="w-6 h-6 text-[#818CF8]" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Priority<br />Air Cargo</h3>
                    <p className="text-indigo-200/80 font-medium text-sm leading-relaxed">The fastest route for high-value electronics, personal essentials, and time-critical deliveries into India.</p>
                 </div>
                 <Link href="/services" className="relative z-10 w-max h-12 px-8 bg-teal-400 hover:bg-teal-300 text-[#1E1B4B] font-black text-sm rounded-xl flex items-center transition-colors">
                    Check Air Rates
                 </Link>
              </div>

              {/* Surface Network */}
              <div className="bg-white p-10 rounded-[40px] text-left flex flex-col justify-between h-[450px] border border-slate-100 shadow-sm relative group overflow-hidden">
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50 transition-colors"></div>
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                       <Truck className="w-6 h-6 text-[#1E1B4B]" />
                    </div>
                    <h3 className="text-3xl font-black text-[#1E1B4B] mb-4">Last-Mile<br />Network</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Delivery reaching 19,000+ pin codes. From Bengaluru's tech hubs to Mumbai's financial center.</p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span className="text-xs font-bold text-slate-700">Digital Proof of Delivery</span>
                       </div>
                    </div>
                 </div>
                 <Link href="/services" className="relative z-10 text-[13px] font-black text-[#1E1B4B] hover:translate-x-2 transition-transform inline-flex items-center gap-2 uppercase tracking-widest">
                    Manage Network <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>

              {/* Customs Engine */}
              <div className="bg-white p-10 rounded-[40px] text-left flex flex-col justify-between h-[450px] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8">
                       <BarChart3 className="w-6 h-6 text-[#1E1B4B]" />
                    </div>
                    <h3 className="text-3xl font-black text-[#1E1B4B] mb-4">Customs<br />Intelligence</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Automated duty calculations and digital pre-clearance to avoid any landing delays.</p>
                 </div>
                 <div className="relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Platform Health</p>
                    <div className="flex justify-center gap-1">
                       {[...Array(8)].map((_, i) => (
                         <div key={i} className="w-1.5 h-6 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
                       ))}
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
          <div className="bg-gradient-to-br from-[#1E1B4B] to-[#2A377B] rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Ready to Ship Globally?</h2>
              <p className="text-indigo-100/90 font-medium text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Join 10,000+ individuals and brands using our intelligence engine for seamless international movement.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
                <Link href="/register">
                  <button className="px-10 py-5 bg-teal-400 text-[#1E1B4B] font-black text-sm rounded-2xl hover:bg-teal-300 transition-all hover:scale-105 shadow-xl">
                    Create Free Account
                  </button>
                </Link>
                <Link href="/services">
                  <button className="px-10 py-5 bg-white/10 border border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm">
                    Explore Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUPLICATE FOOTER REMOVED - Using Layout Footer instead */}
    </div>
  );
}
