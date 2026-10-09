import type { Currency } from "@prisma/client";

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  NPR: new Intl.NumberFormat("en-IN", { style: "currency", currency: "NPR" }),
};

type Numeric = number | string | { toString(): string };

export function toNumber(v: Numeric): number {
  return typeof v === "number" ? v : Number(v.toString());
}

export function formatMoney(v: Numeric, currency: Currency): string {
  return FORMATTERS[currency].format(toNumber(v));
}

export function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
