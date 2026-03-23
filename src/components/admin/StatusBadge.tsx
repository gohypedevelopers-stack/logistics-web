import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  SUBMITTED: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  ACCEPTED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  PICKUP_SCHEDULED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  PICKED_UP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  IN_TRANSIT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  OUT_FOR_DELIVERY: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  DELIVERED: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  REJECTED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  ON_HOLD: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.SUBMITTED;

  return (
    <span className={cn(
      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 inline-flex items-center justify-center min-w-[100px]",
      config.bg,
      config.text,
      config.border,
      className
    )}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
