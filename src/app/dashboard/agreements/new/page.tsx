"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAgreement, MOCK_APPROVER_OPTIONS } from "@/lib/auth/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function NewAgreementPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [approverId, setApproverId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedApprover = MOCK_APPROVER_OPTIONS.find(u => u.id === approverId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !approverId) return;

    setIsSubmitting(true);
    const agreement = createAgreement({
      title: title.trim(),
      description: description.trim(),
      currency,
      approverId,
      approverName: selectedApprover?.name ?? "",
    });
    router.push(`/dashboard/agreements/${agreement.id}`);
  };

  const isValid = title.trim() && currency && approverId;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/dashboard/agreements" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-brand">
          ← Back to agreements
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Agreement</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new reimbursement agreement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="field">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Oslo Innovation Week 2026"
              />
            </div>

            <div className="field">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Travel and accommodation for the conference..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(v) => { if (v) setCurrency(v); }}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["EUR", "USD", "GBP", "NOK", "SEK", "DKK", "ISK", "CHF", "PLN", "CZK", "HUF", "CAD", "AUD", "JPY"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="field">
                <Label htmlFor="approver">Approver</Label>
                <Select value={approverId} onValueChange={(v) => { if (v) setApproverId(v); }}>
                  <SelectTrigger id="approver">
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_APPROVER_OPTIONS.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Agreement"}
          </Button>
          <Link href="/dashboard/agreements">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
