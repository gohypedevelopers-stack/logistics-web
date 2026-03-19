"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Network, TrendingUp, Headphones } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
       setError("Passwords do not match");
       return;
    }
    
    if (!formData.terms) {
       setError("You must agree to the Terms of Service");
       return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           password: formData.password,
           phone: formData.phone,
        }),
      });

      if (!res.ok) {
         const d = await res.json();
         throw new Error(d.message || "Registration failed");
      }
      
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100">
      
      {/* LEFT PANEL - Gradient Brand Area */}
      <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#1b195c] via-[#2A377B] to-[#b3e0e6]">
         {/* Branding Header */}
         <Link href="/" className="flex items-center gap-3 relative z-10 w-max">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
               <Compass className="w-5 h-5 text-[#1b195c]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Global Navigator</span>
         </Link>

         {/* Middle Content */}
         <div className="relative z-10 mt-16 max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight">
               Intelligence<br/>
               behind every<br/>
               <span className="text-[#cbf5f3]">global move.</span>
            </h1>
             <p className="text-[#a4b4e5] text-lg font-medium leading-relaxed max-w-md">
               Ship parcels worldwide with real-time tracking and complete peace of mind. Create your free account in under 2 minutes.
             </p>
         </div>

         {/* Bottom Cards */}
         <div className="relative z-10 mt-20 grid grid-cols-2 gap-6 max-w-lg">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
               <Network className="w-6 h-6 text-[#cbf5f3] mb-4" />
               <h3 className="text-white font-bold text-sm mb-2">Unified Network</h3>
               <p className="text-[#a4b4e5] text-xs font-medium leading-relaxed">Connect with 150+ global carriers instantly.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
               <TrendingUp className="w-6 h-6 text-[#cbf5f3] mb-4" />
               <h3 className="text-white font-bold text-sm mb-2">Predictive Intelligence</h3>
               <p className="text-[#a4b4e5] text-xs font-medium leading-relaxed">AI-driven delay forecasting and rerouting.</p>
            </div>
         </div>

         <p className="relative z-10 text-[#677abf] text-xs font-medium mt-16">
           © 2024 Global Navigator Logistics. All rights reserved.
         </p>
      </div>

      {/* RIGHT PANEL - Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-[#FAFAFA] relative">
         
         <div className="w-full max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1E1B4B] tracking-tight mb-2">Create your account</h2>
            <p className="text-slate-500 font-medium mb-10">Ship parcels globally — free to join, no subscriptions.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
               {error && (
                 <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-100">
                   {error}
                 </div>
               )}

               {/* Full Name */}
               <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    type="text" required
                    placeholder="John Doe"
                    className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#2A377B]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>

               {/* Email (full width) */}
               <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    type="email" required
                    placeholder="you@example.com"
                    className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#2A377B]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
               </div>

               {/* Phone Number */}
               <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input
                    type="tel" required
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#2A377B]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
               </div>

               {/* Passwords */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Password</label>
                     <input
                       type="password" required minLength={8}
                       placeholder="••••••••"
                       className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#2A377B]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium"
                       value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                     <input
                       type="password" required minLength={8}
                       placeholder="••••••••"
                       className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#2A377B]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium"
                       value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                     />
                  </div>
               </div>

               {/* Terms and Conditions Checkbox */}
               <div className="flex items-start gap-3 mt-4">
                  <div className="flex items-center h-5 mt-0.5">
                     <input 
                       type="checkbox" 
                       id="terms" required
                       className="w-4 h-4 rounded border-slate-300 text-[#2A377B] focus:ring-[#2A377B]"
                       checked={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                     />
                  </div>
                  <label htmlFor="terms" className="text-xs font-medium text-slate-600 leading-relaxed cursor-pointer select-none">
                     By creating an account, you agree to our <span className="font-bold text-[#1E1B4B]">Terms of Service</span> and <span className="font-bold text-[#1E1B4B]">Privacy Policy</span>.
                  </label>
               </div>

               {/* Submit Button */}
               <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full h-14 bg-[#2A377B] hover:bg-[#1E1B4B] text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center">
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
               </div>
            </form>

            <div className="mt-8 text-center">
               <span className="text-sm font-medium text-slate-500">Already have an account? </span>
               <Link href="/login" className="text-sm font-bold text-[#2A377B] hover:underline">
                  Sign In
               </Link>
            </div>
         </div>

         {/* Floating Support Button */}
         <div className="absolute bottom-8 right-8 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform border border-slate-50">
            <Headphones className="w-6 h-6 text-[#1E1B4B]" />
         </div>
      </div>

    </div>
  );
}
