import type { CatalogEvent } from "./types";

export const CATALOG: CatalogEvent[] = [
  {
    id: "ice-iiw-2026",
    eventName: "Iceland Innovation Week 2026",
    organizationName: "ICE Arctic Youth Community · Sør-Varanger Utvikling AS",
    location: "Reykjavik, Iceland",
    startDate: "2026-04-27",
    endDate: "2026-05-01",
    outputCurrency: "NOK",
    recipientEmail: "ondrej@svu.as",
    reimbursementDeadline: "2026-05-15",
    rulesText:
      "All receipts must be placed in the same file delivered as 1 PDF. 100% reimbursement requires conditions in acceptance email. 50% reimbursement: deliver PDF within 14 days.",
    description:
      "ICE Arctic Youth Community delegation to Iceland Innovation Week. Reimbursement covers eligible expenses up to the agreed cap.",
  },
  {
    id: "tonik-2026",
    eventName: "Tonik 2026",
    organizationName: "ICE Arctic Youth Community",
    location: "TBA",
    startDate: "2026-09-01",
    endDate: "2026-09-05",
    outputCurrency: "NOK",
    recipientEmail: "ondrej@svu.as",
    description: "Follow-up event to ICE programming — same reimbursement flow.",
  },
  {
    id: "arctic-circular-summit-2026",
    eventName: "Arctic Circular Economy Summit 2026",
    organizationName: "Sør-Varanger Utvikling AS",
    location: "Kirkenes, Norway",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    outputCurrency: "NOK",
    recipientEmail: "ondrej@svu.as",
  },
];

export function getCatalogEvent(id: string): CatalogEvent | undefined {
  return CATALOG.find((c) => c.id === id);
}

export type EventStatus =
  | "upcoming"
  | "active"
  | "submission_open"
  | "past";

export function getEventStatus(
  ev: CatalogEvent,
  now = new Date(),
): EventStatus {
  const start = new Date(ev.startDate + "T00:00:00");
  const end = new Date(ev.endDate + "T23:59:59");
  if (now < start) return "upcoming";
  if (now <= end) return "active";
  if (ev.reimbursementDeadline) {
    const deadline = new Date(ev.reimbursementDeadline + "T23:59:59");
    if (now <= deadline) return "submission_open";
  } else {
    const fallback = new Date(end);
    fallback.setDate(fallback.getDate() + 14);
    if (now <= fallback) return "submission_open";
  }
  return "past";
}

export function daysUntil(dateStr: string, now = new Date()): number {
  const target = new Date(dateStr + "T23:59:59");
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}
