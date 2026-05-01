const CACHE_KEY = "fx-cache:v1";

interface FxCache {
  [key: string]: { rate: number; fetchedAt: number };
}

function loadCache(): FxCache {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "{}") as FxCache;
  } catch {
    return {};
  }
}

function saveCache(cache: FxCache): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function cacheKey(date: string, from: string, to: string): string {
  return `${date}:${from}:${to}`;
}

export interface FxResult {
  rate: number;
  fetchedAt: number;
  cached: boolean;
}

export async function getRate(
  date: string,
  from: string,
  to: string,
): Promise<FxResult> {
  if (from === to) {
    return { rate: 1, fetchedAt: Date.now(), cached: true };
  }
  const key = cacheKey(date, from, to);
  const cache = loadCache();
  const hit = cache[key];
  if (hit) return { ...hit, cached: true };

  const url = `https://api.frankfurter.dev/v1/${date}?base=${from}&symbols=${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`);
  const json = (await res.json()) as { rates?: Record<string, number> };
  const rate = json.rates?.[to];
  if (typeof rate !== "number") throw new Error(`No rate for ${to}`);

  const fetchedAt = Date.now();
  cache[key] = { rate, fetchedAt };
  saveCache(cache);
  return { rate, fetchedAt, cached: false };
}

export function convert(amount: number, rate: number): number {
  return Math.round(amount * rate * 100) / 100;
}
