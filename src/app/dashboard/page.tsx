"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAgreements } from "@/lib/auth/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agreement } from "@/lib/auth/types";

const STATUS_CONFIG: Record<Agreement["status"], { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-blue-100 text-blue-700 border-blue-200" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
};

export default function DashboardPage() {
  const { user, canApprove } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    setAgreements(getAgreements());
  }, []);

  const stats = {
    total: agreements.length,
    pending: agreements.filter(a => a.status === "submitted").length,
    approvedThisMonth: agreements.filter(a => {
      if (a.status !== "approved") return false;
      const act = a.activities.find(x => x.type === "approved");
      if (!act) return false;
      return act.timestamp.startsWith(new Date().toISOString().slice(0, 7));
    }).length,
    totalSubmitted: agreements.reduce((s, a) => s + a.total, 0),
  };

  const recentAgreements = agreements.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Track your agreements and reimbursements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Agreements" value={stats.total} className="text-brand" />
        <StatCard label="Pending Approval" value={stats.pending} className="text-amber-600" />
        <StatCard label="Approved This Month" value={stats.approvedThisMonth} className="text-emerald-600" />
        <StatCard label="Total Submitted (EUR)" value={`€${(stats.totalSubmitted / 1000).toFixed(1)}k`} className="font-semibold" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Recent agreements</h2>
            <Link href="/dashboard/agreements/new">
              <Button size="sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Agreement
              </Button>
            </Link>
          </div>

          {recentAgreements.length === 0 ? (
            <div className="py-14 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-muted">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium">No agreements yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Create your first agreement to start tracking reimbursements</p>
              <Link href="/dashboard/agreements/new">
                <Button className="mt-4" size="sm">Create agreement →</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentAgreements.map((a) => {
                const statusCfg = STATUS_CONFIG[a.status];
                return (
                  <li key={a.id}>
                    <Link
                      href={`/dashboard/agreements/${a.id}`}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4 transition-all hover:border-brand/40 hover:bg-brand/5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{a.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{a.submitterName}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium">{a.currency} {a.total.toLocaleString()}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.createdAt}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Quick actions</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard/agreements/new" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-brand transition-colors">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Agreement
                </Link>
              </li>
              {canApprove && (
                <li>
                  <Link href="/dashboard/approvals" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-brand transition-colors">
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Pending Approvals
                  </Link>
                </li>
              )}
              <li>
                <Link href="/dashboard/receivables" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-brand transition-colors">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Receivables
                </Link>
              </li>
              <li>
                <Link href="/dashboard/identity" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-brand transition-colors">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Update Identity
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">How it works</h3>
            <ol className="space-y-2">
              {[
                "Create an agreement (event, project, trip)",
                "Add receivables (receipts, expenses)",
                "Categorize and confirm amounts",
                "Submit for approval",
                "Download the PDF",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-brand text-xs font-semibold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className={`text-3xl font-semibold ${className}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
