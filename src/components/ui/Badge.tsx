import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-white shadow hover:bg-[#0B0E27]": variant === "default",
          "border-transparent bg-secondary text-primary hover:bg-secondary/80": variant === "secondary",
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600": variant === "destructive",
          "text-slate-950": variant === "outline",
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200": variant === "success",
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
