"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPin, PackageSearch, PlusSquare, Contact, Calculator } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const resolvedUserName = userName || "Customer Account";
  const initials = resolvedUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isActiveRoute = (href: string) => {
    if (pathname === href) return true;

    if (href === "/customer/shipments") {
      return pathname.startsWith("/customer/shipments/") && pathname !== "/customer/shipments/new";
    }

    return pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { name: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "Total Orders", href: "/customer/shipments", icon: PackageSearch },
    { name: "Create Shipment", href: "/customer/shipments/new", icon: PlusSquare },
    { name: "Addresses", href: "/customer/addresses", icon: Contact },
    { name: "Rates", href: "/customer/rates", icon: Calculator },
    { name: "Tracking", href: "/customer/track", icon: MapPin },
  ];

  return (
    <aside className="hidden h-full w-[278px] flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl md:flex">
      <div className="border-b border-slate-200/80 px-6 pb-6 pt-7">
         <div className="flex gap-3 items-center">
           <Image src="/logo.png" alt="ship2sell logo" width={44} height={44} className="h-11 w-11 object-contain shrink-0" />
           <div>
             <h1 className="text-lg font-semibold leading-tight tracking-tight text-[#1e4b7a]">ship2sell</h1>
             <p className="text-[10px] font-semibold text-slate-400 tracking-[0.22em] uppercase">Enterprise Tier</p>
           </div>
         </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const Icon = item.icon as LucideIcon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                isActive 
                  ? "bg-blue-100 text-blue-800 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive ? (
                <span className="pointer-events-none absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-blue-600" />
              ) : null}
              <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-800" : "text-slate-400 group-hover:text-slate-700")} />
              <span className="tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 pt-2">
        <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3.5">
           <div className="flex items-center gap-3">
              <Link href="/customer/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-blue-700 font-bold text-xs hover:border-blue-300 transition-all shrink-0">
                 {initials || "C"}
              </Link>
              <div className="flex-1 min-w-0">
                 <Link href="/customer/profile" className="block truncate text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors tracking-tight">
                    {resolvedUserName}
                 </Link>
                 <p className="mt-0.5 text-xs text-slate-500">Customer account</p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
