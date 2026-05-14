import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-slate-500 pt-16 pb-10 border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
          <div className="col-span-1 border-b border-slate-100 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div className="mb-4">
              <Image src="/logo.png" alt="ship2sell logo" width={132} height={52} className="h-12 w-auto object-contain" />
            </div>
            <p className="text-xs font-medium leading-relaxed max-w-xs text-slate-400">
              Redefining international logistics through data-driven clarity and premium service standards.
            </p>
          </div>

          <div className="col-span-2 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h4 className="text-[#1e4b7a] font-bold tracking-wide text-xs mb-6">Services</h4>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><Link href="/services#air-freight" className="hover:text-slate-800 transition-colors">Air Freight</Link></li>
                <li><Link href="/services#ocean-freight" className="hover:text-slate-800 transition-colors">Ocean Shipping</Link></li>
                <li><Link href="/services#express-courier" className="hover:text-slate-800 transition-colors">Express Courier</Link></li>
                <li><Link href="/services#warehousing" className="hover:text-slate-800 transition-colors">Warehousing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#1e4b7a] font-bold tracking-wide text-xs mb-6">Company</h4>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><Link href="/about" className="hover:text-slate-800 transition-colors">Global Coverage</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-span-1 border-t border-slate-100 pt-8 md:border-0 md:pt-0">
            <h4 className="text-[#1e4b7a] font-bold tracking-wide text-xs mb-6">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              <a
                href="https://www.facebook.com/profile.php?id=61589313998002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#1e4b7a] hover:text-[#fe6801] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/_ship2sell/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#1e4b7a] hover:text-[#fe6801] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a href="/contact" aria-label="Contact" className="text-[#1e4b7a] hover:text-[#fe6801] transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
              &copy; {new Date().getFullYear()} ship2sell Logistics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
