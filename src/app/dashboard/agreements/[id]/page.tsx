"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAgreementById,
  addReceivable,
  submitAgreement,
  approveAgreement,
  rejectAgreement,
} from "@/lib/auth/mockData";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { ReceiptCard } from "@/components/ui/receipt-card";
import { Drawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, PlusIcon, FileTextIcon, DownloadIcon, PaperclipIcon } from "lucide-react";
import type { Agreement, Receivable, Activity } from "@/lib/auth/types";
import type { ReportStatus } from "@/lib/types";

const STATUS_LABELS: Record<Agreement["status"], string> = {
  draft: "Draft",
  submitted: "Submitted for approval",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, canApprove } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [showAddReceivable, setShowAddReceivable] = useState(false);
  const [newCategory, setNewCategory] = useState("travel");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  const [actionComment, setActionComment] = useState("");

  const loadAgreement = useCallback(() => {
    const id = params.id as string;
    const found = getAgreementById(id);
    if (found) setAgreement(found);
  }, [params.id]);

  useEffect(() => {
    loadAgreement();
  }, [loadAgreement]);

  if (!agreement) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-mute">Loading agreement...</p>
      </div>
    );
  }

  const statusCfg = STATUS_LABELS[agreement.status];
  const isDraft = agreement.status === "draft";
  const isSubmitted = agreement.status === "submitted";
  const isSubmitter = user?.id === agreement.submitterId;
  const isApprover = canApprove && user?.id === agreement.approverId;

  const handleAddReceivable = () => {
    if (!newDescription || !newAmount || !newDate) return;
    addReceivable(agreement.id, {
      category: newCategory,
      description: newDescription,
      amount: parseFloat(newAmount),
      date: newDate,
    });
    setNewCategory("travel");
    setNewDescription("");
    setNewAmount("");
    setNewDate("");
    setShowAddReceivable(false);
    loadAgreement();
  };

  const handleSubmit = () => {
    submitAgreement(agreement.id);
    loadAgreement();
  };

  const handleApprove = () => {
    approveAgreement(agreement.id, actionComment || undefined);
    loadAgreement();
  };

  const timelineEvents = agreement.activities.map((act) => ({
    id: act.id,
    actor: act.userName,
    action: `${act.type} ${act.note ? `· "${act.note}"` : ""}`,
    when: new Date(act.timestamp).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    state: (act.type === "created" ? "done" : "done") as "done",
  }));

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/agreements"
        className="inline-flex items-center gap-1 text-[13px] text-mute hover:text-ink transition-colors"
      >
        <ArrowLeftIcon className="size-3" />
        Back to reports
      </Link>

      {/* Header */}
      <div className="rounded-[14px] border border-line bg-white p-[22px]">
        <div className="flex items-start justify-between gap-[18px]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[22px] font-semibold tracking-[-0.015em]">{agreement.title}</h1>
              <Badge variant={agreement.status as ReportStatus} withDot />
            </div>
            <div className="flex flex-wrap gap-3.5 text-[13px] text-mute">
              <span className="inline-flex items-center gap-1.5">
                <FileTextIcon className="size-3.5" />
                {agreement.id.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <PaperclipIcon className="size-3.5" />
                {agreement.receivables.length} receipts
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11.5px] text-mute uppercase tracking-[.08em]">Total</p>
            <p className="text-[28px] font-semibold tabular-nums tracking-[-0.015em] mt-1">
              {agreement.currency} {agreement.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {isDraft && isSubmitter && (
            <>
              <Button variant="primary" size="sm" onClick={handleSubmit}>
                Submit for approval
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddReceivable(true)}>
                <PlusIcon className="size-3.5 mr-1" />
                Add receipt
              </Button>
            </>
          )}
          {isSubmitted && isSubmitter && (
            <Button variant="ghost" size="sm">
              Withdraw
            </Button>
          )}
          {isSubmitted && isApprover && (
            <>
              <Button variant="primary" size="sm" onClick={() => handleApprove()}>
                Approve
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setActionComment("")}>
                Reject
              </Button>
            </>
          )}
          {agreement.status === "approved" && (
            <Button variant="ghost" size="sm">
              <DownloadIcon className="size-3.5 mr-1" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Status notice */}
      <div className="rounded-[10px] border border-line bg-paper/50 px-4 py-3 text-[13px] text-mute">
        {agreement.status === "draft" && "This report is in draft mode. Add receivables and submit when ready."}
        {agreement.status === "submitted" && `Awaiting approval from ${agreement.approverName}.`}
        {agreement.status === "approved" && "This report has been approved."}
        {agreement.status === "rejected" && "This report was rejected."}
        {actionComment && agreement.status === "rejected" && (
          <p className="mt-1 italic">&ldquo;{actionComment}&rdquo;</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[18px]">
        {/* Main: receipts + add form */}
        <div>
          {agreement.receivables.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {agreement.receivables.map((r) => (
                <ReceiptCard
                  key={r.id}
                  name={r.description || r.category}
                  date={r.date}
                  amount={`${agreement.currency} ${r.amount.toLocaleString()}`}
                  category={r.category as any}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[14px] border border-line bg-white py-16 text-center">
              <div className="mx-auto text-mute mb-4">
                <FileTextIcon className="size-12 mx-auto" />
              </div>
              <p className="text-base font-semibold">No receipts yet</p>
              <p className="mt-1 text-[13.5px] text-mute">Add receipts to this report</p>
            </div>
          )}
        </div>

        {/* Side: activity */}
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h3 className="text-[14.5px] font-semibold">Activity</h3>
          </div>
          <ActivityTimeline events={timelineEvents} />
        </div>
      </div>

      {/* Add receivable drawer */}
      <Drawer
        open={showAddReceivable}
        onClose={() => setShowAddReceivable(false)}
        title="Add receipt"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowAddReceivable(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleAddReceivable}>Add receipt</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none"
            >
              {["travel", "lodging", "meals", "conferences", "supplies", "translation", "other"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <Input
            id="receipt-desc"
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription((e.target as HTMLInputElement).value)}
            placeholder="Taxi to venue"
            required
          />
          <Input
            id="receipt-amount"
            label="Amount"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount((e.target as HTMLInputElement).value)}
            placeholder="0.00"
            required
          />
          <Input
            id="receipt-date"
            label="Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate((e.target as HTMLInputElement).value)}
            required
          />
        </div>
      </Drawer>
    </div>
  );
}
