"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SignaturePad } from "@/components/SignaturePad";
import {
  EMPTY_IDENTITY,
  isIdentityComplete,
  saveIdentity,
} from "@/lib/identity";
import { useIdentity } from "@/lib/useIdentity";
import type { Identity } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved";

export function IdentityForm() {
  const stored = useIdentity();
  const [identity, setIdentity] = useState<Identity>(
    () => stored ?? EMPTY_IDENTITY,
  );
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    setSaveState("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveIdentity(identity);
      setSaveState("saved");
      setTimeout(
        () => setSaveState((s) => (s === "saved" ? "idle" : s)),
        1500,
      );
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [identity]);

  const set = <K extends keyof Identity>(k: K, v: Identity[K]) => {
    setIdentity((prev) => ({ ...prev, [k]: v }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveIdentity(identity);
    setSaveState("saved");
  };

  const ready = isIdentityComplete(identity);

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Identity</h1>
          <p className="mt-1 text-sm text-mute">
            Auto-saved as you type. Reused for every trip. Stored in your
            browser only.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <SaveBadge state={saveState} ready={ready} />
          {ready && (
            <Link href="/" className="btn">
              Done →
            </Link>
          )}
        </div>
      </header>

      <section className="card grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-semibold uppercase tracking-wide text-mute">
          Contact
        </h2>
        <div className="field sm:col-span-2">
          <label>Full name</label>
          <input
            value={identity.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Ricardo Mosonzov Barroca"
          />
        </div>
        <div className="field sm:col-span-2">
          <label>Address</label>
          <input
            value={identity.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Ualg Tec Campus"
          />
        </div>
        <div className="field">
          <label>Postal code</label>
          <input
            value={identity.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            placeholder="8005-139"
          />
        </div>
        <div className="field">
          <label>Place</label>
          <input
            value={identity.place}
            onChange={(e) => set("place", e.target.value)}
            placeholder="Faro"
          />
        </div>
        <div className="field">
          <label>Country</label>
          <input
            value={identity.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder="Portugal"
          />
        </div>
        <div className="field">
          <label>Phone</label>
          <input
            value={identity.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+351 925 549 165"
          />
        </div>
        <div className="field sm:col-span-2">
          <label>E-mail</label>
          <input
            type="email"
            value={identity.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </section>

      <section className="card grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-semibold uppercase tracking-wide text-mute">
          Bank
        </h2>
        <div className="field">
          <label>Bank account label</label>
          <input
            value={identity.bankAccount}
            onChange={(e) => set("bankAccount", e.target.value)}
            placeholder="Revolut"
          />
        </div>
        <div className="field">
          <label>BIC / SWIFT</label>
          <input
            value={identity.bicSwift}
            onChange={(e) => set("bicSwift", e.target.value)}
            placeholder="REVOLT21"
          />
        </div>
        <div className="field sm:col-span-2">
          <label>IBAN</label>
          <input
            value={identity.iban}
            onChange={(e) => set("iban", e.target.value)}
            placeholder="LT47 3250 0305 2886 7229"
          />
        </div>
      </section>

      <section className="card flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-mute">
          Signature
        </h2>
        <SignaturePad
          value={identity.signaturePng}
          onChange={(v) => set("signaturePng", v)}
        />
      </section>
    </form>
  );
}

function SaveBadge({ state, ready }: { state: SaveState; ready: boolean }) {
  if (state === "saving")
    return <span className="text-mute">Saving…</span>;
  if (state === "saved")
    return <span className="text-emerald-700">All changes saved ✓</span>;
  if (!ready)
    return <span className="text-mute">Auto-saves as you type</span>;
  return <span className="text-mute">Saved</span>;
}
