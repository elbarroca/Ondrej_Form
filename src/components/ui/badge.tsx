import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-[5px] rounded-full border px-[9px] py-[3px] text-[11.5px] font-semibold w-fit",
  {
    variants: {
      variant: {
        draft:
          "bg-[rgba(148,163,184,0.12)] text-[#475569] border-[rgba(148,163,184,0.25)]",
        submitted:
          "bg-[rgba(245,158,11,0.10)] text-[#b45309] border-[rgba(245,158,11,0.25)]",
        approved:
          "bg-[rgba(16,185,129,0.10)] text-[#047857] border-[rgba(16,185,129,0.25)]",
        rejected:
          "bg-[rgba(239,68,68,0.10)] text-[#b91c1c] border-[rgba(239,68,68,0.25)]",
        neutral:
          "bg-paper text-mute border-line",
        brand:
          "bg-brand/8 text-brand border-brand/25",
        secondary:
          "bg-secondary text-secondary-foreground border-transparent",
        default:
          "bg-primary text-primary-foreground border-transparent",
        outline:
          "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

type BadgeProps = VariantProps<typeof badgeVariants> & {
  withDot?: boolean
  label?: string
  children?: React.ReactNode
  className?: string
}

function Badge({ variant = "neutral", withDot, label, children, className }: BadgeProps) {
  const labelMap: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    approved: "Approved",
    rejected: "Rejected",
  }

  return (
    <span
      role="status"
      className={cn(badgeVariants({ variant }), className)}
    >
      {withDot && (
        <span
          className="size-[5px] rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children || label || (variant && labelMap[variant])}
    </span>
  )
}

export { Badge, badgeVariants, type BadgeProps }
