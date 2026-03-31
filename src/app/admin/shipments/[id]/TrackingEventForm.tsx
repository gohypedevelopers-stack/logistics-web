"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Milestone } from "lucide-react";
import { addTrackingEventAction } from "./actions";
import { formatShipmentStatus } from "@/lib/shipment-utils";
import { cn } from "@/lib/utils";

interface TrackingEventFormProps {
  shipmentId: string;
  allStatuses: string[];
}

export function TrackingEventForm({
  shipmentId,
  allStatuses,
}: TrackingEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaved(false);

    startTransition(async () => {
      try {
        await addTrackingEventAction(formData);
        router.refresh();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (error) {
        console.error("Tracking event update failed", error);
      }
    });
  }

  return (
    <div className="app-card overflow-hidden p-8">
      <h3 className="mb-6 flex items-center gap-3 font-semibold text-slate-900">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Milestone className="w-4 h-4" />
        </span>
        Tracking Update
      </h3>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="shipmentId" value={shipmentId} />

        <div className="space-y-2">
          <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Event Title
          </label>
          <input
            name="title"
            placeholder="e.g. Customs cleared"
            disabled={isPending}
            className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Optional Status
          </label>
          <select
            name="status"
            defaultValue=""
            disabled={isPending}
            className="app-input w-full px-4 text-sm font-medium disabled:opacity-50"
          >
            <option value="">Keep current shipment status</option>
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {formatShipmentStatus(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              name="location"
              placeholder="Warehouse, hub, city, or checkpoint"
              disabled={isPending}
              className="app-input w-full pl-11 pr-4 text-sm font-medium disabled:opacity-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Note
          </label>
          <textarea
            name="note"
            rows={4}
            placeholder="Add a customer-visible tracking note"
            disabled={isPending}
            className="app-textarea w-full resize-none p-4 text-sm font-medium disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full flex items-center justify-center gap-3 rounded-xl py-4 text-xs font-bold transition-all",
            isPending
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : saved
                ? "bg-emerald-600 text-white"
                : "bg-[#3146d3] text-white hover:bg-[#2537b8]",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> SAVING UPDATE...
            </>
          ) : saved ? (
            "TRACKING UPDATED"
          ) : (
            "ADD TRACKING EVENT"
          )}
        </button>
      </form>
    </div>
  );
}
