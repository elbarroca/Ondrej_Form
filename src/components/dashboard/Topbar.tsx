"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SearchIcon, BellIcon, HelpCircleIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

type TopbarProps = {
  hasNotifications?: boolean
  className?: string
}

export function Topbar({ hasNotifications, className }: TopbarProps) {
  const pathname = usePathname()

  // Derive breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
    current: i === segments.length - 1,
  }))

  // Simplify breadcrumb labels
  const labelMap: Record<string, string> = {
    App: "Dashboard",
    Reports: "My reports",
    Approvals: "Approvals",
    Receivables: "Receivables",
    Team: "Team",
    Organization: "Organization",
    Settings: "Settings",
    New: "New report",
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper px-7 py-3",
        className
      )}
    >
      {/* Breadcrumb */}
      <nav className="inline-flex items-center gap-2 text-[13px] text-mute">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="inline-flex items-center gap-2">
            {i > 0 && <ChevronRightIcon className="size-3 text-line" />}
            {crumb.current ? (
              <span className="font-medium text-ink">
                {labelMap[crumb.label] || crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-ink transition-colors">
                {labelMap[crumb.label] || crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="inline-flex items-center gap-2">
        {/* Search */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-1.5 text-[13px] text-mute min-w-[240px] transition-colors hover:border-brand/30"
        >
          <SearchIcon className="size-3.5" />
          <span className="flex-1 text-left">Search reports...</span>
          <kbd className="ml-auto rounded px-1.5 py-px border border-line bg-paper text-[11px] text-mute font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative grid size-[34px] place-items-center rounded-[9px] border border-line bg-white text-mute transition-all hover:text-ink hover:border-brand/30"
          aria-label="Notifications"
        >
          <BellIcon className="size-4" />
          {hasNotifications && (
            <span className="absolute top-[7px] right-[7px] size-[7px] rounded-full bg-red border-2 border-white" />
          )}
        </button>

        {/* Help */}
        <button
          type="button"
          className="grid size-[34px] place-items-center rounded-[9px] border border-line bg-white text-mute transition-all hover:text-ink hover:border-brand/30"
          aria-label="Help"
        >
          <HelpCircleIcon className="size-4" />
        </button>

        {/* New report */}
        <Link href="/app/reports/new">
          <Button variant="primary" size="sm" leftIcon={<PlusIcon className="size-3.5" />}>
            New report
          </Button>
        </Link>
      </div>
    </header>
  )
}
