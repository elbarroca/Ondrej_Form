import Dexie, { type EntityTable } from "dexie";
import type { Receipt, Trip } from "./types";

class AppDB extends Dexie {
  trips!: EntityTable<Trip, "id">;
  receipts!: EntityTable<Receipt, "id">;

  constructor() {
    super("ondrej-form");
    this.version(1).stores({
      trips: "id, createdAt, eventName",
      receipts: "id, tripId, date, category, createdAt",
    });
  }
}

export const db = new AppDB();
