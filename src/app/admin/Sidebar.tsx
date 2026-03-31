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
      { name: "Countries & Routes", href: "/admin/rates", icon: MapPin },
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

export function AdminSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const resolvedUserName = userName || "Admin Account";
  const initials = resolvedUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="hidden h-full w-[278px] flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl lg:flex">
      <div className="border-b border-slate-200/80 px-6 pb-6 pt-7">
        <Link href="/admin/dashboard" className="flex gap-3 items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shrink-0">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight tracking-tight text-slate-900">Admin Console</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Enterprise Ops</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {navigation.map((group) => (
          <div key={group.title} className="pb-1">
            <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              {group.title}
            </p>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin/dashboard");
                const Icon = item.icon;

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
                      <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-blue-600" />
                    ) : null}
                    <Icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-blue-800" : "text-slate-400 group-hover:text-slate-700"
                    )} />
                    <span className="tracking-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-700 shadow-sm">
              {initials || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{resolvedUserName}</p>
              <p className="text-xs text-slate-500">Admin access</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
