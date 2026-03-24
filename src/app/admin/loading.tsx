import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-pulse">
       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
       </div>
       <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-100 rounded-lg mx-auto" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg mx-auto opacity-60" />
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 w-full max-w-[1400px] mt-12 px-4">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="h-28 bg-slate-50 border border-slate-100 rounded-2xl" />
          ))}
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-[1400px] mt-12 px-4">
          <div className="lg:col-span-1 h-80 bg-slate-50 border border-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-80 bg-slate-50 border border-slate-100 rounded-2xl" />
       </div>
    </div>
  );
}
