"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Network" },
  { href: "/tracking", label: "Tracking" },
  { href: "/pricing", label: "Pricing" },
  { href: "/customer-experience", label: "Customer Experience" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-white/85 shadow-[0_10px_35px_rgba(12,39,69,0.08)] backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">

        {/* BRANDING */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="ship2sell logo" width={132} height={52} className="h-12 w-auto object-contain" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 xl:flex">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-[13px] py-1 transition-colors ${
                  isActive
                    ? "border-b-2 border-[#fe6801] font-bold text-[#1e4b7a]"
                    : "font-medium text-slate-500 hover:text-[#1e4b7a]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="hidden items-center gap-6 xl:flex">
          <Link href="/login" className="text-[13px] font-medium text-slate-900 transition-colors hover:text-[#1e4b7a]">
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-[#1e4b7a] hover:bg-[#173e67] text-white rounded font-medium text-xs px-6 h-9 shadow-sm">
              Register
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1e4b7a] transition-colors hover:bg-slate-50 xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

      </div>
      {mobileOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-6 pb-6 pt-4 shadow-[0_18px_40px_rgba(12,39,69,0.12)] backdrop-blur-xl xl:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? "bg-blue-50 text-[#1e4b7a]" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Login
            </Link>
            <Link href="/register">
              <Button className="h-11 w-full rounded-xl bg-[#1e4b7a] text-sm font-semibold text-white hover:bg-[#173e67]">
                Register
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

