"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, PlaneTakeoff, ShieldCheck, MapPin, MapPinned, Info, X, Zap, Box, Truck } from "lucide-react";

export default function CreateShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState("ShipGlobal");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      originCountry: formData.get("originCountry"),
      pickupDate: formData.get("pickupDate"),
      fullPickupAddress: formData.get("fullPickupAddress"),
      weight: formData.get("weight"),
      content: formData.get("content"),
      amount: formData.get("amount"),
      receiverName: formData.get("receiverName"),
      receiverPin: formData.get("receiverPin"),
      receiverCity: formData.get("receiverCity"),
      receiverAddress: formData.get("receiverAddress"),
      carrier: selectedCarrier
    };

    try {
      const res = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        router.push("/customer/shipments");
        router.refresh();
      } else {
        const msg = result.error || "Failed to create shipment";
        if (msg.includes("stale") || msg.includes("session")) {
          alert("Your session has expired. Please log out and log in again.");
        } else {
          alert("Error: " + msg);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-[1400px] mx-auto min-h-full">
       
      <div className="mb-10">
         <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight mb-2">Create New Shipment</h1>
         <p className="text-slate-600 font-medium text-sm">Book your international delivery with enterprise-grade intelligence.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
         
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
                     <select name="originCountry" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none">
                        <option>United Kingdom (UK)</option>
                        <option>United States (US)</option>
                        <option>Germany (DE)</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Pickup Date</label>
                     <input name="pickupDate" type="date" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Full Pickup Address</label>
                  <textarea name="fullPickupAddress" required rows={3} placeholder="Street, Building, Apartment No." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-800 outline-none resize-none"></textarea>
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
                     <input name="weight" type="number" step="0.01" required placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Contents Description</label>
                     <input name="content" type="text" required placeholder="e.g. Electronics, Cotton Garments" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Declared Value (USD)</label>
                  <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
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
                  <input name="receiverName" type="text" required placeholder="Receiver's Name" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">PIN Code</label>
                     <input name="receiverPin" type="text" required placeholder="6-digit PIN" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
                  </div>
                  <div>
                     <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">City / State</label>
                     <input name="receiverCity" type="text" required placeholder="E.g. Delhi" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-800 outline-none" />
                  </div>
               </div>

               <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Delivery Address</label>
                  <textarea name="receiverAddress" required rows={3} placeholder="House No, Street, Locality" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold text-slate-800 outline-none resize-none"></textarea>
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
            <div className="bg-gradient-to-br from-[#2A377B] to-[#1E1B4B] rounded-2xl p-8 shadow-xl border border-[#1b195c] relative overflow-hidden text-white">
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <Zap className="w-5 h-5 text-indigo-300" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Shipment Intel</h2>
               </div>

               <div className="relative z-10 mb-8">
                  <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Route</p>
                  <div className="flex items-center gap-4 text-white">
                     <p className="font-bold text-lg leading-tight">LHR<br/>DEL</p>
                  </div>
               </div>

               <div className="h-px bg-white/20 w-full mb-6 relative z-10"></div>

               <div className="flex justify-between items-end relative z-10 mb-8">
                  <span className="text-sm font-bold text-white tracking-wide">Pay later</span>
                  <span className="text-xl font-black text-teal-300">Determined after review</span>
               </div>
            </div>
         </div>

      </form>
    </div>
  );
}
