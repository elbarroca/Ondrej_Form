"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "@/lib/db";
import { loadIdentity } from "@/lib/identity";
import { generatePdf, downloadPdf } from "@/lib/pdf";
import {
  changeCategoryCurrency,
  deleteReceipt,
  markSubmitted,
  refreshReceiptFx,
  setCategoryDescription,
  updateReceipt,
  updateTrip,
} from "@/lib/trips";
import type { Receipt, ReceiptCategory, Trip } from "@/lib/types";
import { CURRENCIES, RECEIPT_CATEGORIES } from "@/lib/types";
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

      <section className="flex flex-col gap-4">
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

        {(receipts ?? []).length === 0 ? (
          <div className="card text-sm text-mute">
            No receipts yet. Drop images or PDFs above to add them.
          </div>
        ) : (
          <CategoryGroups
            trip={trip}
            receipts={filtered}
            filter={filter}
          />
        )}
      </section>

      <section className="card grid gap-2 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-mute">
            Totals
          </h2>
        </div>
        {RECEIPT_CATEGORIES.filter((c) => (totals.byCat[c] ?? 0) > 0).map((c) => (
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
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const persisted = trip.comments ?? "";
  const dirty = value !== persisted;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!dirty) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus("saving");
      void updateTrip(trip.id, { comments: value }).then(() => {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1200);
      });
    }, 400);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, dirty, trip.id]);

  const flushNow = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!dirty) return;
    setStatus("saving");
    void updateTrip(trip.id, { comments: value }).then(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1200);
    });
  };

  const indicator =
    status === "saving"
      ? "Saving..."
      : status === "saved"
        ? "Saved ✓"
        : dirty
          ? "Unsaved"
          : "";

  return (
    <section className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-mute">
          Comments / notes for reviewer
        </h2>
        <span
          className={`text-xs ${
            status === "saved"
              ? "text-emerald-700"
              : dirty
                ? "text-amber-700"
                : "text-mute"
          }`}
        >
          {indicator || "Auto-saves"}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={flushNow}
        placeholder="Anything you want to flag to the reviewer — e.g. flight changes, missing receipt explanations, currency notes..."
        className="min-h-[120px] w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none transition focus:border-ink"
      />
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

function CategoryGroups({
  trip,
  receipts,
  filter,
}: {
  trip: Trip;
  receipts: Receipt[];
  filter: "All" | ReceiptCategory;
}) {
  const visibleCats = useMemo(() => {
    if (filter !== "All") return [filter];
    return RECEIPT_CATEGORIES.filter((c) =>
      receipts.some((r) => r.category === c),
    );
  }, [filter, receipts]);

  if (visibleCats.length === 0) {
    return (
      <div className="card text-sm text-mute">
        No receipts in this category yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {visibleCats.map((cat) => {
        const items = receipts.filter((r) => r.category === cat);
        return (
          <CategoryBlock
            key={cat}
            trip={trip}
            category={cat}
            receipts={items}
          />
        );
      })}
    </div>
  );
}

function CategoryBlock({
  trip,
  category,
  receipts,
}: {
  trip: Trip;
  category: ReceiptCategory;
  receipts: Receipt[];
}) {
  const sum = receipts.reduce((s, r) => s + r.convertedAmount, 0);
  const currencies = Array.from(new Set(receipts.map((r) => r.originalCurrency)));
  const dominantCurrency =
    currencies.length === 1 ? currencies[0] : currencies[0] ?? trip.outputCurrency;

  return (
    <section className="card flex flex-col gap-4 p-4 sm:p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <div className="flex items-baseline gap-3">
          <h3 className="text-base font-semibold">{category}</h3>
          <span className="text-xs text-mute">
            {receipts.length} {receipts.length === 1 ? "receipt" : "receipts"}
          </span>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-semibold">
            {sum.toFixed(2)} {trip.outputCurrency}
          </p>
          {currencies.length === 1 && currencies[0] !== trip.outputCurrency && (
            <p className="text-[10px] text-mute">all in {currencies[0]}</p>
          )}
          {currencies.length > 1 && (
            <p className="text-[10px] text-mute">
              mixed: {currencies.join(", ")}
            </p>
          )}
        </div>
      </header>

      <BulkPanel
        trip={trip}
        category={category}
        receipts={receipts}
        suggestedCurrency={dominantCurrency}
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {receipts.map((r) => (
          <ReceiptCard
            key={r.id}
            receipt={r}
            outputCurrency={trip.outputCurrency}
          />
        ))}
      </ul>
    </section>
  );
}

function BulkPanel({
  trip,
  category,
  receipts,
  suggestedCurrency,
}: {
  trip: Trip;
  category: ReceiptCategory;
  receipts: Receipt[];
  suggestedCurrency: string;
}) {
  const initialDesc = trip.categoryDescriptions?.[category] ?? "";
  const [desc, setDesc] = useState(initialDesc);
  const [savingDesc, setSavingDesc] = useState(false);
  const [descSaved, setDescSaved] = useState(false);

  const [bulkCurrency, setBulkCurrency] = useState(suggestedCurrency);
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);

  const dirtyDesc = desc !== initialDesc;

  const saveDesc = async () => {
    setSavingDesc(true);
    try {
      await setCategoryDescription(trip.id, category, desc);
      setDescSaved(true);
      setTimeout(() => setDescSaved(false), 1200);
    } finally {
      setSavingDesc(false);
    }
  };

  const applyCurrency = async () => {
    if (receipts.length === 0) return;
    setApplying(true);
    setApplyMsg(null);
    try {
      const res = await changeCategoryCurrency(trip.id, category, bulkCurrency);
      setApplyMsg(
        res.failed === 0
          ? `Updated ${res.updated} receipts to ${bulkCurrency}.`
          : `Updated ${res.updated}, ${res.failed} failed (rate fetch).`,
      );
      setTimeout(() => setApplyMsg(null), 2400);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="grid gap-3 rounded-md border border-line bg-paper/60 p-3 sm:grid-cols-[1fr_auto] sm:gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wide text-mute">
          Group description (one line for the whole category)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={`e.g. 4 international lunches/dinners`}
            className="min-w-0 flex-1 rounded-md border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-ink"
          />
          <button
            type="button"
            onClick={saveDesc}
            disabled={!dirtyDesc || savingDesc}
            className="btn-ghost text-xs"
          >
            {savingDesc ? "..." : descSaved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-medium uppercase tracking-wide text-mute">
          Bulk currency
        </label>
        <div className="flex items-center gap-2">
          <select
            value={bulkCurrency}
            onChange={(e) => setBulkCurrency(e.target.value)}
            className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-ink"
          >
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyCurrency}
            disabled={applying || receipts.length === 0}
            className="btn-ghost text-xs"
            title={`Re-apply FX for all ${category} receipts using ${bulkCurrency}`}
          >
            {applying ? "Applying..." : "Apply to all"}
          </button>
        </div>
        {applyMsg && (
          <p className="text-[10px] text-emerald-700">{applyMsg}</p>
        )}
      </div>
    </div>
  );
}

function ReceiptCard({
  receipt,
  outputCurrency,
}: {
  receipt: Receipt;
  outputCurrency: string;
}) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(receipt.description);
  const [amount, setAmount] = useState(String(receipt.originalAmount));
  const [currency, setCurrency] = useState(receipt.originalCurrency);
  const [date, setDate] = useState(receipt.date);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      const amt = Number(amount);
      const fields: Parameters<typeof updateReceipt>[1] = {
        description: desc.trim(),
        date,
      };
      const currencyChanged = currency !== receipt.originalCurrency;
      const amountChanged = !Number.isNaN(amt) && amt !== receipt.originalAmount;
      const dateChanged = date !== receipt.date;
      if (amountChanged) fields.originalAmount = amt;
      if (currencyChanged) fields.originalCurrency = currency;
      await updateReceipt(receipt.id, fields);
      if (currencyChanged || dateChanged || amountChanged) {
        await refreshReceiptFx(receipt.id);
      }
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="card flex flex-col gap-3 p-4">
      <ReceiptThumb blob={receipt.imageBlob} type={receipt.imageType} />
      {!editing ? (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold">
                {receipt.originalAmount.toFixed(2)} {receipt.originalCurrency}
              </p>
              <p className="text-[11px] text-mute">{receipt.date}</p>
              {receipt.description && (
                <p className="mt-1 truncate text-xs">{receipt.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-semibold">
                {receipt.convertedAmount.toFixed(2)} {outputCurrency}
              </p>
              <p className="text-[10px] text-mute">
                rate {receipt.fxRate.toFixed(4)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 text-xs">
            <button
              type="button"
              onClick={() => {
                setDesc(receipt.description);
                setAmount(String(receipt.originalAmount));
                setCurrency(receipt.originalCurrency);
                setDate(receipt.date);
                setEditing(true);
              }}
              className="text-ink hover:underline"
            >
              edit
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this receipt?"))
                  void deleteReceipt(receipt.id);
              }}
              className="text-red-600 hover:underline"
            >
              delete
            </button>
          </div>
        </>
      ) : (
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="field">
              <span className="text-[10px] font-medium uppercase tracking-wide text-mute">
                Amount
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="text-[10px] font-medium uppercase tracking-wide text-mute">
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span className="text-[10px] font-medium uppercase tracking-wide text-mute">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="text-[10px] font-medium uppercase tracking-wide text-mute">
              Description (overrides group description on the per-receipt page)
            </span>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="optional"
            />
          </label>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-ghost text-xs"
              disabled={busy}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="btn text-xs"
              disabled={busy}
            >
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
