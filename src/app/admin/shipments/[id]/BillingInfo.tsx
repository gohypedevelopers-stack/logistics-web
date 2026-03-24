"use client";

import { useTransition, useState } from "react";
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

  async function handlePaymentUpdate(formData: FormData) {
    setSuccess(false);
    startTransition(async () => {
      try {
        await updateShipmentAction(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch (error) {
        console.error("Payment update failed", error);
      }
    });
  }

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-slate-200">
       <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CreditCard className="w-3 h-3" /> Billing Info
       </h3>
       <form action={handlePaymentUpdate} className="space-y-4">
          <input type="hidden" name="shipmentId" value={shipmentId} />
          <input type="hidden" name="status" value={currentStatus} />
          <select 
             name="paymentStatus" 
             defaultValue={paymentStatus} 
             disabled={isPending}
             className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none disabled:opacity-50"
          >
             {['UNPAID', 'PARTIAL', 'PAID', 'OVERDUE'].map(ps => (
               <option key={ps} value={ps}>{ps}</option>
             ))}
          </select>
          <button 
            type="submit" 
            disabled={isPending}
            className={cn(
               "w-full text-xs font-bold transition-all uppercase py-2 flex items-center justify-center gap-2",
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
