"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAgreements } from "@/lib/auth/mockData";
import { KpiCard } from "@/components/ui/kpi-card";
import { ReportRow } from "@/components/ui/report-row";
import { ApprovalRow } from "@/components/ui/approval-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  PlusIcon,
  ArrowRightIcon,
} from "lucide-react";
import type { Agreement } from "@/lib/auth/types";
import type { ReportStatus } from "@/lib/types";

type AgreementStatusMap = Record<string, ReportStatus>;
const STATUS_MAP: Record<Agreement["status"], ReportStatus> = {
  draft: "draft",
  submitted: "submitted",
  approved: "approved",
  rejected: "rejected",
};

export default function DashboardPage() {
  const { user, canApprove } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    setAgreements(getAgreements());
  }, []);

  const submitted = agreements.filter((a) => a.status === "submitted");
  const approved = agreements.filter((a) => a.status === "approved");
  const rejected = agreements.filter((a) => a.status === "rejected");
  const totalThisMonth = agreements.reduce((s, a) => {
    if (a.createdAt.startsWith(new Date().toISOString().slice(0, 7))) return s + a.total;
    return s;
  }, 0);

  const recentAgreements = agreements.slice(0, 5);
  const pendingApprovals = agreements.filter(
    (a) => a.status === "submitted"
  );

  // Spend by category mock
  const spendCategories = [
    { label: "Travel", amount: 4200, fill: 70 },
    { label: "Lodging", amount: 3800, fill: 63 },
    { label: "Meals", amount: 400, fill: 7 },
    { label: "Supplies", amount: 600, fill: 10 },
  ];

  return (
    <div className="space-y-7">
      {/* Page head */}
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">
            Overview
          </h1>
          <p className="mt-1.5 text-sm text-mute">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="sm">Export</Button>
          <Link href="/dashboard/agreements/new">
            <Button variant="primary" size="sm" leftIcon={<PlusIcon className="size-3.5" />}>
              New report
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--card-gap)]">
        <KpiCard
          label="This month total"
          value={`EUR ${totalThisMonth.toLocaleString()}`}
          icon={<DollarSignIcon className="size-3.5" />}
          trend={{ direction: "up", text: "+12% vs last month" }}
          variant="default"
        />
        <KpiCard
          label="Pending approval"
          value={String(submitted.length)}
          icon={<ClockIcon className="size-3.5" />}
          trend={submitted.length > 0 ? { direction: "down", text: "-2 vs last month" } : undefined}
          variant="amber"
        />
        <KpiCard
          label="Approved"
          value={String(approved.length)}
          icon={<CheckCircleIcon className="size-3.5" />}
          trend={{ direction: "up", text: "+3 vs last month" }}
          variant="emerald"
        />
        <KpiCard
          label="Rejected"
          value={String(rejected.length)}
          icon={<XCircleIcon className="size-3.5" />}
          trend={{ direction: "neutral", text: "No change" }}
          variant="violet"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-[var(--card-gap)]">
        {/* Recent reports */}
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
            <h3 className="text-[14.5px] font-semibold">Recent reports</h3>
            <Link
              href="/dashboard/agreements"
              className="text-[12.5px] text-mute hover:text-brand transition-colors inline-flex items-center gap-1"
            >
              View all <ArrowRightIcon className="size-3" />
            </Link>
          </div>
          <div className="py-1">
            {recentAgreements.length === 0 ? (
              <EmptyState
                icon={<FileTextIcon className="size-12" />}
                headline="No reports yet"
                helper="Create your first report to start tracking reimbursements"
                cta={{ label: "Create your first report", href: "/dashboard/agreements/new" }}
              />
            ) : (
              recentAgreements.map((a) => (
                <ReportRow
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  reference={a.id.toUpperCase()}
                  status={STATUS_MAP[a.status]}
                  amount={`${a.currency} ${a.total.toLocaleString()}`}
                  date={a.createdAt}
                  href={`/dashboard/agreements/${a.id}`}
                />
              ))
            )}
          </div>
        </div>

        {/* Pending approvals */}
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
            <h3 className="text-[14.5px] font-semibold">Pending approvals</h3>
            {canApprove && (
              <Link
                href="/dashboard/approvals"
                className="text-[12.5px] text-mute hover:text-brand transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowRightIcon className="size-3" />
              </Link>
            )}
          </div>
          <div>
            {pendingApprovals.length === 0 ? (
              <EmptyState
                icon={<CheckCircleIcon className="size-12" />}
                headline="Nothing waiting on you"
                helper="All reports have been reviewed"
              />
            ) : (
              pendingApprovals.map((a) => (
                <ApprovalRow
                  key={a.id}
                  submitterName={a.submitterName}
                  submitterInitials={a.submitterName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                  amount={`${a.currency} ${a.total.toLocaleString()}`}
                  title={a.title}
                  when={a.createdAt}
                  onClick={() => {
                    window.location.href = `/dashboard/agreements/${a.id}`;
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spend by category */}
      <div className="rounded-[14px] border border-line bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <h3 className="text-[14.5px] font-semibold">Spend by category</h3>
          <span className="text-[12.5px] text-mute">This month</span>
        </div>
        <div className="p-5">
          {spendCategories.map((cat) => (
            <div
              key={cat.label}
              className="grid grid-cols-[110px_1fr_70px] items-center gap-2.5 mb-3 last:mb-0"
            >
              <span className="text-[13px]">{cat.label}</span>
              <div className="h-2 rounded-full bg-paper overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${cat.fill}%` }}
                />
              </div>
              <span className="text-[12.5px] text-mute text-right tabular-nums">
                EUR {cat.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
