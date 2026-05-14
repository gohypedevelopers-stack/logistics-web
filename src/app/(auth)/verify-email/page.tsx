"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const registered = searchParams.get("registered") === "true";
  const otpDeliveryFailed = searchParams.get("otpDeliveryFailed") === "true";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Verification failed.");
      }

      setMessage("Email verified. Redirecting to sign in...");
      setTimeout(() => {
        router.push(`/login?verified=true&email=${encodeURIComponent(email)}`);
      }, 900);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Unable to resend OTP.");
      }

      setMessage(data.message || "OTP resent successfully.");
    } catch (err: any) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1e4b7a]">Verify your email</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Enter the 6-digit OTP sent to your email.
        </p>

        {registered && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            Account created. Please verify your email to continue.
          </div>
        )}

        {otpDeliveryFailed && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            OTP email could not be sent during registration. Click <strong>Resend OTP</strong> below.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-700">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="ml-1 mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1e4b7a] focus:bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="ml-1 mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-700">
              OTP Code
            </label>
            <input
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-center text-xl font-bold tracking-[0.35em] text-slate-900 outline-none transition focus:border-[#1e4b7a] focus:bg-white"
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#1e4b7a] text-sm font-bold text-white transition hover:bg-[#173e67] disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Back to{" "}
          <Link href="/login" className="font-bold text-[#1e4b7a] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e4b7a] border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
