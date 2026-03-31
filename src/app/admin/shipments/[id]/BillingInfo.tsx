"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { updateShipmentAction } from "./actions";
import { cn } from "@/lib/utils";

interface BillingInfoProps {
  shipmentId: string;
  currentStatus: string;
  paymentStatus: string;
}

export function BillingInfo({ shipmentId, currentStatus, paymentStatus }: BillingInfoProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handlePaymentUpdate(formData: FormData) {
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateShipmentAction(formData);
        router.refresh();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (error) {
        console.error("Payment update failed", error);
      }
    });
  }

  return (
    <div className="app-card p-6">
       <h3 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          <CreditCard className="w-3 h-3" /> Billing Info
       </h3>
       <form action={handlePaymentUpdate} className="space-y-4">
          <input type="hidden" name="shipmentId" value={shipmentId} />
          <input type="hidden" name="status" value={currentStatus} />
          <select 
             name="paymentStatus" 
             defaultValue={paymentStatus} 
             disabled={isPending}
             className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
          >
             {['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'].map(ps => (
               <option key={ps} value={ps}>{ps}</option>
             ))}
          </select>
          <button 
            type="submit" 
            disabled={isPending}
            className={cn(
               "flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold uppercase transition-all",
               isPending ? "text-slate-400" : 
               success ? "text-teal-600" : "text-blue-600 hover:text-blue-800"
            )}
          >
             {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
             ) : success ? (
                <CheckCircle2 className="w-3 h-3" />
             ) : null}
             {isPending ? "UPDATING..." : success ? "SAVED!" : "Update Payment"}
          </button>
       </form>
    </div>
  );
}
