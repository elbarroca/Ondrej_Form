import { db } from "./db";
import { getCatalogEvent } from "./catalog";
import type { Receipt, Trip } from "./types";

function uid(): string {
  return crypto.randomUUID();
}

export async function createTrip(
  data: Omit<Trip, "id" | "createdAt">,
): Promise<Trip> {
  const trip: Trip = { ...data, id: uid(), createdAt: Date.now() };
  await db.trips.add(trip);
  return trip;
}

export async function updateTrip(
  id: string,
  patch: Partial<Omit<Trip, "id">>,
): Promise<void> {
  await db.trips.update(id, patch);
}

export async function deleteTrip(id: string): Promise<void> {
  await db.transaction("rw", db.trips, db.receipts, async () => {
    await db.receipts.where("tripId").equals(id).delete();
    await db.trips.delete(id);
  });
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  return db.trips.get(id);
}

export async function listTrips(): Promise<Trip[]> {
  return db.trips.orderBy("createdAt").reverse().toArray();
}

export async function addReceipt(
  data: Omit<Receipt, "id" | "createdAt">,
): Promise<Receipt> {
  const receipt: Receipt = { ...data, id: uid(), createdAt: Date.now() };
  await db.receipts.add(receipt);
  return receipt;
}

export async function deleteReceipt(id: string): Promise<void> {
  await db.receipts.delete(id);
}

export async function listReceipts(tripId: string): Promise<Receipt[]> {
  return db.receipts.where("tripId").equals(tripId).sortBy("date");
}

export async function activateCatalogTrip(catalogId: string): Promise<Trip> {
  const existing = await db.trips.where("catalogId").equals(catalogId).first();
  if (existing) return existing;
  const ev = getCatalogEvent(catalogId);
  if (!ev) throw new Error(`Unknown catalog event: ${catalogId}`);
  return createTrip({
    catalogId,
    eventName: ev.eventName,
    location: ev.location,
    startDate: ev.startDate,
    endDate: ev.endDate,
    outputCurrency: ev.outputCurrency,
    recipientEmail: ev.recipientEmail,
    organizationName: ev.organizationName,
    rulesText: ev.rulesText,
    maxAmount: ev.maxAmount,
  });
}

export async function markSubmitted(id: string, submitted: boolean): Promise<void> {
  await db.trips.update(id, {
    submittedAt: submitted ? Date.now() : undefined,
  });
}
