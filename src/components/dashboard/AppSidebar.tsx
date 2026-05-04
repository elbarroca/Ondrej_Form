"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  FileTextIcon,
  CheckSquareIcon,
  ReceiptIcon,
  UsersIcon,
  BuildingIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "lucide-react"

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

type NavGroup = {
  label: string
  items: NavItem[]
}

type AppSidebarProps = {
  orgName?: string
  orgCode?: string
  orgRole?: string
  userName?: string
  userEmail?: string
  userInitials?: string
  pendingApprovals?: number
  className?: string
}

export function AppSidebar({
  orgName = "Bergen kommune",
  orgCode = "BK",
  orgRole = "Finance admin",
  userName = "Mette Karlsen",
  userEmail = "mette@bergen.kommune.no",
  userInitials = "MK",
  pendingApprovals,
  className,
}: AppSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== "/app" && pathname.startsWith(href))

  const groups: NavGroup[] = [
    {
      label: "Workspace",
      items: [
        {
          href: "/app",
          label: "Overview",
          icon: <LayoutDashboardIcon className="size-4" />,
        },
        {
          href: "/app/reports",
          label: "My reports",
          icon: <FileTextIcon className="size-4" />,
        },
        {
          href: "/app/approvals",
          label: "Approvals",
          icon: <CheckSquareIcon className="size-4" />,
          badge: pendingApprovals,
        },
        {
          href: "/app/receivables",
          label: "Receivables",
          icon: <ReceiptIcon className="size-4" />,
        },
      ],
    },
    {
      label: "Organization",
      items: [
        {
          href: "/app/team",
          label: "Team",
          icon: <UsersIcon className="size-4" />,
        },
        {
          href: "/app/organization",
          label: "Organization",
          icon: <BuildingIcon className="size-4" />,
        },
        {
          href: "/app/settings",
          label: "Settings",
          icon: <SettingsIcon className="size-4" />,
        },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-line bg-white h-screen sticky top-0",
        "w-[244px] max-md:w-16",
        className
      )}
    >
      {/* Logo */}
      <div className="px-[14px] pt-[18px] pb-4">
        <Link href="/app" className="flex items-center gap-2.5">
          <div className="grid size-[30px] place-items-center rounded-lg bg-brand text-white shadow-[0_1px_2px_rgba(15,23,42,.04)]">
            <svg
              className="size-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight max-md:hidden">
            Reimburse
          </span>
        </Link>
      </div>

      {/* Org switcher */}
      <div className="px-[14px] mb-[14px] max-md:hidden">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-[10px] border border-line px-2.5 py-2 transition-colors hover:border-brand/35"
        >
          <div className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-gradient-to-br from-amber to-red text-white text-[11px] font-bold">
            {orgCode}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[13px] font-semibold">{orgName}</p>
            <p className="text-[11px] text-mute">{orgRole}</p>
          </div>
          <ChevronDownIcon className="size-3.5 shrink-0 text-mute" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex flex-col gap-[18px] flex-1 px-[14px]">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-semibold text-mute uppercase tracking-[.1em] px-3 pb-1.5 pt-1 max-md:hidden">
              {group.label}
            </span>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors",
                  "max-md:justify-center max-md:px-2.5",
                  isActive(item.href)
                    ? "bg-brand/8 text-brand"
                    : "text-ink hover:bg-ink/4"
                )}
              >
                <span
                  className={cn(
                    "shrink-0",
                    isActive(item.href) ? "text-brand" : "text-mute"
                  )}
                >
                  {item.icon}
                </span>
                <span className="max-md:hidden">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto rounded-full bg-brand-light px-[7px] py-[2px] text-[10.5px] font-semibold text-brand-dark max-md:hidden">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User chip */}
      <div className="mt-auto border-t border-line px-[14px] py-[14px]">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-ink/4"
        >
          <div className="grid size-[30px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white text-xs font-semibold">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1 text-left max-md:hidden">
            <p className="text-[13px] font-semibold truncate">{userName}</p>
            <p className="text-[11.5px] text-mute truncate">{userEmail}</p>
          </div>
          <ChevronDownIcon className="size-3.5 shrink-0 text-mute max-md:hidden" />
        </button>
      </div>
    </aside>
  )
}
