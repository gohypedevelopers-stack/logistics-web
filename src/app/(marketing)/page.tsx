import Link from "next/link";
import { Search, MapPin, Building, Info, Shield, MessageSquare, ArrowRight, Anchor, Zap, Map, Check, Activity, Globe2, Truck, CheckCircle2, Plane } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-[#1E1B4B]">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden flex items-center justify-center min-h-[90vh] pt-24 pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src="/bg.jpg" alt="Containers stacked at port" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#1E1B4B]/30"></div>
          {/* Smooth fade-out at bottom connecting to next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F8FAFC]/50 to-[#F8FAFC]"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center text-center mt-8">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-teal-300 border border-teal-300/30 font-bold text-xs tracking-widest uppercase mb-10 backdrop-blur-xl shadow-2xl">
            <Zap className="w-4 h-4 fill-teal-300" /> Next-Gen Logistics
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.15] text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            Global Logistics,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-[#C4E9EC] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">Local Reliability.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white mb-14 max-w-3xl font-semibold leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Navigate complex international shipping with the clarity of a premium financial journal. Fast, secure, and intelligent delivery to India and beyond.
          </p>

          <div className="flex flex-col sm:flex-row bg-white/20 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-2 w-full max-w-3xl focus-within:ring-4 ring-indigo-500/50 transition-all gap-2">
            <div className="flex-1 flex items-center bg-white rounded-2xl px-5 h-16 w-full shadow-lg">
              <Search className="w-6 h-6 text-slate-400 mr-4" />
              <input 
                type="text" 
                placeholder="Enter tracking number (e.g. GM-12345)" 
                className="w-full h-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-bold text-base md:text-lg"
              />
            </div>
            <Button className="h-16 px-10 text-white bg-[#6366F1] hover:bg-indigo-400 transition-colors font-extrabold tracking-wide text-base rounded-2xl whitespace-nowrap shadow-xl w-full sm:w-auto">
              Track Shipment
            </Button>
          </div>
        </div>
      </section>

      {/* STREAMLINED INTELLIGENCE */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
           <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4">Streamlined Intelligence</h2>
           <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-sm leading-relaxed font-medium">
             Our three-step process is designed for clarity, moving your shipments from origin to destination without the traditional friction of global logistics.
           </p>

           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group">
                 <div className="w-10 h-10 rounded-xl bg-[#1E1B4B] text-white font-bold flex items-center justify-center mb-6 text-sm shadow-md">
                    1
                 </div>
                 <h3 className="text-lg font-bold text-[#1E1B4B] mb-3">Create</h3>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   Book your shipment online in seconds. Our intelligent platform calculates all taxes and duties upfront—no hidden surprises.
                 </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group">
                 <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center mb-6 text-sm shadow-sm">
                    2
                 </div>
                 <h3 className="text-lg font-bold text-[#1E1B4B] mb-3">Ship</h3>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   Drop off your package at one of our 5,000+ global hubs or schedule a doorstep pickup. We handle the heavy lifting.
                 </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left relative overflow-hidden group">
                 <div className="w-10 h-10 rounded-xl bg-[#1E1B4B] text-white font-bold flex items-center justify-center mb-6 text-sm shadow-md">
                    3
                 </div>
                 <h3 className="text-lg font-bold text-[#1E1B4B] mb-3">Track</h3>
                 <p className="text-slate-500 text-sm leading-relaxed font-medium">
                   Watch your shipment move across the globe in real-time. Full transparency from airport terminal to the final mile.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* THE GLOBAL SERVICE SUITE */}
      <section className="py-24 bg-[#F8FAFC]">
         <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
               <div>
                 <h2 className="text-3xl font-bold text-[#1E1B4B] mb-3">The Global Service Suite</h2>
                 <p className="text-slate-500 text-sm font-medium">Tailored shipping options that balance speed, cost, and complexity.</p>
               </div>
               <Link href="/services" className="text-[#1E1B4B] font-bold text-sm tracking-wide hover:underline flex items-center">
                 View All Services <ArrowRight className="w-4 h-4 ml-1" />
               </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {/* Priority Air Freight (Span 2) */}
               <div className="md:col-span-2 bg-[#2D2A6E] text-white p-10 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                 <div className="relative z-10">
                    <Plane className="w-8 h-8 mb-8 text-indigo-300" />
                    <h3 className="text-2xl font-bold mb-4">Priority Air Freight</h3>
                    <p className="text-indigo-200/80 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                       3-5 Day transit times globally. Ideal for high-value goods, electronics, and time-sensitive commercial inventory.
                    </p>
                 </div>
                 <Button className="bg-[#818CF8] hover:bg-indigo-400 text-white font-bold tracking-wide text-sm rounded-lg self-start h-12 px-8 shadow-md relative z-10 transition-colors">
                    Estimate Air Freight
                 </Button>
               </div>

               {/* Express Courier (Span 1) */}
               <div className="md:col-span-1 bg-[#CCFBF1] p-10 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                     <Zap className="w-8 h-8 mb-8 text-teal-700 fill-teal-700" />
                     <h3 className="text-2xl font-bold mb-4 text-[#1E1B4B]">Express Courier</h3>
                     <p className="text-teal-900/70 text-sm font-medium leading-relaxed mb-10">
                       Premium door-to-door service with guaranteed delivery windows. Includes automated customs clearance.
                     </p>
                  </div>
                  <Link href="/services" className="text-teal-800 font-bold text-sm hover:underline flex items-center group">
                    Book Express <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

               {/* LCL/FCL Ocean (Span 1) */}
               <div className="md:col-span-1 bg-[#F1F5F9] p-10 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                     <Anchor className="w-8 h-8 mb-8 text-slate-500" />
                     <h3 className="text-2xl font-bold mb-4 text-[#1E1B4B]">LCL/FCL Ocean</h3>
                     <p className="text-slate-600 text-sm font-medium leading-relaxed mb-10">
                       Cost-optimized solutions for large shipments. Perfect for bulk inventory and moving household goods.
                     </p>
                  </div>
                  <Link href="/services" className="text-[#1E1B4B] font-bold text-sm hover:underline flex items-center group">
                    Request Quote <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

               {/* The India Corridor (Span 2) */}
               <div className="md:col-span-2 bg-white border border-slate-200/80 p-10 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="max-w-md">
                    <div className="inline-flex items-center gap-2 mb-4 px-2 py-1 bg-slate-50 border border-slate-100 rounded text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#1E1B4B] text-white" />
                      <span className="text-[10px] font-bold tracking-widest text-[#1E1B4B] uppercase">Market Specialist</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-[#1E1B4B]">The India Corridor</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      Specialized end-to-end logistics from UK, USA, and UAE specifically for the Indian market. Local delivery expertise in 19,000+ pin codes.
                    </p>
                  </div>
                  <div className="w-32 h-32 bg-[#F8FAFC] rounded-xl hidden md:flex items-center justify-center relative overflow-hidden mx-6 border border-slate-100">
                     <svg className="w-16 h-16 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* WHY TRUST / GLOBAL REACH */}
      <section className="py-24 bg-[#F8FAFC]">
         <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-start">
            
            <div className="pr-4">
               <h2 className="text-3xl font-bold text-[#1E1B4B] mb-4">Why Trust Global Navigator?</h2>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-12 max-w-md">
                 We've built our reputation on the "No-Line" principle: transparent service without the fine-print barriers.
               </p>

               <div className="space-y-10">
                  <div className="flex gap-5">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-[#1E1B4B]" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-[#1E1B4B] mb-2">Unmatched Safety</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">Every shipment is insured and tracked with redundant GPS sensors. Your cargo is our mission.</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-5">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-[#1E1B4B]" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-[#1E1B4B] mb-2">Customs Expertise</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">In-house brokerage team specializing in Indian DGFT and CBIC regulations to ensure zero delays.</p>
                     </div>
                  </div>

                  <div className="flex gap-5">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-[#1E1B4B]" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-[#1E1B4B] mb-2">Concierge Support</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">Human experts available 24/7. No chatbots, no loops—just logistical intelligence when you need it.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#F1F5F9] p-10 rounded-3xl border border-[#E2E8F0]">
               <h3 className="text-xl font-bold text-[#1E1B4B] mb-3">Our Global Reach</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                  Direct shipping lanes active daily from key international commerce hubs.
               </p>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
                  <div className="bg-white py-3 px-4 rounded-lg border border-slate-200 text-center shadow-sm">
                     <p className="font-bold text-[#1E1B4B] text-sm">UK</p>
                     <p className="text-[10px] text-slate-400 font-medium">London Hub</p>
                  </div>
                  <div className="bg-white py-3 px-4 rounded-lg border border-slate-200 text-center shadow-sm">
                     <p className="font-bold text-[#1E1B4B] text-sm">USA</p>
                     <p className="text-[10px] text-slate-400 font-medium">NY & LA Hubs</p>
                  </div>
                  <div className="bg-white py-3 px-4 rounded-lg border border-slate-200 text-center shadow-sm">
                     <p className="font-bold text-[#1E1B4B] text-sm">UAE</p>
                     <p className="text-[10px] text-slate-400 font-medium">Dubai Hub</p>
                  </div>
                  <div className="bg-white py-3 px-4 rounded-lg border border-slate-200 text-center shadow-sm">
                     <p className="font-bold text-[#1E1B4B] text-sm">Germany</p>
                     <p className="text-[10px] text-slate-400 font-medium">Frankfurt Hub</p>
                  </div>
                  <div className="bg-white py-3 px-4 rounded-lg border border-slate-200 text-center shadow-sm">
                     <p className="font-bold text-[#1E1B4B] text-sm">Canada</p>
                     <p className="text-[10px] text-slate-400 font-medium">Toronto Hub</p>
                  </div>
                  <div className="bg-[#416864] py-3 px-4 rounded-lg border border-[#416864] text-center shadow-sm">
                     <p className="font-bold text-white text-sm">India</p>
                     <p className="text-[10px] text-slate-200 font-medium">Final Delivery</p>
                  </div>
               </div>

               <div className="w-full relative opacity-60 mix-blend-multiply">
                  <svg viewBox="0 0 1000 450" className="w-full h-auto text-[#94A3B8]" fill="currentColor">
                     <path d="M100.5 400.2c-5.8 0-10.4-4.7-10.4-10.4 0-5.8 4.7-10.4 10.4-10.4 5.8 0 10.4 4.7 10.4 10.4.1 5.8-4.6 10.4-10.4 10.4zm30.3-5.2c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm200.8-150.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm10.4 200.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.4 5.2-5.2 5.2zm-40-50.6c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm-25.2-30.2c-2.9 0-5.2-2.3-5.2-5.2 0-2.9 2.3-5.2 5.2-5.2s5.2 2.3 5.2 5.2c.1 2.9-2.3 5.2-5.2 5.2zm282.8-100.8c-5.8 0-10.4-4.7-10.4-10.4 0-5.8 4.7-10.4 10.4-10.4 5.8 0 10.4 4.7 10.4 10.4.1 5.7-4.6 10.4-10.4 10.4zm40.3-25.4c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2c0 2.9-2.3 5.2-5.2 5.2zm60.2 120.8c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm40.2 60.1c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm105.4-80.4c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zm-200.2-20.5c-2.9 0-5.2-2.3-5.2-5.2s2.3-5.2 5.2-5.2 5.2 2.3 5.2 5.2-2.3 5.2-5.2 5.2zM277 150.3c60.2 0 120.4 20.3 120.4 60.2v60.2H277v-120.4zm481.5 80.3c-60.2 0-120.4-20.3-120.4-60.2V110.2h120.4v120.4z" clipRule="evenodd"/>
                     {/* Added a few stylized continents blocks for visual match */}
                     <path d="M120 180 q 20 -20 50 -10 t 40 30 t -20 60 t -60 20 t -30 -60 z" className="text-[#94A3B8] opacity-80" />
                     <path d="M400 120 q 20 -40 80 -20 t 60 50 t -10 80 t -90 40 t -60 -60 z" className="text-[#94A3B8] opacity-80" />
                     <path d="M280 320 q 10 -30 40 -20 t 30 30 t -10 60 t -50 20 t -30 -50 z" className="text-[#94A3B8] opacity-80" />
                     <path d="M600 200 q 40 -80 120 -40 t 80 100 t -20 120 t -140 60 t -80 -120 z" className="text-[#94A3B8] opacity-80" />
                     <path d="M850 350 q 20 -30 60 -10 t 40 50 t -30 70 t -70 20 t -20 -80 z" className="text-[#94A3B8] opacity-80" />
                  </svg>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-[#1E1B4B] py-24 text-center border-b border-[#2D2A6E]">
        <div className="container mx-auto px-6">
           <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to simplify your global<br className="hidden md:block" /> logistics?</h2>
           <p className="text-indigo-200 text-sm font-medium mb-10 max-w-lg mx-auto">Join over 10,000 businesses navigating the global markets with confidence.</p>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="h-12 px-8 bg-white hover:bg-slate-100 text-[#1E1B4B] font-bold text-sm rounded-md w-full sm:w-auto">
                 Start Shipping Today
              </Button>
              <Button variant="outline" className="h-12 px-8 border-indigo-400 text-white hover:bg-indigo-900/50 font-bold text-sm rounded-md w-full sm:w-auto">
                 Request a Custom Quote
              </Button>
           </div>
        </div>
      </section>

    </div>
  );
}
