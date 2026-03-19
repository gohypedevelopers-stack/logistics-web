"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, PlaneTakeoff, ShieldCheck, MapPin, MapPinned, Info, X, Zap, Box, Truck, Map } from "lucide-react";

export default function CreateShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState("ShipGlobal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    setLoading(false);
    router.push("/customer/dashboard?shipment_created=true");
  };

  return (
    <div className="p-8 lg:p-10 max-w-[1400px] mx-auto min-h-full">
       
      {/* HEADER */}
      <div className="mb-10">
         <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight mb-2">Create New Shipment</h1>
         <p className="text-slate-600 font-medium text-sm">Book your international delivery to India with enterprise-grade intelligence.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
         
         {/* LEFT COLUMN - FORM */}
         <div className="flex-1 space-y-6">
            
            {/* 1. Pickup Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                     <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1E1B4B] tracking-tight">1. Pickup Details</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Origin Country</label>
                     <select className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:95%_center] bg-no-repeat">
                        <option>United Kingdom (UK)</option>
                        <option>United States (US)</option>
                        <option>Germany (DE)</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Pickup Date</label>
                     <input type="date" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-400" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Full Pickup Address</label>
                  <textarea rows={3} placeholder="Street, Building, Apartment No." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-300 resize-none"></textarea>
               </div>
            </div>

            {/* 2. Package Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                     <Box className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1E1B4B] tracking-tight">2. Package Details</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Weight (KG)</label>
                     <input type="number" placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Contents Description</label>
                     <input type="text" placeholder="e.g. Electronics, Cotton Garments" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400" />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Declared Value (USD)</label>
                  <input type="text" placeholder="$ 0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400" />
               </div>
            </div>

            {/* 3. Receiver Details */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                     <MapPinned className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1E1B4B] tracking-tight">3. Receiver Details (India)</h2>
               </div>
               
               <div className="mb-6">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Full Name</label>
                  <input type="text" placeholder="Receiver's Name" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">PIN Code</label>
                     <input type="text" placeholder="6-digit India PIN" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">City / State</label>
                     <input type="text" placeholder="Automatically detected" readOnly className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-500 italic outline-none cursor-not-allowed placeholder:text-slate-400" />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Delivery Address</label>
                  <textarea rows={3} placeholder="House No, Street, Locality" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 resize-none"></textarea>
               </div>
            </div>

            {/* 4. Logistics Intelligence */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#1E1B4B] flex items-center justify-center">
                     <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1E1B4B] tracking-tight">4. Logistics Intelligence</h2>
               </div>
               
               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-4">Select Preferred Carrier</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     
                     {/* Carrier 1 */}
                     <div 
                        onClick={() => setSelectedCarrier("ShipGlobal")}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                          selectedCarrier === "ShipGlobal" ? "border-[#1E1B4B] bg-indigo-50/50" : "border-slate-100 bg-slate-50 hover:border-indigo-200"
                        }`}
                     >
                        <div className="flex gap-4 items-center">
                           <div className={`w-5 h-5 rounded-full border-4 flex shrink-0 ${selectedCarrier === "ShipGlobal" ? "border-[#1E1B4B] bg-white" : "border-slate-300 bg-white"}`}></div>
                           <div>
                              <p className={`font-bold text-sm ${selectedCarrier === "ShipGlobal" ? "text-[#1E1B4B]" : "text-slate-800"}`}>ShipGlobal</p>
                              <p className="text-[10px] font-bold text-slate-500 mt-0.5">4-7 Days • $42.00</p>
                           </div>
                        </div>
                        {selectedCarrier === "ShipGlobal" && <ShieldCheck className="w-5 h-5 text-[#1E1B4B]" />}
                     </div>

                     {/* Carrier 2 */}
                     <div 
                        onClick={() => setSelectedCarrier("IndigoExpress")}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                          selectedCarrier === "IndigoExpress" ? "border-[#1E1B4B] bg-indigo-50/50" : "border-slate-100 bg-slate-50 hover:border-indigo-200"
                        }`}
                     >
                        <div className="flex gap-4 items-center">
                           <div className={`w-5 h-5 rounded-full border-4 flex shrink-0 ${selectedCarrier === "IndigoExpress" ? "border-[#1E1B4B] bg-white" : "border-slate-300 bg-white"}`}></div>
                           <div>
                              <p className={`font-bold text-sm ${selectedCarrier === "IndigoExpress" ? "text-[#1E1B4B]" : "text-slate-800"}`}>Indigo Express</p>
                              <p className="text-[10px] font-bold text-slate-500 mt-0.5">2-4 Days • $89.00</p>
                           </div>
                        </div>
                        {selectedCarrier === "IndigoExpress" && <Zap className="w-5 h-5 text-[#1E1B4B]" />}
                        {selectedCarrier !== "IndigoExpress" && <Zap className="w-5 h-5 text-slate-300" />}
                     </div>

                  </div>
               </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 pb-12">
               <button type="button" onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  <X className="w-4 h-4" /> Cancel
               </button>
               <button type="submit" disabled={loading} className="bg-[#1E1B4B] hover:bg-[#2A377B] text-white px-8 h-14 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-colors flex items-center gap-3">
                  {loading ? "Processing..." : "Confirm & Book Shipment"} <ArrowRight className="w-4 h-4" />
               </button>
            </div>

         </div>

         {/* RIGHT COLUMN - SUMMARY */}
         <div className="w-full lg:w-[400px] space-y-6">
            
            {/* Intel Card */}
            <div className="bg-gradient-to-br from-[#2A377B] to-[#1E1B4B] rounded-2xl p-8 shadow-xl border border-[#1b195c] relative overflow-hidden text-white">
               
               {/* Background effect */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>

               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Zap className="w-5 h-5 text-indigo-300" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Shipment Intel</h2>
               </div>

               <div className="relative z-10 mb-8">
                  <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Route</p>
                  <div className="flex items-center gap-4 text-white">
                     <p className="font-bold text-lg leading-tight">London (LHR)<br/>Delhi (DEL)</p>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                     <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                     <div className="w-8 h-[2px] bg-indigo-300"></div>
                     <PlaneTakeoff className="w-4 h-4 text-indigo-300 ml-1" />
                  </div>
               </div>

               <div className="space-y-4 relative z-10 mb-8">
                  <div className="flex justify-between items-center text-sm font-medium">
                     <span className="text-indigo-200">Base Freight</span>
                     <span>$38.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                     <span className="text-indigo-200">Fuel Surcharge</span>
                     <span>$2.40</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                     <span className="text-indigo-200">Intelligence Fee</span>
                     <span>$1.10</span>
                  </div>
               </div>

               <div className="h-px bg-white/20 w-full mb-6 relative z-10"></div>

               <div className="flex justify-between items-end relative z-10 mb-8">
                  <span className="text-sm font-bold text-white tracking-wide">Total Estimate</span>
                  <span className="text-3xl font-black text-teal-300 tracking-tighter">$42.00</span>
               </div>

               {/* Info Callout */}
               <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex gap-3 relative z-10 backdrop-blur-sm">
                  <Info className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                  <p className="text-xs text-indigo-100 font-medium leading-relaxed">India customs might require KYC documents (Aadhar/Passport) from the receiver before delivery.</p>
               </div>
            </div>

            {/* Insurance Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex gap-4 items-center">
               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-800">Fully Insured Path</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Protected by Global Navigator Trust for values up to $50,000.</p>
               </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm h-[200px] relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-0 bg-[#83979E]">
                  {/* Decorative Map BG */}
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 mix-blend-overlay grayscale group-hover:scale-105 transition-transform duration-700" alt="World Map" />
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white shadow-xl rounded-full px-5 py-2.5 font-bold text-[10px] tracking-widest text-[#1E1B4B] uppercase group-hover:-translate-y-1 transition-transform">
                     Real-Time Route Preview
                  </div>
               </div>
            </div>

         </div>

      </form>
    </div>
  );
}
