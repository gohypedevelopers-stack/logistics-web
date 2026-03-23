"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  Search, 
  Users, 
  MapPin, 
  Settings, 
  ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    title: "Core",
    items: [
      { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Shipments", href: "/admin/shipments", icon: Truck },
      { name: "Tracking", href: "/admin/tracking", icon: Search },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Rates & Routes", href: "/admin/rates", icon: MapPin },
    ]
  },
   {
     title: "System",
     items: [
       { name: "Staff Management", href: "/admin/settings/staff", icon: ShieldCheck },
       { name: "Settings", href: "/admin/settings", icon: Settings },
     ]
   }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Admin Account";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col hidden lg:flex h-full relative z-20 font-sans">
      {/* Branding */}
      <div className="p-8 pb-10">
        <Link href="/admin/dashboard" className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#1E1B4B] text-lg leading-tight tracking-tight">Admin Console</h1>
            <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Enterprise Ops</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navigation.map((group) => (
          <div key={group.title} className="pb-4">
            <p className="px-5 mb-3 text-[10px] font-extrabold text-slate-400 tracking-[0.2em] uppercase opacity-70">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all group",
                      isActive 
                        ? "bg-blue-50 text-[#1E1B4B] font-extrabold shadow-sm" 
                        : "text-slate-500 hover:text-[#1E1B4B] hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-[#1E1B4B]" : "text-slate-400 group-hover:text-[#1E1B4B]"
                    )} />
                    <span className="text-sm tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Profile Section */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1E1B4B] font-bold text-xs shrink-0">
                 {initials || "A"}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-tight">{userName}</p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
