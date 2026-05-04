"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { ReportStatus } from "@/lib/types"
import { ChevronRightIcon } from "lucide-react"
import type React from "react"

type ReportRowProps = {
  id: string
  title: string
  reference: string
  status: ReportStatus
  amount: string
  date: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function ReportRow({
  id,
  title,
  reference,
  status,
  amount,
  date,
  icon,
  href,
  onClick,
  className,
}: ReportRowProps) {
  const content = (
    <>
      <span className="grid size-7 place-items-center rounded-md bg-paper text-mute">
        {icon || (
          <svg
            className="size-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13.5px] font-semibold">{title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[12px] text-mute">{reference}</span>
          <span className="size-[3px] rounded-full bg-line" />
          <span className="text-[12px] text-mute">{date}</span>
        </div>
      </div>
      <Badge variant={status} withDot />
      <span className="text-right text-[13.5px] font-semibold tabular-nums">{amount}</span>
      <span className="text-right text-mute">
        <ChevronRightIcon className="size-4" />
      </span>
    </>
  )

  const rowClass = cn(
    "grid items-center gap-[14px] border-b border-line-soft last:border-b-0 transition-colors",
    "grid-cols-[28px_1fr_110px_110px_30px]",
    "cursor-pointer hover:bg-brand/2.5",
    className
  )
  const paddingClass = { padding: "var(--row-pad, 14px) 20px" }

  if (href) {
    return (
      <Link href={href} className={rowClass} style={paddingClass}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowClass, "w-full text-left")}
      style={paddingClass}
    >
      {content}
    </button>
  )
}

export type { ReportStatus }
