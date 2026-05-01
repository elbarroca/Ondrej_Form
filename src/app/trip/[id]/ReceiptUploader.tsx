"use client";

import { useEffect, useState } from "react";
import { getRate, convert } from "@/lib/fx";
import { addReceipt } from "@/lib/trips";
import type { ReceiptCategory, Trip } from "@/lib/types";
import { CURRENCIES, RECEIPT_CATEGORIES } from "@/lib/types";

interface PendingFile {
  id: string;
  file: File;
  amount: string;
  currency: string;
  date: string;
  category: ReceiptCategory;
  description: string;
  preview: string;
  saving: boolean;
  error?: string;
  previewRate?: number;
  previewConverted?: number;
  previewLoading?: boolean;
}

function uid(): string {
  return crypto.randomUUID();
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ReceiptUploader({ trip }: { trip: Trip }) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files: FileList | File[]) => {
    const next: PendingFile[] = [];
    for (const file of Array.from(files)) {
      if (
        !file.type.startsWith("image/") &&
        file.type !== "application/pdf"
      ) {
        continue;
      }
      next.push({
        id: uid(),
        file,
        amount: "",
        currency: "EUR",
        date: todayISO(),
        category: "Other",
        description: "",
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        saving: false,
      });
    }
    setPending((prev) => [...prev, ...next]);
  };

  useEffect(() => {
    return () => {
      pending.forEach((p) => p.preview && URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof PendingFile>(
    id: string,
    key: K,
    value: PendingFile[K],
  ) => {
    setPending((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    );
  };

  const refreshPreview = async (id: string) => {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    const amt = Number(item.amount);
    if (!amt || amt <= 0 || !item.date) {
      update(id, "previewRate", undefined);
      update(id, "previewConverted", undefined);
      return;
    }
    update(id, "previewLoading", true);
    try {
      const fx = await getRate(item.date, item.currency, trip.outputCurrency);
      setPending((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                previewRate: fx.rate,
                previewConverted: convert(amt, fx.rate),
                previewLoading: false,
              }
            : p,
        ),
      );
    } catch {
      update(id, "previewLoading", false);
    }
  };

  const previewSig = pending
    .map((p) => `${p.id}:${p.amount}:${p.currency}:${p.date}`)
    .join("|");

  useEffect(() => {
    const handles = pending
      .filter((p) => p.amount && p.date && !p.previewLoading)
      .map((p) => setTimeout(() => void refreshPreview(p.id), 500));
    return () => {
      handles.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewSig]);

  const remove = (id: string) => {
    setPending((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const save = async (id: string) => {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    const amt = Number(item.amount);
    if (!amt || amt <= 0) {
      update(id, "error", "Enter a valid amount");
      return;
    }
    update(id, "saving", true);
    update(id, "error", undefined);
    try {
      const fx = await getRate(item.date, item.currency, trip.outputCurrency);
      const converted = convert(amt, fx.rate);
      await addReceipt({
        tripId: trip.id,
        imageBlob: item.file,
        imageType: item.file.type,
        originalAmount: amt,
        originalCurrency: item.currency,
        date: item.date,
        category: item.category,
        description: item.description.trim(),
        convertedAmount: converted,
        fxRate: fx.rate,
        fxFetchedAt: fx.fetchedAt,
      });
      remove(id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save";
      update(id, "error", msg);
      update(id, "saving", false);
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? "border-ink bg-line/40"
            : "border-line bg-paper hover:border-ink/60"
        }`}
      >
        <p className="text-sm font-medium">Drop receipts (images or PDFs)</p>
        <p className="mt-1 text-xs text-mute">or</p>
        <label className="btn-ghost mt-3 cursor-pointer">
          Choose files
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {pending.length > 0 && (
        <ul className="grid gap-3">
          {pending.map((p) => (
            <li
              key={p.id}
              className="card grid gap-3 sm:grid-cols-[120px_1fr]"
            >
              {p.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.preview}
                  alt="preview"
                  className="h-24 w-full rounded-md object-cover sm:h-full"
                />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-md border border-line bg-paper text-xs text-mute sm:h-full">
                  PDF
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="field">
                  <label>Amount</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={p.amount}
                    onChange={(e) => update(p.id, "amount", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="field">
                  <label>Currency</label>
                  <select
                    value={p.currency}
                    onChange={(e) => update(p.id, "currency", e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={p.date}
                    onChange={(e) => update(p.id, "date", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Category</label>
                  <select
                    value={p.category}
                    onChange={(e) =>
                      update(p.id, "category", e.target.value as ReceiptCategory)
                    }
                  >
                    {RECEIPT_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="field sm:col-span-2">
                  <label>Description</label>
                  <input
                    value={p.description}
                    onChange={(e) => update(p.id, "description", e.target.value)}
                    placeholder="Flight FAO → KEF"
                  />
                </div>
                <div className="sm:col-span-3 flex items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2 text-xs">
                  <span className="text-mute">Converted</span>
                  {p.previewLoading ? (
                    <span className="text-mute">fetching rate…</span>
                  ) : p.previewConverted != null && p.previewRate != null ? (
                    <span className="font-mono">
                      {Number(p.amount).toFixed(2)} {p.currency} →{" "}
                      <strong>
                        {p.previewConverted.toFixed(2)} {trip.outputCurrency}
                      </strong>{" "}
                      <span className="text-mute">
                        (rate {p.previewRate.toFixed(4)})
                      </span>
                    </span>
                  ) : (
                    <span className="text-mute">
                      enter amount to see {trip.outputCurrency} value
                    </span>
                  )}
                </div>
                {p.error && (
                  <p className="sm:col-span-3 text-xs text-red-600">
                    {p.error}
                  </p>
                )}
                <div className="sm:col-span-3 flex items-center justify-between gap-3">
                  <span className="truncate text-xs text-mute">
                    {p.file.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="btn-ghost"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => save(p.id)}
                      disabled={p.saving}
                      className="btn"
                    >
                      {p.saving ? "Saving..." : "Save receipt"}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
