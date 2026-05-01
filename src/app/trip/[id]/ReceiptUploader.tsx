"use client";

import { useEffect, useRef, useState } from "react";
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
  isPdf: boolean;
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
  const [pasteHint, setPasteHint] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const addFiles = (files: FileList | File[]) => {
    const next: PendingFile[] = [];
    for (const file of Array.from(files)) {
      if (
        !file.type.startsWith("image/") &&
        file.type !== "application/pdf"
      ) {
        continue;
      }
      const isPdf = file.type === "application/pdf";
      next.push({
        id: uid(),
        file,
        amount: "",
        currency: "EUR",
        date: todayISO(),
        category: "Other",
        description: "",
        preview: URL.createObjectURL(file),
        isPdf,
        saving: false,
      });
    }
    setPending((prev) => [...prev, ...next]);
  };

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const files: File[] = [];
      const stamp = Date.now();
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.kind !== "file") continue;
        const f = item.getAsFile();
        if (!f) continue;
        if (
          !f.type.startsWith("image/") &&
          f.type !== "application/pdf"
        ) {
          continue;
        }
        const ext = f.type.split("/")[1] ?? "png";
        const named = f.name
          ? f
          : new File([f], `pasted-${stamp}.${ext}`, { type: f.type });
        files.push(named);
      }
      if (files.length > 0) {
        e.preventDefault();
        addFiles(files);
        setPasteHint(true);
        setTimeout(() => setPasteHint(false), 1500);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

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
        ref={dropRef}
        tabIndex={0}
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
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center outline-none transition focus-visible:border-ink ${
          dragOver
            ? "border-ink bg-line/40"
            : "border-line bg-paper hover:border-ink/60"
        }`}
      >
        <p className="text-sm font-medium">Drop receipts (images or PDFs)</p>
        <p className="mt-1 text-xs text-mute">
          or paste from clipboard (⌘V / Ctrl+V) — or
        </p>
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
        {pasteHint && (
          <p className="mt-2 text-xs text-emerald-700">Pasted ✓</p>
        )}
      </div>

      {pending.length > 0 && (
        <ul className="grid gap-3">
          {pending.map((p) => (
            <li
              key={p.id}
              className="card grid gap-3 sm:grid-cols-[120px_1fr]"
            >
              {p.isPdf ? (
                <a
                  href={p.preview}
                  target="_blank"
                  rel="noreferrer"
                  className="relative block h-32 w-full overflow-hidden rounded-md border border-line bg-white sm:h-full sm:min-h-[160px]"
                  title="Open PDF"
                >
                  <object
                    data={`${p.preview}#toolbar=0&navpanes=0&view=FitH`}
                    type="application/pdf"
                    aria-label="PDF preview"
                    className="pointer-events-none h-[320px] w-full origin-top-left scale-[0.5]"
                  />
                  <span className="absolute right-1 top-1 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-paper">
                    PDF
                  </span>
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.preview}
                  alt="preview"
                  className="h-24 w-full rounded-md object-cover sm:h-full"
                />
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
