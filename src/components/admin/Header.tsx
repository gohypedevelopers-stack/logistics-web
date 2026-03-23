import { Search, Bell, User } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-[#1E293B] tracking-tight flex items-center gap-2">
          {title}
        </h2>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:bg-white focus-within:border-blue-400 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-48 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="w-px h-6 bg-slate-200 mx-1" />
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm tracking-tighter group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
              AD
            </div>
            <div className="hidden lg:block">
               <p className="text-[11px] font-bold text-slate-900 leading-none">Admin User</p>
               <p className="text-[10px] font-medium text-slate-400 mt-1 leading-none">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
