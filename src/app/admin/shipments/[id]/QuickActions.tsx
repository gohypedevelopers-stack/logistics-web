"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updateShipmentAction } from "./actions";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  shipmentId: string;
}

export function QuickActions({ shipmentId }: QuickActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction(status: string) {
    setSelectedAction(status);
    const formData = new FormData();
    formData.append("shipmentId", shipmentId);
    formData.append("status", status);
    
    startTransition(async () => {
      try {
        await updateShipmentAction(formData);
        router.refresh();
      } catch (error) {
        console.error("Action failed", error);
      } finally {
        setSelectedAction(null);
      }
    });
  }

  return (
    <div className="app-card p-8">
       <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Action Required</h3>
       </div>
       <div className="grid grid-cols-1 gap-3">
             <button 
                onClick={() => handleAction('ACCEPTED')}
                disabled={isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-3 rounded-xl bg-[#3146d3] py-4 text-xs font-bold text-white transition-all hover:bg-[#2537b8] disabled:opacity-50",
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
                  "w-full flex items-center justify-center gap-3 rounded-xl border border-red-200 bg-white py-4 text-xs font-bold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50",
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
