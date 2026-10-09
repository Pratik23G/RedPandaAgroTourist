import type { DisplayCurrency, RateSnapshot, Rates } from "@/lib/currency";

// Free, keyless, updated daily. Docs: https://www.exchangerate-api.com/docs/free
const URL = "https://open.er-api.com/v6/latest/NPR";

// Offline fallback (Oct 2026 snapshot) so the site still shows sensible figures if the API is down.
const FALLBACK: Rates = { NPR: 1, USD: 0.0071, INR: 0.625, BDT: 0.86, PKR: 1.99 };

/**
 * Live rates, cached by Next for 1h (the source itself only updates once a day, so "every view"
 * would just re-download the same numbers). Never throws.
 */
export async function getRates(): Promise<RateSnapshot> {
  try {
    const res = await fetch(URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(String(res.status));
    const json = (await res.json()) as { result: string; rates: Record<string, number>; time_last_update_utc?: string };
    if (json.result !== "success") throw new Error("bad result");
    const pick = (c: DisplayCurrency) => {
      const v = json.rates[c];
      if (!v || v <= 0) throw new Error(`missing ${c}`);
      return v;
    };
    const rates: Rates = { NPR: 1, USD: pick("USD"), INR: pick("INR"), BDT: pick("BDT"), PKR: pick("PKR") };
    return { rates, updatedAt: json.time_last_update_utc ? new Date(json.time_last_update_utc).toISOString() : null, live: true };
  } catch {
    return { rates: FALLBACK, updatedAt: null, live: false };
  }
}
