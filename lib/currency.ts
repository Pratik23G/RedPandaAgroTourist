/** Pure currency helpers (safe in client + server). Rates come from lib/rates.ts. */
export const DISPLAY_CURRENCIES = ["USD", "NPR", "INR", "BDT", "PKR"] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<DisplayCurrency, string> = {
  USD: "US Dollar ($)",
  NPR: "Nepali Rupee (Rs.)",
  INR: "Indian Rupee (₹)",
  BDT: "Bangladeshi Taka (৳)",
  PKR: "Pakistani Rupee (Rs.)",
};

/** Units of each currency per 1 NPR. */
export type Rates = Record<DisplayCurrency, number>;

export interface RateSnapshot {
  rates: Rates;
  /** ISO time the upstream source last updated, or null when using the offline fallback. */
  updatedAt: string | null;
  live: boolean;
}

export interface DisplayContext {
  currency: DisplayCurrency;
  snapshot: RateSnapshot;
}

const LOCALES: Record<DisplayCurrency, string> = { USD: "en-US", NPR: "en-IN", INR: "en-IN", BDT: "en-BD", PKR: "en-PK" };

export function convert(amount: number, from: DisplayCurrency, to: DisplayCurrency, rates: Rates): number {
  if (from === to) return amount;
  return (amount / rates[from]) * rates[to];
}

/** Round to a figure that reads like a price, not a calculator: ~1% granularity, never below 1. */
export function niceRound(value: number): number {
  if (value < 20) return Math.round(value);
  const step = Math.pow(10, Math.floor(Math.log10(value)) - 1); // 2 significant digits
  return Math.round(value / step) * step;
}

export function formatCurrency(value: number, currency: DisplayCurrency): string {
  return new Intl.NumberFormat(LOCALES[currency], { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}
