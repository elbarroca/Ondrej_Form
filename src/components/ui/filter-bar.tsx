"use client"

import { cn } from "@/lib/utils"
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

type FilterPill = {
  key: string
  label: string
  count?: number
  active?: boolean
}

type FilterBarProps = {
  pills: FilterPill[]
  onPillClick?: (key: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  onMoreFilters?: () => void
  searchPlaceholder?: string
  className?: string
  children?: React.ReactNode
}

export function FilterBar({
  pills,
  onPillClick,
  searchValue,
  onSearchChange,
  onMoreFilters,
  searchPlaceholder = "Search...",
  className,
  children,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-[12px] border border-line bg-white p-3",
        className
      )}
    >
      <div className="flex items-center gap-1 border-r border-line pr-2">
        {pills.map((pill) => (
          <button
            key={pill.key}
            type="button"
            onClick={() => onPillClick?.(pill.key)}
            className={cn(
              "rounded-[7px] px-2.5 py-[5px] text-[12.5px] transition-colors",
              pill.active
                ? "bg-brand/8 text-brand font-semibold"
                : "text-mute hover:text-ink"
            )}
          >
            {pill.label}
            {pill.count !== undefined && (
              <span className="ml-1 font-medium text-mute">{pill.count}</span>
            )}
          </button>
        ))}
      </div>

      {onSearchChange && (
        <div className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-2.5 py-1.5 text-[13px] text-mute">
          <SearchIcon className="size-3.5" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-40 bg-transparent outline-none placeholder:text-mute"
          />
        </div>
      )}

      {children}

      <div className="flex-1" />

      {onMoreFilters && (
        <button
          type="button"
          onClick={onMoreFilters}
          className="inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-[5px] text-[12.5px] text-mute hover:text-ink transition-colors"
        >
          <SlidersHorizontalIcon className="size-3.5" />
          More filters
        </button>
      )}
    </div>
  )
}
