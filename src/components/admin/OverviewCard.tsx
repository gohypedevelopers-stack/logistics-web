import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  colorClass: "blue" | "amber" | "indigo" | "teal" | "green" | "red" | "slate"; 
  className?: string;
}

const colorMapByClass: Record<string, { iconBg: string; iconText: string; activeRing: string; accentBorder: string }> = {
  blue: { iconBg: "bg-blue-50/50", iconText: "text-blue-700", activeRing: "ring-blue-500/10", accentBorder: "border-blue-200" },
  amber: { iconBg: "bg-amber-50/50", iconText: "text-amber-700", activeRing: "ring-amber-500/10", accentBorder: "border-amber-200" },
  indigo: { iconBg: "bg-indigo-50/50", iconText: "text-indigo-700", activeRing: "ring-indigo-500/10", accentBorder: "border-indigo-200" },
  teal: { iconBg: "bg-teal-50/50", iconText: "text-teal-700", activeRing: "ring-teal-500/10", accentBorder: "border-teal-200" },
  green: { iconBg: "bg-green-50/50", iconText: "text-green-700", activeRing: "ring-green-500/10", accentBorder: "border-green-200" },
  red: { iconBg: "bg-red-50/50", iconText: "text-red-700", activeRing: "ring-red-500/10", accentBorder: "border-red-200" },
  slate: { iconBg: "bg-slate-50/50", iconText: "text-slate-700", activeRing: "ring-slate-500/10", accentBorder: "border-slate-200" },
};

export function OverviewCard({ title, count, icon: Icon, colorClass, className }: OverviewCardProps) {
  const colors = colorMapByClass[colorClass] || colorMapByClass.slate;

  return (
    <div className={cn("bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-500 group hover:shadow-xl hover:shadow-cyan-900/5 hover:border-cyan-200 ring-1 ring-slate-100/50", className)}>
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className={cn("p-3 rounded-2xl ring-4 ring-transparent group-hover:ring-8 transition-all duration-700 shadow-sm border", colors.iconBg, colors.activeRing, colors.accentBorder)}>
          <Icon className={cn("w-6 h-6 opacity-80", colors.iconText)} />
        </div>
        <div className="text-4xl font-black text-[#1E1B4B] tracking-tighter transition-all group-hover:scale-110 origin-right duration-500">{count}</div>
      </div>
      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-2 transition-colors group-hover:text-cyan-700">{title}</div>
    </div>
  );
}
