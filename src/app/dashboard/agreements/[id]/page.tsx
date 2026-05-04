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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import type { Agreement, Receivable, Activity } from "@/lib/auth/types";

const STATUS_CONFIG: Record<Agreement["status"], { label: string; icon: string; className: string }> = {
  draft: { label: "Draft", icon: "✏️", className: "bg-blue-50 border-blue-200 text-blue-700" },
  submitted: { label: "Submitted for Approval", icon: "⏳", className: "bg-amber-50 border-amber-200 text-amber-700" },
  approved: { label: "Approved", icon: "✅", className: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  rejected: { label: "Rejected", icon: "❌", className: "bg-red-50 border-red-200 text-red-700" },
};

const CATEGORY_OPTIONS = ["Flights", "Lodging", "Meals", "Transport", "Materials", "Other"];

const ACTIVITY_ICONS: Record<Activity["type"], string> = {
  created: "📄",
  submitted: "📤",
  approved: "✅",
  rejected: "❌",
  received: "💰",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface NewReceivableForm {
  category: string;
  description: string;
  amount: string;
  date: string;
}

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, canApprove } = useAuth();
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [showAddReceivable, setShowAddReceivable] = useState(false);
  const [newReceivable, setNewReceivable] = useState<NewReceivableForm>({ category: "Other", description: "", amount: "", date: "" });
  const [actionNote, setActionNote] = useState("");

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
        <p className="text-sm text-muted-foreground">Loading agreement...</p>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[agreement.status];
  const isDraft = agreement.status === "draft";
  const isSubmitted = agreement.status === "submitted";

  const handleAddReceivable = () => {
    if (!newReceivable.description || !newReceivable.amount || !newReceivable.date) return;
    addReceivable(agreement.id, {
      category: newReceivable.category,
      description: newReceivable.description,
      amount: parseFloat(newReceivable.amount),
      date: newReceivable.date,
    });
    setNewReceivable({ category: "Other", description: "", amount: "", date: "" });
    setShowAddReceivable(false);
    loadAgreement();
  };

  const handleSubmit = () => {
    submitAgreement(agreement.id);
    loadAgreement();
  };

  const handleApprove = () => {
    approveAgreement(agreement.id, actionNote || undefined);
    setActionNote("");
    loadAgreement();
  };

  const handleReject = () => {
    rejectAgreement(agreement.id, actionNote || undefined);
    setActionNote("");
    loadAgreement();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/agreements" className="text-xs text-muted-foreground hover:text-brand">
          ← Agreements
        </Link>
      </div>

      <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${statusCfg.className}`}>
        <span className="text-xl">{statusCfg.icon}</span>
        <div>
          <p className="font-semibold">{statusCfg.label}</p>
          <p className="text-xs opacity-80">
            {agreement.status === "draft" && "This agreement is in draft mode. Add receivables and submit for approval."}
            {agreement.status === "submitted" && `Awaiting approval from ${agreement.approverName}.`}
            {agreement.status === "approved" && "This agreement has been approved. You can now view it in receivables."}
            {agreement.status === "rejected" && "This agreement was rejected. Contact the approver for more information."}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</p>
              <p className="mt-1 text-sm font-semibold">{agreement.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="mt-1 text-2xl font-bold text-accent">{agreement.currency} {agreement.total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Currency</p>
              <p className="mt-1 text-sm">{agreement.currency}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</p>
              <p className="mt-1 text-sm">{agreement.createdAt}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitter</p>
              <p className="mt-1 text-sm">{agreement.submitterName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approver</p>
              <p className="mt-1 text-sm">{agreement.approverName}</p>
            </div>
            {agreement.description && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
                <p className="mt-1 text-sm">{agreement.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Receivables</CardTitle>
            {isDraft && (
              <Button size="sm" variant="outline" onClick={() => setShowAddReceivable(!showAddReceivable)}>
                {showAddReceivable ? "Cancel" : "+ Add Receivable"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {showAddReceivable && (
            <div className="mb-4 rounded-lg border border-brand/30 bg-brand/5 p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="field">
                  <Label>Category</Label>
                  <Select value={newReceivable.category} onValueChange={(c) => { if (c) setNewReceivable(p => ({ ...p, category: c })); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="field">
                  <Label>Amount</Label>
                  <Input type="number" value={newReceivable.amount} onChange={e => setNewReceivable(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="field">
                  <Label>Date</Label>
                  <Input type="date" value={newReceivable.date} onChange={e => setNewReceivable(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <Label>Description</Label>
                <Input value={newReceivable.description} onChange={e => setNewReceivable(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the expense" />
              </div>
              <Button size="sm" onClick={handleAddReceivable} disabled={!newReceivable.description || !newReceivable.amount || !newReceivable.date}>
                Add Receivable
              </Button>
            </div>
          )}

          {agreement.receivables.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No receivables added yet</p>
              {isDraft && <p className="mt-1 text-xs text-muted-foreground">Click &quot;Add Receivable&quot; to add expense items</p>}
            </div>
          ) : (
            <div className="space-y-2">
              {agreement.receivables.map(r => (
                <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-xs">
                      {r.category.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.description}</p>
                      <p className="text-xs text-muted-foreground">{r.category} · {r.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{agreement.currency} {r.amount.toLocaleString()}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="font-bold text-accent">{agreement.currency} {agreement.total.toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isDraft && agreement.receivables.length > 0 && (
        <Alert>
          <AlertTitle>Ready to submit</AlertTitle>
          <AlertDescription>
            This agreement has {agreement.receivables.length} item(s) totaling {agreement.currency} {agreement.total.toLocaleString()}.
          </AlertDescription>
          <div className="mt-3">
            <Button size="sm" onClick={handleSubmit}>Submit for Approval</Button>
          </div>
        </Alert>
      )}

      {isSubmitted && canApprove && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <CardTitle className="text-base">Approve or Reject</CardTitle>
            <div className="field">
              <Label>Note (optional)</Label>
              <Textarea value={actionNote} onChange={e => setActionNote(e.target.value)} placeholder="Add a note for the submitter..." rows={2} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
                Approve
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-4">
            {agreement.activities.map((act) => (
              <div key={act.id} className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-sm">
                  {ACTIVITY_ICONS[act.type]}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm">
                    <span className="font-medium">{act.userName}</span>
                    {" "}
                    <span className="text-muted-foreground">
                      {act.type === "created" && "created this agreement"}
                      {act.type === "submitted" && "submitted for approval"}
                      {act.type === "approved" && "approved this agreement"}
                      {act.type === "rejected" && "rejected this agreement"}
                      {act.type === "received" && "marked as received"}
                    </span>
                  </p>
                  {act.note && <p className="mt-1 text-xs text-muted-foreground italic">&quot;{act.note}&quot;</p>}
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(act.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
