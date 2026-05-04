"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  getPendingApprovals,
  getApprovedAgreements,
  getRejectedAgreements,
} from "@/lib/auth/mockData";
import { Button } from "@/components/ui/button";
import { ApprovalRow } from "@/components/ui/approval-row";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircleIcon, FileTextIcon } from "lucide-react";
import type { Agreement } from "@/lib/auth/types";
import type { ReportStatus } from "@/lib/types";

export default function ApprovalsPage() {
  const { canApprove } = useAuth();
  const [pending, setPending] = useState<Agreement[]>([]);
  const [approved, setApproved] = useState<Agreement[]>([]);
  const [rejected, setRejected] = useState<Agreement[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [selected, setSelected] = useState<Agreement | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!canApprove) return;
    setPending(getPendingApprovals());
    setApproved(getApprovedAgreements());
    setRejected(getRejectedAgreements());
  }, [canApprove]);

  if (!canApprove) {
    return (
      <div className="space-y-7">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Approvals</h1>
          <p className="mt-1.5 text-sm text-mute">Review and manage approvals</p>
        </div>
        <div className="rounded-[14px] border border-line bg-white">
          <EmptyState
            icon={<CheckCircleIcon className="size-12" />}
            headline="Access denied"
            helper="You do not have permission to view this page"
          />
        </div>
      </div>
    );
  }

  const items = tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  const pills = [
    { key: "pending", label: "Pending", count: pending.length, active: tab === "pending" },
    { key: "approved", label: "Approved", count: approved.length, active: tab === "approved" },
    { key: "rejected", label: "Rejected", count: rejected.length, active: tab === "rejected" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Approvals</h1>
        <p className="mt-1.5 text-sm text-mute">Review and manage agreement approvals</p>
      </div>

      <FilterBar
        pills={pills}
        onPillClick={(key) => setTab(key as typeof tab)}
      />

      {items.length === 0 ? (
        <div className="rounded-[14px] border border-line bg-white">
          <EmptyState
            icon={<CheckCircleIcon className="size-12" />}
            headline={tab === "pending" ? "Nothing waiting on you" : `No ${tab} approvals`}
            helper={tab === "pending" ? "All reports have been reviewed" : ""}
          />
        </div>
      ) : (
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          {items.map((a) => (
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
              onClick={() => setSelected(a)}
              onApprove={
                tab === "pending"
                  ? () => {
                      setSelected(a);
                    }
                  : undefined
              }
              onReject={
                tab === "pending"
                  ? () => {
                      setSelected(a);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Approval drawer */}
      <Drawer
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setComment("");
        }}
        title={selected?.title ?? "Review report"}
        footer={
          tab === "pending" ? (
            <>
              <div>
                <Button
                  variant="mini"
                  size="sm"
                  miniVariant="danger"
                  onClick={() => setSelected(null)}
                >
                  Reject
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1" />
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-brand/10 text-brand grid place-items-center text-xs font-semibold">
                  {selected.submitterName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{selected.submitterName}</p>
                  <p className="text-[12px] text-mute">{selected.createdAt}</p>
                </div>
                <Badge
                  variant={selected.status as ReportStatus}
                  withDot
                  className="ml-auto"
                >
                  {selected.status.charAt(0).toUpperCase() +
                    selected.status.slice(1)}
                </Badge>
              </div>

              <div className="text-right mb-4">
                <p className="text-[11.5px] text-mute uppercase tracking-[.08em]">
                  Total
                </p>
                <p className="text-[28px] font-semibold tabular-nums tracking-[-0.015em] mt-1">
                  {selected.currency} {selected.total.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Receivables */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Receipts</h4>
              <div className="space-y-2">
                {selected.receivables.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-[10px] border border-line px-3 py-2.5"
                  >
                    <div>
                      <p className="text-[13px] font-medium">{r.description}</p>
                      <p className="text-[12px] text-mute">
                        {r.category} · {r.date}
                      </p>
                    </div>
                    <p className="text-[13px] font-semibold tabular-nums">
                      {selected.currency} {r.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            {tab === "pending" && (
              <div>
                <label className="text-[13px] font-medium block mb-1.5">
                  Comment
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment((e.target as HTMLTextAreaElement).value)}
                  placeholder="Add a comment (required for rejection)"
                  rows={3}
                  className="rounded-[10px] border-line focus:border-brand focus:ring-[3px] focus:ring-brand/15"
                />
              </div>
            )}

            {/* Activity */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Activity</h4>
              <div className="space-y-1">
                {selected.activities.map((act) => (
                  <div key={act.id} className="text-[13px] py-1.5 border-b border-line-soft last:border-b-0">
                    <span className="font-semibold">{act.userName}</span>{" "}
                    {act.type} {act.timestamp && `· ${new Date(act.timestamp).toLocaleDateString("en-GB")}`}
                    {act.note && <p className="text-[12px] text-mute mt-0.5 italic">{act.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
