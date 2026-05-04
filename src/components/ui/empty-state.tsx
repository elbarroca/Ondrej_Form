import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type React from "react"

type EmptyStateProps = {
  icon?: React.ReactNode
  headline: string
  helper: string
  cta?: { label: string; href?: string; onClick?: () => void }
  className?: string
}

export function EmptyState({
  icon,
  headline,
  helper,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center py-16 text-center", className)}>
      {icon && (
        <span className="mb-4 text-mute">{icon}</span>
      )}
      <p className="text-base font-semibold">{headline}</p>
      <p className="mt-1 max-w-sm text-[13.5px] text-mute">{helper}</p>
      {cta && (
        <div className="mt-5">
          {cta.href ? (
            <a href={cta.href}>
              <Button variant="primary">{cta.label}</Button>
            </a>
          ) : (
            <Button variant="primary" onClick={cta.onClick}>
              {cta.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
