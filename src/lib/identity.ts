import type { Identity } from "./types";

const KEY = "identity:v1";

export const EMPTY_IDENTITY: Identity = {
  fullName: "",
  address: "",
  postalCode: "",
  place: "",
  country: "",
  phone: "",
  email: "",
  bankAccount: "",
  iban: "",
  bicSwift: "",
  signaturePng: "",
};

export function loadIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return { ...EMPTY_IDENTITY, ...(JSON.parse(raw) as Partial<Identity>) };
  } catch {
    return null;
  }
}

export function saveIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(identity));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

export function clearIdentity(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}

export function isIdentityComplete(i: Identity | null): i is Identity {
  if (!i) return false;
  return Boolean(
    i.fullName &&
      i.address &&
      i.email &&
      i.iban &&
      i.bicSwift &&
      i.signaturePng,
  );
}
