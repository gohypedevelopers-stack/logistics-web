import { Role } from "@prisma/client";
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Mail, 
  Briefcase, 
  Clock,
  ChevronLeft,
  Trash2,
  ShieldIcon
} from "lucide-react";
import Link from "next/link";
import { createStaffAction, deleteStaffAction } from "./actions";
import prisma from "@/lib/prisma";

export default async function StaffManagementPage() {
  const staffUsers = await prisma.user.findMany({
    where: {
      role: {
        not: Role.CUSTOMER
      }
    },
    include: {
      staffProfile: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/settings" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              Staff & User Access
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8 italic uppercase tracking-widest text-[10px]">
              Internal Identity & Access Management (IAM)
            </div>
          </div>
          
          <Link 
            href="/admin/settings/staff/new" 
            className="flex items-center gap-2 bg-[#1E1B4B] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:bg-blue-900 transition-all font-sans"
          >
            <Plus className="w-4 h-4" />
            Provision New Staff
          </Link>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {staffUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-200 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Delete Action (Server Action form) */}
               <form action={async () => {
                 "use server";
                 await deleteStaffAction(user.id);
               }}>
                 <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </form>
            </div>

            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] border border-blue-50 flex items-center justify-center text-[#1e40af] shrink-0 font-bold text-lg">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{user.name}</h3>
                  {user.role === Role.ADMIN && (
                    <div className="bg-blue-100 text-[#1e40af] p-0.5 rounded-md" title="Admin Access">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium truncate">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="text-sm font-medium">
                   {user.staffProfile?.position || "Not Assigned"} 
                   <span className="text-slate-300 mx-1.5 font-light">|</span>
                   <span className="text-slate-400 italic">{user.staffProfile?.department || "No Dept"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 pt-2 border-t border-slate-50">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {staffUsers.length === 0 && (
           <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <ShieldIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No staff accounts found</h3>
              <p className="text-slate-500 max-w-sm mt-2 text-sm">
                Provision new internal access keys to start managing the platform.
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
