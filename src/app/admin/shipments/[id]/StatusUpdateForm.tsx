"use client";

import { useTransition, useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { updateShipmentAction } from "./actions";
import { cn } from "@/lib/utils";
import { formatShipmentStatus } from "@/lib/shipment-utils";

interface StatusUpdateFormProps {
  shipmentId: string;
  currentStatus: string;
  currentAwb: string;
  currentReferenceNo: string;
  allStatuses: string[];
}

export function StatusUpdateForm({
  shipmentId,
  currentStatus,
  currentAwb,
  currentReferenceNo,
  allStatuses,
}: StatusUpdateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const newStatus = formData.get("status") as string;
    setSuccess(false);
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        await updateShipmentAction(formData);
        router.refresh();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Clear success after 3s
      } catch (error) {
        console.error("Update failed", error);
      }
    });
  }

  return (
    <div className="app-card overflow-hidden p-8">
      <h3 className="mb-6 flex items-center gap-3 font-semibold text-slate-900">
         <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Send className="w-4 h-4" />
         </span>
         Update Status
      </h3>
      
      <form action={handleSubmit} className="space-y-6">
         <input type="hidden" name="shipmentId" value={shipmentId} />
         
         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">New Status</label>
            <select 
              name="status" 
              defaultValue={optimisticStatus} 
              disabled={isPending}
              className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
            >
               {allStatuses.map(s => (
                 <option key={s} value={s}>{formatShipmentStatus(s)}</option>
               ))}
            </select>
         </div>

         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Assign AWB / Tracking</label>
            <input 
              name="awb" 
              type="text" 
              defaultValue={currentAwb} 
              placeholder="e.g. DHL-901-X"
              disabled={isPending}
              className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Reference Number</label>
            <input 
              name="referenceNo" 
              type="text" 
              defaultValue={currentReferenceNo} 
              placeholder="Client reference or order number"
              disabled={isPending}
              className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Current Location</label>
            <input 
              name="location" 
              type="text" 
              placeholder="e.g. Heathrow Gateway"
              disabled={isPending}
              className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Notes / Instructions</label>
            <textarea 
              name="notes" 
              placeholder="Add an update for the customer..." 
              rows={4}
              disabled={isPending}
              className="app-textarea w-full resize-none p-4 text-sm font-medium disabled:opacity-50"
            />
         </div>

         <div className="space-y-2">
            <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Rejection Reason</label>
            <textarea 
              name="rejectionReason" 
              placeholder="Required if the shipment is rejected"
              rows={3}
              disabled={isPending}
              className="app-textarea w-full resize-none p-4 text-sm font-medium disabled:opacity-50"
            />
         </div>

         <button 
           type="submit" 
           disabled={isPending}
           className={cn(
             "w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-xs transition-all shadow-lg",
             isPending ? "bg-slate-100 text-slate-400 cursor-not-allowed" : 
             success ? "bg-teal-600 text-white" : "bg-[#3146d3] hover:bg-[#2537b8] text-white"
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
