import Link from "next/link";
import { LayoutDashboard, Truck, Package, Activity, FileText, Settings, Plus, HelpCircle, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFD]">
      {/* Sidebar */}
      <aside className="w-[260px] flex flex-col hidden lg:flex h-screen sticky top-0 border-r border-slate-100">
        
        {/* Brand */}
        <div className="p-8 pb-10">
           <h1 className="font-bold text-[#1E1B4B] text-xl leading-tight tracking-tight mb-1">Logistics HQ</h1>
           <p className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase">Enterprise Tier</p>
        </div>
        
        {/* Main Nav */}
        <nav className="flex-1 px-6 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#F0F4FF] text-[#3b4dbf] font-bold transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/shipments" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Truck className="w-5 h-5" />
            <span className="text-sm">Shipments</span>
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Package className="w-5 h-5" />
            <span className="text-sm">Rates &amp; Routes</span>
          </Link>
          <Link href="/admin/intelligence" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Intelligence</span>
          </Link>
          <Link href="/admin/documents" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Documents</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </Link>
        </nav>
        
        {/* Bottom Nav */}
        <div className="p-6 space-y-2">
          <Link href="/admin/shipments/new" className="flex items-center justify-center gap-2 w-full bg-[#1E1B4B] text-white py-3.5 mb-6 rounded-xl font-bold text-sm shadow-md hover:bg-[#2A377B] transition-colors">
            <Plus className="w-4 h-4" /> New Shipment
          </Link>

          <Link href="/admin/help" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-[10px]">?</div>
            <span className="text-sm">Help Center</span>
          </Link>
          <Link href="/admin/logout" className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </Link>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
