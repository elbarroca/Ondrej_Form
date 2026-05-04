"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "@/lib/db";
import {
  CATALOG,
  daysUntil,
  getEventStatus,
  type EventStatus,
} from "@/lib/catalog";
import { isIdentityComplete } from "@/lib/identity";
import { useIdentity } from "@/lib/useIdentity";
import { activateCatalogTrip, deleteTrip } from "@/lib/trips";
import type { CatalogEvent, Trip } from "@/lib/types";

export function TripsHome() {
  const trips = useLiveQuery(() => db.trips.toArray(), []);
  const identity = useIdentity();
  const ready = isIdentityComplete(identity);

  if (identity !== null && !ready) {
    return <Onboarding />;
  }

  const tripByCatalog = new Map<string, Trip>();
  const customTrips: Trip[] = [];
  for (const t of trips ?? []) {
    if (t.catalogId) tripByCatalog.set(t.catalogId, t);
    else customTrips.push(t);
  }

  const upcoming: CatalogEvent[] = [];
  const active: CatalogEvent[] = [];
  const submissionOpen: CatalogEvent[] = [];
  const past: CatalogEvent[] = [];
  for (const ev of CATALOG) {
    const s = getEventStatus(ev);
    if (s === "upcoming") upcoming.push(ev);
    else if (s === "active") active.push(ev);
    else if (s === "submission_open") submissionOpen.push(ev);
    else past.push(ev);
  }

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Your reimbursements
        </h1>
        <p className="mt-1 text-sm text-mute">
          Pick an event below. Drop receipts as you go. Submit when ready.
        </p>
      </header>

      <Section
        title="Submission open"
        subtitle="Event ended — submit your reimbursement before the deadline"
        events={submissionOpen}
        tripByCatalog={tripByCatalog}
        accent
      />
      <Section
        title="Active events"
        events={active}
        tripByCatalog={tripByCatalog}
      />
      <Section
        title="Upcoming events"
        events={upcoming}
        tripByCatalog={tripByCatalog}
      />
      <Section
        title="Past events"
        events={past}
        tripByCatalog={tripByCatalog}
        muted
      />

      {customTrips.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mute">
            Custom trips
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {customTrips.map((t) => (
              <li key={t.id} className="card flex flex-col gap-2">
                <Link
                  href={`/trip/${t.id}`}
                  className="text-base font-semibold hover:underline"
                >
                  {t.eventName}
                </Link>
                <p className="text-xs text-mute">
                  {t.location || "—"} · {t.outputCurrency}
                </p>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${t.eventName}"?`)) void deleteTrip(t.id);
                  }}
                  className="self-end text-xs text-red-600 hover:underline"
                >
                  delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  events,
  tripByCatalog,
  muted,
  accent,
}: {
  title: string;
  subtitle?: string;
  events: CatalogEvent[];
  tripByCatalog: Map<string, Trip>;
  muted?: boolean;
  accent?: boolean;
}) {
  if (events.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2
          className={`text-sm font-semibold uppercase tracking-wide ${
            accent ? "text-brand" : "text-mute"
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-mute hidden sm:block">{subtitle}</p>
        )}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            trip={tripByCatalog.get(ev.id)}
            status={getEventStatus(ev)}
            muted={muted}
          />
        ))}
      </ul>
    </section>
  );
}

function EventCard({
  event,
  trip,
  status,
  muted,
}: {
  event: CatalogEvent;
  trip?: Trip;
  status: EventStatus;
  muted?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const open = async () => {
    if (trip) {
      router.push(`/trip/${trip.id}`);
      return;
    }
    setBusy(true);
    try {
      const created = await activateCatalogTrip(event.id);
      router.push(`/trip/${created.id}`);
    } finally {
      setBusy(false);
    }
  };

  const submitted = trip?.submittedAt != null;
  const deadlineDays = event.reimbursementDeadline
    ? daysUntil(event.reimbursementDeadline)
    : null;
  const badge = submitted
    ? { label: "Submitted", cls: "bg-emerald-600 text-white" }
    : trip
      ? { label: "In progress", cls: "bg-ink text-paper" }
      : status === "active"
        ? { label: "Active now", cls: "bg-brand text-white" }
        : status === "submission_open"
          ? deadlineDays !== null && deadlineDays >= 0
            ? {
                label: `Submit · ${deadlineDays}d left`,
                cls: "bg-brand text-white",
              }
            : { label: "Submission open", cls: "bg-brand text-white" }
          : status === "upcoming"
            ? { label: "Upcoming", cls: "border border-line text-ink" }
            : { label: "Past", cls: "border border-line text-mute" };

  return (
    <li
      className={`card flex flex-col gap-3 transition hover:border-ink ${
        muted ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{event.eventName}</h3>
          <p className="mt-0.5 text-xs text-mute">{event.organizationName}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${badge.cls}`}
        >
          {badge.label}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="text-mute">Dates</dt>
        <dd className="text-right font-mono">
          {event.startDate} → {event.endDate}
        </dd>
        <dt className="text-mute">Location</dt>
        <dd className="truncate text-right">{event.location || "—"}</dd>
        <dt className="text-mute">Currency</dt>
        <dd className="text-right">{event.outputCurrency}</dd>
        {event.reimbursementDeadline && (
          <>
            <dt className="text-mute">Submit by</dt>
            <dd className="text-right font-mono">
              {event.reimbursementDeadline}
            </dd>
          </>
        )}
      </dl>
      {event.description && (
        <p className="text-xs text-mute">{event.description}</p>
      )}
      <div className="flex items-center justify-end gap-2">
        <button onClick={open} disabled={busy} className="btn">
          {trip ? "Open" : busy ? "Opening..." : "Start receipts"}
        </button>
      </div>
    </li>
  );
}

function Onboarding() {
  return (
    <div className="flex flex-col items-start gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Set up your profile
      </h1>
      <p className="max-w-xl text-sm text-mute">
        We need your contact, bank, and signature once. Saved in this browser
        only — never sent anywhere. Reused for every future trip.
      </p>
      <Link href="/identity" className="btn">
        Set up identity →
      </Link>
    </div>
  );
}
