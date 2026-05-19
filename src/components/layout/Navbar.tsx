"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full border-b border-[#d9e2ec]/80 bg-white/88 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="ship2sell logo" width={132} height={52} className="h-11 w-auto object-contain sm:h-12" />
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-[20px] px-4 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-orange-50 text-[#1e4b7a] shadow-[inset_0_0_0_1px_rgba(254,104,1,0.18)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#1e4b7a]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] px-5 text-[13px] font-semibold text-[#1e4b7a] transition-colors hover:bg-slate-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-[20px] bg-[#1e4b7a] px-6 text-[13px] font-semibold text-white transition-colors hover:bg-[#1a2f45]"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] bg-white text-[#1e4b7a] transition-colors hover:bg-slate-50 xl:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#d9e2ec] bg-white/95 px-4 pb-6 pt-4 shadow-[0_18px_40px_rgba(12,39,69,0.10)] backdrop-blur-xl sm:px-6 xl:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-[20px] px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? "bg-orange-50 text-[#1e4b7a]" : "text-slate-700 hover:bg-slate-50"
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
              className="inline-flex h-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] bg-white text-sm font-semibold text-[#1e4b7a] transition-colors hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 w-full items-center justify-center rounded-[20px] bg-[#1e4b7a] text-sm font-semibold text-white transition-colors hover:bg-[#1a2f45]"
            >
              Register
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

