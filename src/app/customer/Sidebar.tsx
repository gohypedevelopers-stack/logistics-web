"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, PlusSquare, Contact, Calculator, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function CustomerSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Customer Account";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const navItems = [
    { name: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Create shipment", href: "/customer/shipments/new", icon: PlusSquare },
    { name: "Address", href: "/customer/addresses", icon: Contact },
    { name: "Rates", href: "/customer/rates", icon: Calculator },
    { name: "Track", href: "/customer/track", icon: MapPin },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col hidden md:flex h-full relative z-20 font-sans">
      <div className="p-8 pb-10">
         <div className="flex gap-3 items-center">
           <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center shrink-0">
              <Rocket className="w-6 h-6 text-white" />
           </div>
           <div>
             <h1 className="font-bold text-[#1E1B4B] text-lg leading-tight tracking-tight">Logistics Intel</h1>
             <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Enterprise Tier</p>
           </div>
         </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/customer/dashboard");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all group",
                isActive 
                  ? "bg-blue-50 text-[#1E1B4B] font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-[#1E1B4B]" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Profile Section */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
           <div className="flex items-center gap-3">
              {/* Profile Initials Circle */}
              <Link href="/customer/profile" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1E1B4B] font-bold text-xs hover:border-blue-400 transition-all shrink-0">
                 {initials || "C"}
              </Link>
              <div className="flex-1 min-w-0">
                 <Link href="/customer/profile" className="block text-xs font-bold text-slate-900 truncate hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {userName}
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
