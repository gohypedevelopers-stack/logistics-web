import Link from "next/link";
import { LayoutDashboard, MapPin, PlusSquare, Contact, Receipt, Search, Bell, User, Rocket } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col hidden md:flex h-full relative z-20">
        <div className="p-8 pb-10">
           <div className="flex gap-3 items-center">
             <div className="w-10 h-10 bg-[#1E1B4B] rounded-xl flex items-center justify-center shrink-0">
                <Rocket className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="font-bold text-[#1E1B4B] text-lg leading-tight tracking-tight">Logistics Intel</h1>
               <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Enterprise Tier</p>
             </div>
           </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/customer/dashboard" className="flex items-center gap-4 px-5 py-3.5 rounded-xl bg-cyan-50 text-[#1E1B4B] font-bold transition-colors">
            <LayoutDashboard className="w-5 h-5 text-[#1E1B4B]" />
            <span className="text-sm">Overview</span>
          </Link>
          <Link href="/customer/shipments" className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="text-sm">Track</span>
          </Link>
          <Link href="/customer/shipments/new" className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <PlusSquare className="w-5 h-5" />
            <span className="text-sm">New Shipment</span>
          </Link>
          <Link href="/customer/addresses" className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Contact className="w-5 h-5" />
            <span className="text-sm">Addresses</span>
          </Link>
          <Link href="/customer/invoices" className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors">
            <Receipt className="w-5 h-5" />
            <span className="text-sm">Billing</span>
          </Link>
        </nav>
        
        <div className="p-6">
          <Link href="/customer/shipments/new" className="flex items-center justify-center gap-2 w-full bg-[#1E1B4B] text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#2A377B] transition-colors">
            <span>+</span> Create Shipment
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        {/* Top Header */}
        <header className="h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-12">
             <Link href="/" className="flex items-center gap-1">
               <span className="text-[20px] font-bold tracking-tight text-[#1E1B4B]">
                 Global<span className="text-[#818CF8]">Navigator</span>
               </span>
             </Link>
             
             <nav className="hidden lg:flex items-center gap-8">
               <Link href="/customer/dashboard" className="text-sm font-bold text-[#1E1B4B] border-b-2 border-[#818CF8] py-2">Dashboard</Link>
               <Link href="/customer/shipments" className="text-sm font-medium text-slate-500 hover:text-[#1E1B4B] py-2">Shipments</Link>
               <Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#1E1B4B] py-2">Reports</Link>
               <Link href="#" className="text-sm font-medium text-slate-500 hover:text-[#1E1B4B] py-2">Documents</Link>
             </nav>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative hidden md:block w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search tracking ID..." className="w-full h-11 bg-slate-100 rounded-full pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 ring-indigo-500/20 text-slate-700 placeholder:text-slate-400" />
             </div>
             <div className="flex items-center gap-4">
                <div className="relative cursor-pointer">
                   <Bell className="w-5 h-5 text-slate-500" />
                   <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></div>
                </div>
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm border border-orange-200">
                   <User className="w-5 h-5 fill-current" />
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
