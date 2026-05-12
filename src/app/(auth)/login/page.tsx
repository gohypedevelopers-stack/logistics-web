"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Network, TrendingUp, Headphones, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered")) {
      setRegistered(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log(`[LOGIN_FRONTEND] Starting sign-in attempt for: ${email}`);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log(`[LOGIN_FRONTEND] Received response from signIn:`, { 
        error: res?.error, 
        status: res?.status, 
        ok: res?.ok, 
        url: res?.url 
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
           setError("The email or password you entered is incorrect.");
        } else {
           setError(`Authentication failed: ${res.error}. Please try again later.`);
        }
        setLoading(false);
      } else if (res?.ok) {
        // Fetch the session to get the user role
        const session = await getSession();
        const role = session?.user?.role;
        const callbackUrl = searchParams.get("callbackUrl");
        
        console.log(`[LOGIN_FRONTEND] Login successful. Role detected: ${role}`);

        let targetUrl = callbackUrl || "/customer/dashboard";
        
        // If there's no specific callbackUrl, choose default based on role
        if (!callbackUrl) {
          if (role && role !== "CUSTOMER") {
             targetUrl = "/admin/dashboard";
          } else {
             targetUrl = "/customer/dashboard";
          }
        }
        
        console.log(`[LOGIN_FRONTEND] Pursuing HARD redirect to: ${targetUrl}`);
        window.location.href = targetUrl;
      } else {
         setError("An unexpected authentication error occurred. Please refresh and try again.");
         setLoading(false);
      }
    } catch (err: any) {
       console.error(`[LOGIN_FRONTEND] Unexpected error during handleSubmit:`, err);
       setError("A system error occurred. Please check your internet connection.");
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-orange-100">
      
      {/* LEFT PANEL - Gradient Brand Area */}
      <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#fe6801]">
         {/* Branding Header */}
         <Link href="/" className="flex items-center gap-3 relative z-10 w-max">
            <Image src="/logo.png" alt="ship2sell logo" width={42} height={42} className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-white tracking-tight">ship2sell</span>
         </Link>

         {/* Middle Content */}
         <div className="relative z-10 mt-16 max-w-lg">
            <h1 className="text-5xl font-bold text-white leading-[1.15] mb-6 tracking-tight">
               Welcome back to<br/>
               your global<br/>
               <span className="text-[#ffd1ad]">logistics hub.</span>
            </h1>
            <p className="text-[#a4b4e5] text-lg font-medium leading-relaxed max-w-md">
               Securely manage your parcels, track milestones in real-time, and access your documentation from anywhere in the world.
            </p>
         </div>

         {/* Bottom Cards */}
         <div className="relative z-10 mt-20 grid grid-cols-1 gap-6 max-w-sm">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-5">
               <div className="w-10 h-10 rounded-xl bg-[#fe6801]/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#ffd1ad]" />
               </div>
               <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">Secure Dashboard</h3>
                  <p className="text-[#a4b4e5] text-xs font-medium leading-tight">Your data is protected by enterprise-grade encryption.</p>
               </div>
            </div>
         </div>

         <p className="relative z-10 text-[#677abf] text-xs font-medium mt-16">
            © 2024 ship2sell Logistics. All rights reserved.
         </p>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-[#FAFAFA] relative">
         
         <div className="w-full max-w-md mx-auto">
            {registered && (
               <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                     <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-green-700 text-sm font-bold">Registration successful! Please sign in.</p>
               </div>
            )}

            <h2 className="text-3xl font-bold text-[#1e4b7a] tracking-tight mb-2">Sign in</h2>
            <p className="text-slate-500 font-medium mb-10">Enter your credentials to access your parcel console.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
               {error && (
                 <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-100">
                   {error}
                 </div>
               )}

               {/* Email Address */}
               <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    type="email" required
                    placeholder="you@example.com"
                    className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#1e4b7a]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
               </div>

               {/* Password */}
               <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                     <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest">Password</label>
                     <Link href="#" className="text-[10px] font-bold text-[#1e4b7a] hover:underline uppercase tracking-widest">Forgot Password?</Link>
                  </div>
                  <input
                    type="password" required
                    placeholder="********"
                    className="w-full h-12 bg-slate-100 hover:bg-slate-200/50 focus:bg-white rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-[#1e4b7a]/20 border border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               {/* Submit Button */}
               <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full h-14 bg-[#1e4b7a] hover:bg-[#173e67] text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 group">
                    {loading ? "Signing in..." : "Sign In"} 
                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
               </div>
            </form>

            <div className="mt-10 text-center">
               <span className="text-sm font-medium text-slate-500">New to ship2sell? </span>
               <Link href="/register" className="text-sm font-bold text-[#1e4b7a] hover:underline">
                  Create a free account
               </Link>
            </div>
         </div>

         {/* Floating Support Button */}
         <div className="absolute bottom-8 right-8 w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform border border-slate-50">
            <Headphones className="w-6 h-6 text-[#1e4b7a]" />
         </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}



