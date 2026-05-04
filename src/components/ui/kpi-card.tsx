import { cn } from "@/lib/utils"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"
import type React from "react"

type KpiVariant = "default" | "amber" | "emerald" | "violet"

type KpiCardProps = {
  label: string
  value: string
  icon?: React.ReactNode
  trend?: { direction: "up" | "down" | "neutral"; text: string }
  variant?: KpiVariant
  className?: string
}

const iconTileColors: Record<KpiVariant, string> = {
  default: "bg-brand/8 text-brand",
  amber: "bg-amber-bg text-amber-text",
  emerald: "bg-emerald-bg text-emerald-text",
  violet: "bg-purple-100 text-purple-700",
}

const trendColors = {
  up: "text-emerald",
  down: "text-red",
  neutral: "text-mute",
}

const TrendIcon = {
  up: TrendingUpIcon,
  down: TrendingDownIcon,
  neutral: MinusIcon,
}

export function KpiCard({
  label,
  value,
  icon,
  trend,
  variant = "default",
  className,
}: KpiCardProps) {
  const Trend = trend ? TrendIcon[trend.direction] : null

  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-white p-[18px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-mute">{label}</span>
        <span
          className={cn(
            "grid size-7 place-items-center rounded-md",
            iconTileColors[variant]
          )}
        >
          {icon}
        </span>
      </div>
      <p
        className="mt-1.5 text-[length:var(--kpi-size)] font-semibold tracking-[-0.02em] tabular-nums"
        style={{ fontSize: "var(--kpi-size, 28px)" }}
      >
        {value}
      </p>
      {trend && Trend && (
        <span
          className={cn(
            "mt-1 inline-flex items-center gap-1 text-xs",
            trendColors[trend.direction]
          )}
        >
          <Trend className="size-3" />
          {trend.text}
        </span>
      )}
    </div>
  )
}
