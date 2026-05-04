"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { SidebarUser } from "./SidebarUser"
import {
  BadgeCheck,
  CheckCircle,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Users,
} from "lucide-react"

interface AppSidebarProps {
  pendingApprovals?: number
}

export function AppSidebar({ pendingApprovals = 0 }: AppSidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()

  const isAdmin = profile?.role === "admin"
  const isApprover = profile?.role === "approver" || isAdmin

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      matchPatterns: ["/dashboard$"],
    },
    {
      label: "My Agreements",
      href: "/dashboard/agreements",
      icon: FileText,
      matchPatterns: ["/dashboard/agreements"],
    },
    {
      label: "Receivables",
      href: "/dashboard/receivables",
      icon: Receipt,
      matchPatterns: ["/dashboard/receivables"],
    },
    {
      label: "Approvals",
      href: "/dashboard/approvals",
      icon: CheckCircle,
      matchPatterns: ["/dashboard/approvals"],
      badge: pendingApprovals > 0 ? pendingApprovals : undefined,
      requiresRole: "approver" as const,
    },
    {
      label: "Team",
      href: "/dashboard/team",
      icon: Users,
      matchPatterns: ["/dashboard/team"],
      requiresRole: "admin" as const,
    },
  ]

  const settingsItems = [
    {
      label: "Identity",
      href: "/dashboard/identity",
    },
    {
      label: "Organization",
      href: "/dashboard/organization",
    },
  ]

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      if (pattern.endsWith("$")) {
        return pathname === pattern.replace("$", "")
      }
      return pathname.startsWith(pattern.replace("$", ""))
    })
  }

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiresRole) return true
    if (item.requiresRole === "admin") return isAdmin
    if (item.requiresRole === "approver") return isApprover
    return false
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/dashboard"}
              tooltip="Reimburse"
              render={
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-md bg-blue-600">
                    <BadgeCheck className="size-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold">Reimburse</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive(item.matchPatterns)}
                      tooltip={item.label}
                      render={
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                    {item.badge && (
                      <SidebarMenuBadge className="bg-blue-600 text-white">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/dashboard/organization")}
                      tooltip="Settings"
                      render={
                        <button className="flex w-full items-center gap-2">
                          <Settings className="size-4" />
                          <span>Settings</span>
                          <ChevronDown className="ml-auto size-4 transition-transform group-data-[collapsible=open]/collapsible:rotate-180" />
                        </button>
                      }
                    />
                  </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenu>
                    {settingsItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={pathname === item.href}
                          render={
                            <Link href={item.href} className="pl-8">
                              <span className="text-sidebar-foreground/70">
                                {item.label}
                              </span>
                            </Link>
                          }
                        />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  )
}
