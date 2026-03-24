"use client";

import { useTransition, useState, useOptimistic } from "react";
import { Send, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { updateShipmentAction } from "./actions";
import { cn } from "@/lib/utils";

interface StatusUpdateFormProps {
  shipmentId: string;
  currentStatus: string;
  currentAwb: string;
  allStatuses: string[];
}

export function StatusUpdateForm({ shipmentId, currentStatus, currentAwb, allStatuses }: StatusUpdateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);

  async function handleSubmit(formData: FormData) {
    const newStatus = formData.get("status") as string;
    setSuccess(false);
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        await updateShipmentAction(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Clear success after 3s
      } catch (error) {
        console.error("Update failed", error);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden">
      <h3 className="font-bold text-[#1E293B] mb-6 flex items-center gap-2">
         <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
            <Send className="w-4 h-4" />
         </span>
         Update Status
      </h3>
      
      <form action={handleSubmit} className="space-y-6">
         <input type="hidden" name="shipmentId" value={shipmentId} />
         
         <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Status</label>
            <select 
              name="status" 
              defaultValue={optimisticStatus} 
              disabled={isPending}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all disabled:opacity-50"
            >
               {allStatuses.map(s => (
                 <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
               ))}
            </select>
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Assign AWB / Tracking</label>
            <input 
              name="awb" 
              type="text" 
              defaultValue={currentAwb} 
              placeholder="e.g. DHL-901-X"
              disabled={isPending}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Current Location</label>
            <input 
              name="location" 
              type="text" 
              placeholder="e.g. Heathrow Gateway"
              disabled={isPending}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Notes / Instructions</label>
            <textarea 
              name="notes" 
              placeholder="Add an update for the customer..." 
              rows={4}
              disabled={isPending}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-blue-400 transition-all resize-none disabled:opacity-50"
            />
         </div>

         <button 
           type="submit" 
           disabled={isPending}
           className={cn(
             "w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-xs transition-all shadow-lg",
             isPending ? "bg-slate-100 text-slate-400 cursor-not-allowed" : 
             success ? "bg-teal-600 text-white" : "bg-[#1E1B4B] hover:bg-slate-900 text-white hover:scale-[1.02] active:scale-[0.98]"
           )}
         >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> CHANGES SAVED!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> SAVE CHANGES
              </>
            )}
         </button>
      </form>
    </div>
  );
}
