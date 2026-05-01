"use client";

import { useSyncExternalStore } from "react";
import { loadIdentity } from "./identity";
import type { Identity } from "./types";

const KEY = "identity:v1";
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function notifyIdentityChanged(): void {
  for (const l of listeners) l();
}

let snapshotCache: Identity | null = null;
let snapshotRaw: string | null = null;

function getSnapshot(): Identity | null {
  const raw = window.localStorage.getItem(KEY);
  if (raw === snapshotRaw) return snapshotCache;
  snapshotRaw = raw;
  snapshotCache = loadIdentity();
  return snapshotCache;
}

function getServerSnapshot(): Identity | null {
  return null;
}

export function useIdentity(): Identity | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
