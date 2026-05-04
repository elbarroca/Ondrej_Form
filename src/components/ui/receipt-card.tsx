import { cn } from "@/lib/utils"
import { FileTextIcon } from "lucide-react"
import type { ReceiptCategory } from "@/lib/types"

type ReceiptCardProps = {
  name: string
  date: string
  amount: string
  category: ReceiptCategory
  onClick?: () => void
  className?: string
}

export function ReceiptCard({
  name,
  date,
  amount,
  category,
  onClick,
  className,
}: ReceiptCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "overflow-hidden rounded-[12px] border border-line bg-white text-left transition-all hover:border-brand/30 hover:shadow-[0_1px_2px_rgba(15,23,42,.04)]",
        className
      )}
    >
      <div className="relative grid h-[140px] place-items-center border-b border-line bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-[#94a3b8]">
        <FileTextIcon className="size-8" />
        <span className="absolute top-2 left-2 rounded-full bg-ink/80 px-[7px] py-[2px] text-[10.5px] font-semibold text-white">
          {category}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="truncate text-[13px] font-semibold">{name}</p>
        <div className="mt-1 flex justify-between text-[12px]">
          <span className="text-mute">{date}</span>
          <span className="font-semibold tabular-nums text-ink">{amount}</span>
        </div>
      </div>
    </button>
  )
}
