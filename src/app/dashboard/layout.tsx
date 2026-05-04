"use client";

import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth/AuthContext";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { canApprove, isAdmin } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand shadow-sm">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-semibold text-sm">Reimburse</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink href="/dashboard" active={isActive("/dashboard") && pathname === "/dashboard"}>
              Overview
            </NavLink>
            <NavLink href="/dashboard/agreements" active={isActive("/dashboard/agreements")}>
              Agreements
            </NavLink>
            {canApprove && (
              <NavLink href="/dashboard/approvals" active={isActive("/dashboard/approvals")}>
                Approvals
              </NavLink>
            )}
            <NavLink href="/dashboard/receivables" active={isActive("/dashboard/receivables")}>
              Receivables
            </NavLink>
            {isAdmin && (
              <NavLink href="/dashboard/team" active={isActive("/dashboard/team")}>
                Team
              </NavLink>
            )}
            <NavLink href="/dashboard/organization" active={isActive("/dashboard/organization")}>
              Organization
            </NavLink>
            <NavLink href="/dashboard/identity" active={isActive("/dashboard/identity")}>
              Identity
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
        active
          ? "bg-brand/10 text-brand font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}
