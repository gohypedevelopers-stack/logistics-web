"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP.");

      setOtpSent(true);
      setMessage(data.message || "If this email exists, a reset OTP has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setResetting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");

      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => {
        router.push(`/login?email=${encodeURIComponent(email)}`);
      }, 900);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1e4b7a]">Forgot Password</h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Enter your email to receive a 6-digit OTP and reset your password.
        </p>

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

        <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
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

          <button
            type="submit"
            disabled={sendingOtp}
            className="h-12 w-full rounded-xl bg-[#1e4b7a] text-sm font-bold text-white transition hover:bg-[#173e67] disabled:opacity-70"
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {otpSent && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
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

            <div>
              <label className="ml-1 mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-700">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1e4b7a] focus:bg-white"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label className="ml-1 mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-700">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#1e4b7a] focus:bg-white"
                placeholder="Repeat new password"
              />
            </div>

            <button
              type="submit"
              disabled={resetting}
              className="h-12 w-full rounded-xl bg-[#fe6801] text-sm font-bold text-white transition hover:bg-orange-500 disabled:opacity-70"
            >
              {resetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Back to{" "}
          <Link href="/login" className="font-bold text-[#1e4b7a] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1e4b7a] border-t-transparent" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
