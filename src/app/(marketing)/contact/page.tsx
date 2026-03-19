import { MapPin, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-40 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="max-w-3xl mb-16">
           <h2 className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
              <span className="w-8 h-px bg-primary"></span>
              Support & Distribution Network
           </h2>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Contact The Network Hub.</h1>
           <p className="text-lg text-slate-600 font-medium leading-relaxed">
             From commercial volume rating inquiries to active tracking interception, our centralized operations command is available 24/5. Let's initiate communication.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
           {/* Direct Email form */}
           <div className="bg-white p-10 md:p-12 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col relative z-10">
              <h3 className="text-2xl font-black text-[#0B0E27] tracking-tight mb-8 flex items-center gap-3">
                 <Navigation className="w-6 h-6 text-primary" /> Signal Request
              </h3>
              <form className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 ml-1">Company Executive Lead</label>
                    <input type="text" placeholder="E.g. J. Doe, Global Supply Chain..." className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm font-bold text-slate-900 tracking-wide outline-none focus:border-primary focus:bg-white focus:ring-4 ring-primary/10 transition-all" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 ml-1">Corporate Email Designation</label>
                    <input type="email" placeholder="your.name@enterprise.com" className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm font-bold text-slate-900 tracking-wide outline-none focus:border-primary focus:bg-white focus:ring-4 ring-primary/10 transition-all" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 ml-1">Monthly Volumetric Forecast</label>
                    <select className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 text-sm font-bold text-slate-600 outline-none focus:border-primary focus:bg-white focus:ring-4 ring-primary/10 transition-all appearance-none cursor-pointer">
                       <option>Less than 500 KG / month</option>
                       <option>500 - 2000 KG / month</option>
                       <option>2000+ KG Large Corporate Block</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3 ml-1">Freight Manifest Details</label>
                    <textarea placeholder="Specify routing origin, material class, and timing constraints..." className="w-full h-32 p-5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-4 ring-primary/10 transition-all resize-none"></textarea>
                 </div>
                 <Button size="lg" type="button" className="w-full h-14 rounded-xl font-bold text-xs uppercase tracking-widest shadow-none mt-4 bg-primary text-white hover:bg-[#0B0E27] transition-colors border border-transparent hover:border-indigo-900">Transmit Data</Button>
              </form>
           </div>

           {/* Location Information */}
           <div className="space-y-6 flex flex-col justify-start pt-4">
              <div className="bg-[#0B0E27] text-white p-10 rounded-2xl shadow-xl relative overflow-hidden group border border-indigo-900/50">
                 <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-blue-500/20 w-48 h-48 rounded-full blur-[60px]"></div>
                 <div className="w-12 h-12 bg-white text-[#0B0E27] rounded-xl flex items-center justify-center mb-6 shadow-md relative z-10 group-hover:bg-secondary transition-colors">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <div className="flex items-center gap-4 mb-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-slate-300">US Aggregation Hub</h4>
                 </div>
                 <p className="text-2xl font-black relative z-10 mt-1 mb-6 tracking-tight">New York Metro Logistics Terminal</p>
                 <p className="text-secondary font-bold font-mono tracking-widest text-lg relative z-10">+1 (800) 902-8321</p>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200/80 relative group hover:border-slate-300 transition-colors">
                 <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-6 relative z-10 group-hover:bg-slate-200 transition-colors">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <div className="flex items-center gap-4 mb-2 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-slate-500">India Distribution Hub</h4>
                 </div>
                 <p className="text-2xl font-black text-slate-900 relative z-10 mt-1 mb-6 tracking-tight">Delhi Domestic Customs Gateway</p>
                 <p className="text-slate-800 font-bold font-mono tracking-widest text-lg relative z-10">+91 11-2093-1123</p>
              </div>

              <div className="bg-primary p-8 rounded-2xl shadow-lg border border-indigo-500/30 flex items-center justify-between">
                 <div>
                    <h4 className="text-lg font-black text-white tracking-tight">Direct Digital Channel</h4>
                    <p className="text-indigo-200 font-medium text-sm mt-1">support@brandname.logistics</p>
                 </div>
                 <div className="w-14 h-14 bg-white/10 text-white rounded-xl flex items-center justify-center backdrop-blur-md">
                    <Mail className="w-6 h-6" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
