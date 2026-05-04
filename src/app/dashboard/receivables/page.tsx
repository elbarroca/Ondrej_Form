"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getApprovedAgreements } from "@/lib/auth/mockData";
import { Button } from "@/components/ui/button";
import { ReportRow } from "@/components/ui/report-row";
import { EmptyState } from "@/components/ui/empty-state";
import { KpiCard } from "@/components/ui/kpi-card";
import { FileTextIcon, ReceiptIcon, DownloadIcon } from "lucide-react";
import type { Agreement } from "@/lib/auth/types";
import type { ReportStatus } from "@/lib/types";

export default function ReceivablesPage() {
  const { user, isReceiver } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    setAgreements(getApprovedAgreements());
  }, []);

  const totalValue = agreements.reduce((sum, a) => sum + a.total, 0);

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Receivables</h1>
          <p className="mt-1.5 text-sm text-mute">Approved reports ready for processing</p>
        </div>
        <Button variant="ghost" size="sm">
          <DownloadIcon className="size-3.5 mr-1" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[var(--card-gap)]">
        <KpiCard
          label="Total receivable"
          value={`EUR ${totalValue.toLocaleString()}`}
          icon={<ReceiptIcon className="size-3.5" />}
        />
        <KpiCard
          label="Approved reports"
          value={String(agreements.length)}
          icon={<FileTextIcon className="size-3.5" />}
          variant="emerald"
        />
        <KpiCard
          label="Ready for export"
          value={String(agreements.length)}
          icon={<DownloadIcon className="size-3.5" />}
          variant="default"
        />
      </div>

      {agreements.length === 0 ? (
        <div className="rounded-[14px] border border-line bg-white">
          <EmptyState
            icon={<FileTextIcon className="size-12" />}
            headline="No receivables yet"
            helper="Approved reports will appear here when they are ready for processing"
          />
        </div>
      ) : (
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="py-1">
            {agreements.map((a) => {
              const approvedAct = a.activities.find((x) => x.type === "approved");
              return (
                <ReportRow
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  reference={a.id.toUpperCase()}
                  status={"approved" as ReportStatus}
                  amount={`${a.currency} ${a.total.toLocaleString()}`}
                  date={approvedAct?.timestamp?.slice(0, 10) ?? a.createdAt}
                  href={`/dashboard/agreements/${a.id}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
