"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe2, ShieldCheck, Truck, Zap } from "lucide-react";
import { Manrope } from "next/font/google";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
      const d = await res.json();

      if (!res.ok) {
         throw new Error(d.message || "Registration failed");
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(formData.email)}&registered=true${
          d.otpDeliveryFailed ? "&otpDeliveryFailed=true" : ""
        }`
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] selection:bg-orange-100`}>
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1600&auto=format&fit=crop"
              alt="Global freight operations"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e4b7a]/94 via-[#1e4b7a]/90 to-[#fe6801]/48" />
          <div className="absolute -left-10 top-20 h-56 w-56 rounded-full bg-[#fe6801]/20 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-8 xl:p-10">
            <div>
              <Link href="/" className="inline-flex w-max items-center gap-3 rounded-[20px] border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl">
                <Image src="/logo.png" alt="ship2sell logo" width={42} height={42} className="h-10 w-10 object-contain" />
                <span className="text-lg font-bold tracking-tight text-white">ship2sell</span>
              </Link>

              <div className="mt-10 max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
                  <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
                  Create Account
                </div>
                <h1 className="text-balance text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white xl:text-[3.35rem]">
                  <span className="text-white">Intelligence behind every</span>{" "}
                  <span className="text-[#ffd1ad]">global move.</span>
                </h1>
                <p className="mt-4 max-w-lg text-[0.94rem] leading-7 text-slate-100">
                  Create your free account to book shipments, monitor milestones, and manage your logistics workflow in one place.
                </p>
              </div>
            </div>

            <div className="grid max-w-md gap-3">
              <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] bg-[#fe6801]/18">
                    <ShieldCheck className="h-5 w-5 text-[#ffd1ad]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Protected Setup</h3>
                    <p className="mt-1 text-[0.84rem] leading-5 text-slate-200">Business signup with secure access and account verification support.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[20px] border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl">
                  <Globe2 className="h-5 w-5 text-[#ffd1ad]" />
                  <p className="mt-2 text-[0.95rem] font-bold text-white">Global</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">Carrier Reach</p>
                </div>
                <div className="rounded-[20px] border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl">
                  <Truck className="h-5 w-5 text-[#ffd1ad]" />
                  <p className="mt-2 text-[0.95rem] font-bold text-white">Fast</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">Booking Setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-[640px]">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex w-max items-center gap-3 rounded-[20px] border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(30,75,122,0.05)]">
                <Image src="/logo.png" alt="ship2sell logo" width={42} height={42} className="h-10 w-10 object-contain" />
                <span className="text-lg font-bold tracking-tight text-[#1e4b7a]">ship2sell</span>
              </Link>
            </div>

            <div className="rounded-[24px] border border-[#d9e2ec] bg-white p-5 shadow-[0_18px_44px_rgba(30,75,122,0.08)] sm:p-6 lg:p-7">
              <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-[20px] bg-orange-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#fe6801]">
                  <Zap className="h-3.5 w-3.5" />
                  Free Account Setup
                </div>
                <h2 className="text-[1.75rem] font-bold tracking-[-0.03em] text-[#1e4b7a] sm:text-[1.95rem]">
                  <span className="text-[#1e4b7a]">Create your</span>{" "}
                  <span className="text-[#fe6801]">account.</span>
                </h2>
                <p className="mt-2 text-[0.9rem] leading-6 text-slate-600">Ship parcels globally with one account. No subscriptions required to get started.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-[20px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="********"
                      className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="********"
                      className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-1 flex items-start gap-3 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-3.5">
                  <div className="mt-0.5 flex h-5 items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="h-4 w-4 rounded border-slate-300 text-[#1e4b7a] focus:ring-[#1e4b7a]"
                      checked={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    />
                  </div>
                  <label htmlFor="terms" className="cursor-pointer select-none text-xs leading-relaxed text-slate-600">
                    By creating an account, you agree to our <span className="font-bold text-[#1e4b7a]">Terms of Service</span> and{" "}
                    <span className="font-bold text-[#1e4b7a]">Privacy Policy</span>.
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#1e4b7a] text-sm font-bold text-white shadow-md transition-colors hover:bg-[#295989]"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </form>

              <div className="mt-5 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                    <ShieldCheck className="h-4 w-4 text-[#1e4b7a]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e4b7a]">Fast onboarding</p>
                    <p className="mt-1 text-[0.84rem] leading-5 text-slate-600">Create your account, verify your email, and start managing shipments with live visibility.</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center">
                <span className="text-sm font-medium text-slate-500">Already have an account? </span>
                <Link href="/login" className="text-sm font-bold text-[#1e4b7a] hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



