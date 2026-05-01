"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { db } from "@/lib/db";
import { loadIdentity } from "@/lib/identity";
import { generatePdf, downloadPdf } from "@/lib/pdf";
import { deleteReceipt, markSubmitted, updateTrip } from "@/lib/trips";
import type { ReceiptCategory, Trip } from "@/lib/types";
import { RECEIPT_CATEGORIES } from "@/lib/types";
import { ReceiptUploader } from "./ReceiptUploader";
import { ReceiptThumb } from "./ReceiptThumb";

export function TripView({ tripId }: { tripId: string }) {
  const trip = useLiveQuery(() => db.trips.get(tripId), [tripId]);
  const receipts = useLiveQuery(
    () => db.receipts.where("tripId").equals(tripId).sortBy("date"),
    [tripId],
  );
  const [filter, setFilter] = useState<"All" | ReceiptCategory>("All");
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);

  const totals = useMemo(() => {
    const byCat: Record<string, number> = {};
    let grand = 0;
    for (const r of receipts ?? []) {
      byCat[r.category] = (byCat[r.category] ?? 0) + r.convertedAmount;
      grand += r.convertedAmount;
    }
    return { byCat, grand };
  }, [receipts]);

  if (!trip) {
    return (
      <div className="text-sm text-mute">
        Trip not found.{" "}
        <Link href="/" className="underline">
          Back to trips
        </Link>
      </div>
    );
  }

  const filtered = (receipts ?? []).filter(
    (r) => filter === "All" || r.category === filter,
  );

  const buildPdfFilename = (fullName: string) => {
    const slug = trip.eventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${slug || "reimbursement"}-${
      fullName.replace(/\s+/g, "-").toLowerCase() || "form"
    }.pdf`;
  };

  const generate = async () => {
    const identity = loadIdentity();
    if (!identity) {
      alert("Set up your identity first.");
      return;
    }
    setGenerating(true);
    try {
      const bytes = await generatePdf(identity, trip, receipts ?? []);
      downloadPdf(bytes, buildPdfFilename(identity.fullName));
    } finally {
      setGenerating(false);
    }
  };

  const generateAndEmail = async () => {
    const identity = loadIdentity();
    if (!identity) {
      alert("Set up your identity first.");
      return;
    }
    if (!trip.recipientEmail) {
      alert("Set a recipient email in Edit details first.");
      return;
    }
    setGenerating(true);
    try {
      const bytes = await generatePdf(identity, trip, receipts ?? []);
      const filename = buildPdfFilename(identity.fullName);
      downloadPdf(bytes, filename);
      const total = (receipts ?? []).reduce(
        (s, r) => s + r.convertedAmount,
        0,
      );
      const subject = `Reimbursement — ${trip.eventName} — ${identity.fullName}`;
      const body = [
        `Hi,`,
        ``,
        `Please find attached my reimbursement sheet for ${trip.eventName}.`,
        ``,
        `Name: ${identity.fullName}`,
        `Total: ${total.toFixed(2)} ${trip.outputCurrency}`,
        `Receipts: ${(receipts ?? []).length}`,
        ``,
        `(Attach: ${filename})`,
        ``,
        `Best regards,`,
        identity.fullName,
      ].join("\n");
      const url = `mailto:${encodeURIComponent(trip.recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    } finally {
      setGenerating(false);
    }
  };

  const submitted = trip.submittedAt != null;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/" className="text-xs text-mute hover:underline">
            ← all trips
          </Link>
          <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight">
            {trip.eventName}
          </h1>
          <p className="mt-1 text-sm text-mute">
            {trip.location || "—"}
            {trip.startDate ? ` · ${trip.startDate}` : ""}
            {trip.endDate ? ` → ${trip.endDate}` : ""} · output{" "}
            {trip.outputCurrency}
          </p>
          {submitted && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              ✓ Submitted{" "}
              {new Date(trip.submittedAt!).toISOString().slice(0, 10)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="btn-ghost"
          >
            {editing ? "Close" : "Edit details"}
          </button>
          <button
            onClick={() => void markSubmitted(trip.id, !submitted)}
            className={submitted ? "btn-ghost" : "btn-ghost"}
          >
            {submitted ? "Mark as unsent" : "Mark as submitted"}
          </button>
          <button
            onClick={generate}
            disabled={generating || (receipts?.length ?? 0) === 0}
            className="btn-ghost"
          >
            {generating ? "..." : "Download PDF"}
          </button>
          <button
            onClick={generateAndEmail}
            disabled={
              generating ||
              (receipts?.length ?? 0) === 0 ||
              !trip.recipientEmail
            }
            className="btn"
            title={
              trip.recipientEmail
                ? `Email to ${trip.recipientEmail}`
                : "Set recipient email in Edit details"
            }
          >
            {generating ? "Generating..." : "Generate & email"}
          </button>
        </div>
      </header>

      {editing && <EditTripPanel trip={trip} />}

      {trip.rulesText && (
        <section className="card border-amber-200 bg-amber-50/40 text-sm">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
            Reimbursement rules
          </h3>
          <p className="text-xs text-amber-900">{trip.rulesText}</p>
        </section>
      )}

      <ReceiptUploader trip={trip} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Receipts</h2>
          <div className="flex flex-wrap gap-1">
            {(["All", ...RECEIPT_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  filter === c
                    ? "bg-ink text-paper"
                    : "border border-line text-ink hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card text-sm text-mute">
            No receipts yet. Drop images or PDFs above to add them.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((r) => (
              <li key={r.id} className="card flex flex-col gap-3">
                <ReceiptThumb blob={r.imageBlob} type={r.imageType} />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {r.description || "(no description)"}
                    </p>
                    <p className="text-xs text-mute">
                      {r.date} · {r.category}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-mono">
                      {r.originalAmount.toFixed(2)} {r.originalCurrency}
                    </p>
                    <p className="font-mono font-semibold">
                      → {r.convertedAmount.toFixed(2)} {trip.outputCurrency}
                    </p>
                    <p className="mt-0.5 text-[10px] text-mute">
                      rate {r.fxRate.toFixed(4)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Delete this receipt?"))
                      void deleteReceipt(r.id);
                  }}
                  className="self-end text-xs text-red-600 hover:underline"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card grid gap-2 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-mute">
            Totals
          </h2>
        </div>
        {RECEIPT_CATEGORIES.map((c) => (
          <div key={c} className="flex items-center justify-between text-sm">
            <span className="text-mute">{c}</span>
            <span className="font-mono">
              {(totals.byCat[c] ?? 0).toFixed(2)} {trip.outputCurrency}
            </span>
          </div>
        ))}
        <div className="sm:col-span-3 mt-2 flex items-center justify-between border-t border-line pt-3 text-base">
          <span className="font-semibold">Grand total</span>
          <span className="font-mono font-semibold">
            {totals.grand.toFixed(2)} {trip.outputCurrency}
          </span>
        </div>
        {trip.maxAmount && totals.grand > trip.maxAmount && (
          <div className="sm:col-span-3 rounded-md border border-amber-500 bg-amber-50 p-2 text-xs text-amber-800">
            Total exceeds configured max ({trip.maxAmount}{" "}
            {trip.outputCurrency}).
          </div>
        )}
      </section>

      <CommentsBlock trip={trip} />
    </div>
  );
}

function CommentsBlock({ trip }: { trip: Trip }) {
  const [value, setValue] = useState(trip.comments ?? "");
  const [saved, setSaved] = useState(false);
  const dirty = value !== (trip.comments ?? "");

  const save = async () => {
    await updateTrip(trip.id, { comments: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <section className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-mute">
          Comments / notes for reviewer
        </h2>
        {saved && <span className="text-xs text-emerald-700">Saved ✓</span>}
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Anything you want to flag to the reviewer — e.g. flight changes, missing receipt explanations, currency notes..."
        className="min-h-[120px] w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none transition focus:border-ink"
      />
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={!dirty}
          className="btn"
        >
          Save comments
        </button>
      </div>
    </section>
  );
}

function EditTripPanel({ trip }: { trip: Trip }) {
  const [recipientEmail, setRecipientEmail] = useState(trip.recipientEmail);
  const [organizationName, setOrganizationName] = useState(
    trip.organizationName,
  );
  const [maxAmount, setMaxAmount] = useState<string>(
    trip.maxAmount ? String(trip.maxAmount) : "",
  );
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await updateTrip(trip.id, {
      recipientEmail: recipientEmail.trim(),
      organizationName: organizationName.trim(),
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="card grid gap-3 sm:grid-cols-3">
      <div className="field">
        <label>Recipient email</label>
        <input
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Organization</label>
        <input
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Max amount (optional)</label>
        <input
          type="number"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      <div className="sm:col-span-3 flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-emerald-700">Saved ✓</span>}
        <button onClick={save} className="btn">
          Save
        </button>
      </div>
    </div>
  );
}
