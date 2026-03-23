"use client";

import { 
  ChevronLeft, 
  ShieldCheck, 
  Save, 
  X, 
  Mail, 
  User, 
  Lock, 
  Briefcase,
  Layers,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStaffAction } from "../actions";

export default function NewStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createStaffAction(formData);

    if (result.success) {
      router.push("/admin/settings/staff");
    } else {
      setError(result.error || "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 lg:p-10 max-w-[1200px] mx-auto min-h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/settings/staff" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Provision New Staff
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8 italic uppercase tracking-widest text-[10px]">
              Platform Access Configuration
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8 pb-40">
            {/* Identity Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-24 h-24 text-[#1E1B4B]" />
              </div>

              <h2 className="text-lg font-bold text-[#1E293B] mb-8 flex items-center gap-2 border-b border-slate-50 pb-4">
                 <User className="w-5 h-5 text-blue-600" />
                 Official Identity Info
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
                  Critical Error: {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input 
                      name="name"
                      required
                      placeholder="e.g. Robert Mitchell"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Official Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. robert@brandname.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Initial Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input 
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Access Role & Permission</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <select 
                      name="role"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-bold appearance-none text-[#1E1B4B]"
                    >
                       <option value="ADMIN">System Administrator</option>
                       <option value="MANAGER">Branch Manager</option>
                       <option value="OPERATIONS_MANAGER">Operations Lead</option>
                       <option value="ACCOUNTANT">Financial officer</option>
                       <option value="CREATOR">System Architect</option>
                    </select>
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#1E293B] mt-12 mb-8 flex items-center gap-2 border-b border-slate-50 pb-4">
                 <Briefcase className="w-5 h-5 text-blue-600" />
                 Professional Assignment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Internal Department</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <input 
                      name="department"
                      placeholder="e.g. Logistics Ops"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Official Position</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input 
                      name="position"
                      placeholder="e.g. Senior Handler"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                 <button 
                   type="submit"
                   disabled={loading}
                   className="bg-[#1E1B4B] text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl hover:bg-blue-900 transition-all flex items-center gap-3 disabled:opacity-50"
                 >
                   {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                   Provision Staff Member
                 </button>
                 
                 <Link 
                   href="/admin/settings/staff"
                   className="px-8 py-4 rounded-2xl text-sm font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2"
                 >
                   <X className="w-4 h-4" />
                   Cancel
                 </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-6">
           <div className="bg-[#1E1B4B] rounded-3xl p-8 text-white shadow-xl shadow-blue-200/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <h3 className="font-bold text-lg mb-4">IAM Security Notice</h3>
              <p className="text-sm font-medium text-blue-100 leading-relaxed mb-6 italic">
                Platform access should only be granted to authorized personnel. Each role carries specific data visibility and mutation privileges.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/60">Administrator</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/60">Manager Access</div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
