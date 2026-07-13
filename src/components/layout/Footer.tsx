import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#d9e2ec] bg-white pt-16 text-slate-600 sm:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid gap-8 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-6 shadow-[0_10px_30px_rgba(30,75,122,0.05)] sm:p-8 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:gap-10">
          <div>
            <div className="mb-5">
              <Image src="/logo.png" alt="ship2sell logo" width={132} height={52} className="h-12 w-auto object-contain" />
            </div>
            <p className="max-w-xs text-balance text-[0.92rem] leading-7 text-slate-600">
              Redefining international logistics through data-driven clarity and premium service standards.
            </p>
            
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1e4b7a]">Services</h4>
            <ul className="space-y-3 text-[0.9rem]">
              <li><Link href="/services#air-freight" className="transition-colors hover:text-[#1e4b7a]">Air Freight</Link></li>
              <li><Link href="/services#ocean-freight" className="transition-colors hover:text-[#1e4b7a]">Ocean Shipping</Link></li>
              <li><Link href="/services#express-courier" className="transition-colors hover:text-[#1e4b7a]">Express Courier</Link></li>
              <li><Link href="/services#warehousing" className="transition-colors hover:text-[#1e4b7a]">Warehousing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1e4b7a]">Company</h4>
            <ul className="space-y-3 text-[0.9rem]">
              <li><Link href="/about" className="transition-colors hover:text-[#1e4b7a]">About</Link></li>
              <li><Link href="/pricing" className="transition-colors hover:text-[#1e4b7a]">Pricing</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-[#1e4b7a]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-[#1e4b7a]">Terms of Service</Link></li>
              <li><Link href="/fraud-awareness" className="transition-colors hover:text-[#1e4b7a]">Fraud Awareness</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1e4b7a]">Connect</h4>
            <div className="mb-6 flex gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61589313998002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] bg-white text-[#1e4b7a] transition-colors hover:border-[#fe6801] hover:text-[#fe6801]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/_ship2sell/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] bg-white text-[#1e4b7a] transition-colors hover:border-[#fe6801] hover:text-[#fe6801]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                aria-label="Contact"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[20px] border border-[#d9e2ec] bg-white text-[#1e4b7a] transition-colors hover:border-[#fe6801] hover:text-[#fe6801]"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-[0.88rem] leading-7 text-slate-500">
              Need route guidance or shipment support? Reach out through our contact page and our team will direct you to the right desk.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-center text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>&copy; {new Date().getFullYear()} ship2sell Logistics. All rights reserved.</p>
          <div className="flex items-center justify-center gap-5 sm:justify-end">
            <Link href="/privacy" className="transition-colors hover:text-[#1e4b7a]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#1e4b7a]">Terms</Link>
            <Link href="/fraud-awareness" className="transition-colors hover:text-[#1e4b7a]">Fraud</Link>
            <Link href="/contact" className="transition-colors hover:text-[#1e4b7a]">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
