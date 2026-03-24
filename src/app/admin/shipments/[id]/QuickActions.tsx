"use client";

import { useTransition, useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updateShipmentAction } from "./actions";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  shipmentId: string;
}

export function QuickActions({ shipmentId }: QuickActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  async function handleAction(status: string) {
    setSelectedAction(status);
    const formData = new FormData();
    formData.append("shipmentId", shipmentId);
    formData.append("status", status);
    
    startTransition(async () => {
      try {
        await updateShipmentAction(formData);
      } catch (error) {
        console.error("Action failed", error);
      } finally {
        setSelectedAction(null);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-amber-200 shadow-lg shadow-amber-900/5">
       <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-[#1E293B]">Action Required</h3>
       </div>
       <div className="grid grid-cols-1 gap-3">
             <button 
                onClick={() => handleAction('ACCEPTED')}
                disabled={isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 bg-[#1E1B4B] hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-all disabled:opacity-50",
                  selectedAction === 'ACCEPTED' && isPending ? "cursor-wait" : ""
                )}
             >
                {selectedAction === 'ACCEPTED' && isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {isPending && selectedAction === 'ACCEPTED' ? "PROCESSING..." : "ACCEPT SHIPMENT"}
             </button>

             <button 
                onClick={() => handleAction('REJECTED')}
                disabled={isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-all disabled:opacity-50",
                  selectedAction === 'REJECTED' && isPending ? "cursor-wait" : ""
                )}
             >
                {selectedAction === 'REJECTED' && isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                {isPending && selectedAction === 'REJECTED' ? "REJECTING..." : "REJECT / BLOCK"}
             </button>
       </div>
    </div>
  );
}
