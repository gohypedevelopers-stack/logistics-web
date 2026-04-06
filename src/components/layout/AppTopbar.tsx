"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

function getPageLabel(pathname: string, variant: "admin" | "customer") {
  const map: Array<[string, string]> = [
    [`/${variant}/dashboard`, "Overview"],
    [`/${variant}/shipments/new`, variant === "admin" ? "Create Shipment" : "Create Shipment"],
    [`/${variant}/shipments`, variant === "customer" ? "Total Orders" : "Shipments"],
    [`/${variant}/tracking`, "Tracking"],
    [`/${variant}/track`, "Tracking"],
    [`/${variant}/routes`, variant === "admin" ? "Routes" : "Routes"],
    [`/${variant}/rates`, variant === "admin" ? "Rates" : "Rates"],
    [`/${variant}/customers`, "Customers"],
    [`/${variant}/settings`, "Settings"],
    [`/${variant}/addresses`, "Addresses"],
    [`/${variant}/profile`, "Profile"],
  ];

  const match = map.find(([prefix]) => pathname.startsWith(prefix));
  return match?.[1] ?? (variant === "admin" ? "Admin Panel" : "Customer Panel");
}

export function AppTopbar({
  variant,
  userName,
}: {
  variant: "admin" | "customer";
  userName?: string | null;
}) {
  const pathname = usePathname();
  const label = getPageLabel(pathname, variant);
  const resolvedUserName =
    userName || (variant === "admin" ? "Admin Account" : "Customer Account");
  const initials = resolvedUserName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4 px-6 py-3.5 lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {variant === "admin" ? "Operations Workspace" : "Customer Workspace"}
          </p>
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">
            {label}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden w-[320px] max-w-[32vw] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 lg:flex">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              aria-label="Search"
              placeholder="Search workspace"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700"
          >
            <Bell className="h-4 w-4" />
          </button>

          {variant === "admin" ? (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                {initials || "U"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">{resolvedUserName}</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
