"use client";

import { signIn, getSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, Globe2, Plane } from "lucide-react";
import { Manrope } from "next/font/google";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [verified, setVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  useEffect(() => {
    if (searchParams.get("registered")) {
      setRegistered(true);
    }
    if (searchParams.get("verified")) {
      setVerified(true);
    }
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverifiedEmail("");
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
        if (res.error.includes("EMAIL_NOT_VERIFIED")) {
          setUnverifiedEmail(email);
          setError("Your email is not verified. Please verify with OTP first.");
        } else if (
          res.error === "CredentialsSignin" ||
          res.error.includes("INVALID_CREDENTIALS")
        ) {
          setError("The email or password you entered is incorrect.");
        } else if (res.error.includes("AUTH_TIMEOUT")) {
          setError("Login timed out. Please try again in a moment.");
        } else {
          setError("Authentication failed. Please try again later.");
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
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] selection:bg-orange-100`}>
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1600&auto=format&fit=crop"
              alt="Air cargo operations"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e4b7a]/94 via-[#1e4b7a]/90 to-[#fe6801]/48" />
          <div className="absolute -left-10 top-20 h-56 w-56 rounded-full bg-[#fe6801]/20 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-12">
            <div>
              <Link href="/" className="inline-flex w-max items-center gap-3 rounded-[20px] border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl">
                <Image src="/logo.png" alt="ship2sell logo" width={42} height={42} className="h-10 w-10 object-contain" />
                <span className="text-lg font-bold tracking-tight text-white">ship2sell</span>
              </Link>

              <div className="mt-16 max-w-xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
                  <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
                  Secure Access
                </div>
                <h1 className="text-balance text-[3rem] font-bold leading-[1.04] tracking-[-0.03em] text-white xl:text-[4rem]">
                  <span className="text-white">Welcome back to your</span>{" "}
                  <span className="text-[#ffd1ad]">logistics hub.</span>
                </h1>
                <p className="mt-6 max-w-lg text-[1rem] leading-8 text-slate-100">
                  Securely manage shipments, check live milestones, and access your delivery data from one connected dashboard.
                </p>
              </div>
            </div>

            <div className="grid max-w-md gap-4">
              <div className="rounded-[20px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] bg-[#fe6801]/18">
                    <ShieldCheck className="h-5 w-5 text-[#ffd1ad]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Secure Dashboard</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-200">Enterprise-grade access for shipments, documents, and account activity.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <Globe2 className="h-5 w-5 text-[#ffd1ad]" />
                  <p className="mt-3 text-[1.05rem] font-bold text-white">Global</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">Tracking Access</p>
                </div>
                <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <Plane className="h-5 w-5 text-[#ffd1ad]" />
                  <p className="mt-3 text-[1.05rem] font-bold text-white">Live</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">Route Visibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
          <div className="w-full max-w-[560px]">
            {registered && (
              <div className="mb-4 flex items-center gap-3 rounded-[20px] border border-green-100 bg-green-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-bold text-green-700">Registration successful. Verify OTP from your email before signing in.</p>
              </div>
            )}
            {verified && (
              <div className="mb-4 rounded-[20px] border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-700">Email verified successfully. You can sign in now.</p>
              </div>
            )}

            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex w-max items-center gap-3 rounded-[20px] border border-[#d9e2ec] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(30,75,122,0.05)]">
                <Image src="/logo.png" alt="ship2sell logo" width={42} height={42} className="h-10 w-10 object-contain" />
                <span className="text-lg font-bold tracking-tight text-[#1e4b7a]">ship2sell</span>
              </Link>
            </div>

            <div className="rounded-[24px] border border-[#d9e2ec] bg-white p-6 shadow-[0_18px_44px_rgba(30,75,122,0.08)] sm:p-8 lg:p-10">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-[20px] bg-orange-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#fe6801]">
                  <Zap className="h-3.5 w-3.5" />
                  Account Login
                </div>
                <h2 className="text-[2rem] font-bold tracking-[-0.03em] text-[#1e4b7a] sm:text-[2.25rem]">
                  <span className="text-[#1e4b7a]">Login to your</span>{" "}
                  <span className="text-[#fe6801]">parcel console.</span>
                </h2>
                <p className="mt-3 text-[0.95rem] leading-7 text-slate-600">Enter your credentials to access tracking, shipment history, and account operations.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-[20px] border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
                    {error}
                    {unverifiedEmail && (
                      <div className="mt-2">
                       <Link
                         href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                         className="underline font-extrabold"
                       >
                         Verify email now
                       </Link>
                     </div>
                   )}
                 </div>
                )}

                <div>
                  <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <div className="mb-2 ml-1 flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-700">Password</label>
                    <Link
                      href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#1e4b7a] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="********"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-slate-900 outline-none transition-shadow focus:bg-white focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)] placeholder:text-slate-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#1e4b7a] text-sm font-bold text-white shadow-md transition-colors hover:bg-[#295989]"
                  >
                    {loading ? "Logging in..." : "Login"}
                    {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </button>
                </div>
              </form>

              <div className="mt-8 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                    <ShieldCheck className="h-4 w-4 text-[#1e4b7a]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e4b7a]">Protected access</p>
                    <p className="mt-1 text-[0.88rem] leading-6 text-slate-600">Use your registered business email to access your logistics dashboard securely.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <span className="text-sm font-medium text-slate-500">New to ship2sell? </span>
                <Link href="/register" className="text-sm font-bold text-[#1e4b7a] hover:underline">
                  Create a free account
                </Link>
              </div>
            </div>
          </div>
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



