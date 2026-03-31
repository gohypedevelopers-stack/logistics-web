import { cn } from "@/lib/utils";
import { formatShipmentStatus, getShipmentStatusMeta } from "@/lib/shipment-utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const meta = getShipmentStatusMeta(status);

  return (
    <span className={cn(
      "inline-flex min-w-[108px] items-center justify-center rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors",
      meta.tone,
      className
    )}>
      {formatShipmentStatus(status)}
    </span>
  );
}
