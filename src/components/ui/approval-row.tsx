import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ApprovalRowProps = {
  submitterName: string
  submitterInitials: string
  amount: string
  title: string
  when: string
  onClick?: () => void
  onApprove?: () => void
  onReject?: () => void
  className?: string
}

export function ApprovalRow({
  submitterName,
  submitterInitials,
  amount,
  title,
  when,
  onClick,
  onApprove,
  onReject,
  className,
}: ApprovalRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-line-soft last:border-b-0 transition-colors hover:bg-brand/2.5 cursor-pointer",
        className
      )}
      style={{ padding: "var(--row-pad, 14px) 20px" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.()
      }}
    >
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-brand text-xs font-semibold">
        {submitterInitials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px]">
          <span className="font-semibold text-ink">{submitterName}</span>
          <span className="text-mute"> · {amount}</span>
        </p>
        <p className="text-[12px] text-mute mt-0.5">
          {title} · {when}
        </p>
      </div>
      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="mini"
          size="sm"
          miniVariant="danger"
          onClick={onReject}
        >
          Reject
        </Button>
        <Button
          variant="mini"
          size="sm"
          miniVariant="primary"
          onClick={onApprove}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}
