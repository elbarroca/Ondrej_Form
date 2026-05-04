"use client"

import { useAuth } from "@/lib/auth/AuthContext"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"

interface SidebarUserProps {
  collapsed?: boolean
}

export function SidebarUser({ collapsed }: SidebarUserProps) {
  const { user, profile } = useAuth()

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U"

  const displayName = profile?.full_name || user?.email || "User"

  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Member"

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="relative h-auto w-full justify-start gap-3 px-2 py-1.5 hover:bg-sidebar-accent"
            >
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start min-w-0">
                  <span className="truncate text-sm font-medium">
                    {displayName}
                  </span>
                  <Badge
                    variant="secondary"
                    className="mt-0.5 text-[10px] px-1.5 py-0 bg-blue-600/10 text-blue-600 hover:bg-blue-600/10"
                  >
                    {roleLabel}
                  </Badge>
                </div>
              )}
            </Button>
          }
        />
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <a href="/dashboard/identity" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </a>
            }
          />
          <DropdownMenuItem
            render={
              <a href="/dashboard/organization" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Organization
              </a>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
