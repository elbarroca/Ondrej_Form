"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAgreements } from "@/lib/auth/mockData";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { ReportRow } from "@/components/ui/report-row";
import { EmptyState } from "@/components/ui/empty-state";
import { FileTextIcon, PlusIcon } from "lucide-react";
import type { Agreement } from "@/lib/auth/types";
import type { ReportStatus } from "@/lib/types";

const STATUS_MAP: Record<Agreement["status"], ReportStatus> = {
  draft: "draft",
  submitted: "submitted",
  approved: "approved",
  rejected: "rejected",
};

type FilterKey = "all" | Agreement["status"];

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setAgreements(getAgreements());
  }, []);

  const counts = {
    all: agreements.length,
    draft: agreements.filter((a) => a.status === "draft").length,
    submitted: agreements.filter((a) => a.status === "submitted").length,
    approved: agreements.filter((a) => a.status === "approved").length,
    rejected: agreements.filter((a) => a.status === "rejected").length,
  };

  const pills = (["all", "draft", "submitted", "approved", "rejected"] as const).map(
    (key) => ({
      key,
      label: key === "all" ? "All" : key.charAt(0).toUpperCase() + key.slice(1),
      count: counts[key],
      active: filter === key,
    })
  );

  const filtered = agreements.filter((a) => {
    if (filter !== "all" && a.status !== filter) return false;
    if (
      search &&
      !a.title.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">My reports</h1>
          <p className="mt-1.5 text-sm text-mute">
            Manage all your reimbursement reports
          </p>
        </div>
        <Link href="/dashboard/agreements/new">
          <Button variant="primary" size="sm" leftIcon={<PlusIcon className="size-3.5" />}>
            New report
          </Button>
        </Link>
      </div>

      <FilterBar
        pills={pills}
        onPillClick={(key) => setFilter(key as FilterKey)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title..."
      />

      {filtered.length === 0 ? (
        <div className="rounded-[14px] border border-line bg-white">
          <EmptyState
            icon={<FileTextIcon className="size-12" />}
            headline={filter === "all" && !search ? "No reports yet" : "No matching reports"}
            helper={
              filter === "all" && !search
                ? "Create your first report to start tracking reimbursements"
                : "Try adjusting your filters"
            }
            cta={
              filter === "all" && !search
                ? { label: "Create your first report", href: "/dashboard/agreements/new" }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="py-1">
            {filtered.map((a) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
