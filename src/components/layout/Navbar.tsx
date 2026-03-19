"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/tracking", label: "Tracking" },
  { href: "/pricing", label: "Pricing" },
  { href: "/customer-experience", label: "Customer Experience" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">

        {/* BRANDING */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[22px] font-bold tracking-tight text-[#1E1B4B]">
            Global<span className="text-[#818CF8]">Navigator</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-[13px] py-1 transition-colors ${
                  isActive
                    ? "font-bold text-[#1E1B4B] border-b-2 border-[#1E1B4B]"
                    : "font-medium text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[13px] font-medium text-slate-900 hover:text-[#1E1B4B] transition-colors">
            Login
          </Link>
          <Link href="/register">
            <Button className="bg-[#1E1B4B] hover:bg-slate-900 text-white rounded font-medium text-xs px-6 h-9 shadow-sm">
              Register
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}
