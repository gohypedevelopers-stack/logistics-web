import Link from "next/link";
import { Share2, Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white text-slate-500 pt-16 pb-10 border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="col-span-1 border-r border-slate-100 pr-8">
             <span className="text-[20px] font-bold tracking-tight text-[#1E1B4B] block mb-4">
               Global<span className="text-[#818CF8]">Navigator</span>
             </span>
             <p className="text-xs font-medium leading-relaxed max-w-xs text-slate-400">
               Redefining international logistics through data-driven clarity and premium service standards.
             </p>
          </div>

          {/* LINK COLUMNS */}
          <div className="col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[#1E1B4B] font-bold tracking-wide text-xs mb-6">Services</h4>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><Link href="/services" className="hover:text-slate-800 transition-colors">Air Freight</Link></li>
                <li><Link href="/services" className="hover:text-slate-800 transition-colors">Ocean Shipping</Link></li>
                <li><Link href="/services" className="hover:text-slate-800 transition-colors">Express Courier</Link></li>
                <li><Link href="/services" className="hover:text-slate-800 transition-colors">Warehousing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#1E1B4B] font-bold tracking-wide text-xs mb-6">Company</h4>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><Link href="/about" className="hover:text-slate-800 transition-colors">Global Coverage</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link></li>
                <li><Link href="/api" className="hover:text-slate-800 transition-colors">API Docs</Link></li>
              </ul>
            </div>
          </div>

          {/* SOCIAL & COPYRIGHT */}
          <div className="col-span-1">
             <h4 className="text-[#1E1B4B] font-bold tracking-wide text-xs mb-6">Follow Us</h4>
             <div className="flex gap-4 mb-8">
                <a href="#" className="text-[#1E1B4B] hover:text-[#818CF8] transition-colors"><Share2 className="w-4 h-4" /></a>
                <a href="#" className="text-[#1E1B4B] hover:text-[#818CF8] transition-colors"><Globe className="w-4 h-4" /></a>
                <a href="#" className="text-[#1E1B4B] hover:text-[#818CF8] transition-colors"><Mail className="w-4 h-4" /></a>
             </div>
             <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
               &copy; {new Date().getFullYear()} GlobalNavigator Logistics. All rights reserved.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
