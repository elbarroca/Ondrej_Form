"use client";

import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  CheckSquareIcon,
  ReceiptIcon,
  UsersIcon,
  BuildingIcon,
  SettingsIcon,
  ChevronDownIcon,
  SearchIcon,
  BellIcon,
  HelpCircleIcon,
  PlusIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardShell>{children}</DashboardShell>
      </ToastProvider>
    </AuthProvider>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  agreements: "My reports",
  approvals: "Approvals",
  receivables: "Receivables",
  team: "Team",
  organization: "Organization",
  identity: "Settings",
  new: "New report",
};

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, canApprove } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const pendingApprovals = 3;

  const displayName = user?.name ?? "Mette Karlsen";
  const displayEmail = user?.email ?? "mette@bergen.kommune.no";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const groups: NavGroup[] = [
    {
      label: "Workspace",
      items: [
        { href: "/dashboard", label: "Overview", icon: <LayoutDashboardIcon className="size-4" /> },
        { href: "/dashboard/agreements", label: "My reports", icon: <FileTextIcon className="size-4" /> },
        ...(canApprove
          ? [{ href: "/dashboard/approvals", label: "Approvals", icon: <CheckSquareIcon className="size-4" />, badge: pendingApprovals }]
          : []),
        { href: "/dashboard/receivables", label: "Receivables", icon: <ReceiptIcon className="size-4" /> },
      ],
    },
    {
      label: "Organization",
      items: [
        { href: "/dashboard/team", label: "Team", icon: <UsersIcon className="size-4" /> },
        { href: "/dashboard/organization", label: "Organization", icon: <BuildingIcon className="size-4" /> },
        { href: "/dashboard/identity", label: "Settings", icon: <SettingsIcon className="size-4" /> },
      ],
    },
  ];

  const breadcrumbSegments = pathname.split("/").filter(Boolean);
  const hasNotifications = true;

  return (
    <div className="min-h-screen bg-paper" data-density="comfy">
      <div className="flex">
        {/* Sidebar */}
        <aside className="flex flex-col border-r border-line bg-white h-screen sticky top-0 w-[244px] max-md:w-16 z-40 shrink-0">
          {/* Logo */}
          <div className="px-[14px] pt-[18px] pb-4">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="grid size-[30px] place-items-center rounded-lg bg-brand text-white shadow-sm">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-semibold text-sm tracking-tight max-md:hidden">Reimburse</span>
            </Link>
          </div>
          {/* Org switcher */}
          <div className="px-[14px] mb-[14px] max-md:hidden">
            <button type="button" className="flex w-full items-center gap-2.5 rounded-[10px] border border-line px-2.5 py-2 transition-colors hover:border-brand/35">
              <div className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-gradient-to-br from-amber to-red text-white text-[11px] font-bold">BK</div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-semibold">Bergen kommune</p>
                <p className="text-[11px] text-mute">Finance admin</p>
              </div>
              <ChevronDownIcon className="size-3.5 shrink-0 text-mute" />
            </button>
          </div>
          {/* Nav */}
          <nav className="flex flex-col gap-[18px] flex-1 px-[14px] overflow-auto">
            {groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-0.5">
                <span className="text-[10.5px] font-semibold text-mute uppercase tracking-[.1em] px-3 pb-1.5 pt-1 max-md:hidden">{group.label}</span>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors max-md:justify-center max-md:px-2.5", isActive(item.href) ? "bg-brand/8 text-brand" : "text-ink hover:bg-ink/4")}
                  >
                    <span className={cn("shrink-0", isActive(item.href) ? "text-brand" : "text-mute")}>{item.icon}</span>
                    <span className="max-md:hidden">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto rounded-full bg-brand-light px-[7px] py-[2px] text-[10.5px] font-semibold text-brand-dark max-md:hidden">{item.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          {/* User chip */}
          <div className="mt-auto border-t border-line px-[14px] py-[14px]">
            <button type="button" className="flex w-full items-center gap-2.5 rounded-[10px] p-2 transition-colors hover:bg-ink/4">
              <div className="grid size-[30px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white text-xs font-semibold">{initials}</div>
              <div className="min-w-0 flex-1 text-left max-md:hidden">
                <p className="text-[13px] font-semibold truncate">{displayName}</p>
                <p className="text-[11.5px] text-mute truncate">{displayEmail}</p>
              </div>
              <ChevronDownIcon className="size-3.5 shrink-0 text-mute max-md:hidden" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-paper px-7 py-3">
            <nav className="inline-flex items-center gap-2 text-[13px] text-mute">
              {breadcrumbSegments.map((seg, i) => {
                const href = "/" + breadcrumbSegments.slice(0, i + 1).join("/");
                const current = i === breadcrumbSegments.length - 1;
                return (
                  <span key={seg} className="inline-flex items-center gap-2">
                    {i > 0 && <ChevronRightIcon className="size-3 text-line" />}
                    {current ? (
                      <span className="font-medium text-ink">{LABEL_MAP[seg] || seg}</span>
                    ) : (
                      <Link href={href} className="hover:text-ink transition-colors">{LABEL_MAP[seg] || seg}</Link>
                    )}
                  </span>
                );
              })}
            </nav>
            <div className="inline-flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-1.5 text-[13px] text-mute min-w-[240px] transition-colors hover:border-brand/30">
                <SearchIcon className="size-3.5" />
                <span className="flex-1 text-left">Search reports...</span>
                <kbd className="ml-auto rounded px-1.5 py-px border border-line bg-paper text-[11px] text-mute font-mono">⌘K</kbd>
              </button>
              <button type="button" className="relative grid size-[34px] place-items-center rounded-[9px] border border-line bg-white text-mute transition-all hover:text-ink hover:border-brand/30" aria-label="Notifications">
                <BellIcon className="size-4" />
                {hasNotifications && <span className="absolute top-[7px] right-[7px] size-[7px] rounded-full bg-red border-2 border-white" />}
              </button>
              <button type="button" className="grid size-[34px] place-items-center rounded-[9px] border border-line bg-white text-mute transition-all hover:text-ink hover:border-brand/30" aria-label="Help">
                <HelpCircleIcon className="size-4" />
              </button>
              <Link href="/dashboard/agreements/new">
                <Button variant="primary" size="sm">
                  <PlusIcon className="size-3.5 mr-1.5" />
                  New report
                </Button>
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 mx-auto w-full max-w-[1240px] px-7 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
