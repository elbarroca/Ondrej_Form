"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAgreement, MOCK_APPROVER_OPTIONS } from "@/lib/auth/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { ArrowLeftIcon } from "lucide-react";

const STEPS = [
  { label: "Details", state: "active" as const },
  { label: "Receipts", state: "idle" as const },
  { label: "Categorize", state: "idle" as const },
  { label: "Review", state: "idle" as const },
];

export default function NewAgreementPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [approverId, setApproverId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedApprover = MOCK_APPROVER_OPTIONS.find((u) => u.id === approverId);
  const isValid = title.trim() && currency && approverId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
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

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <Link
          href="/dashboard/agreements"
          className="mb-4 inline-flex items-center gap-1 text-[13px] text-mute hover:text-ink transition-colors"
        >
          <ArrowLeftIcon className="size-3" />
          Back to reports
        </Link>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em]">New report</h1>
        <p className="mt-1.5 text-sm text-mute">Create a new reimbursement report</p>
      </div>

      <Stepper steps={STEPS} />

      <form onSubmit={handleSubmit}>
        <div className="rounded-[14px] border border-line bg-white p-7 space-y-4">
          <Input
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            placeholder="Oslo Innovation Week 2026"
            required
            hint="Give your report a descriptive name"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-[13px] font-medium text-ink">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event or purpose"
              rows={3}
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] placeholder:text-mute focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="currency" className="text-[13px] font-medium text-ink">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none"
            >
              {["EUR", "NOK", "SEK", "DKK", "USD", "GBP", "ISK", "CHF"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="approver" className="text-[13px] font-medium text-ink">
              Approver
            </label>
            <select
              id="approver"
              value={approverId}
              onChange={(e) => setApproverId(e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none"
            >
              <option value="">Select an approver</option>
              {MOCK_APPROVER_OPTIONS.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create report"}
            </Button>
            <Link href="/dashboard/agreements">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
