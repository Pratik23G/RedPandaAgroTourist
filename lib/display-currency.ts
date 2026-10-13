"use server";

import { cookies } from "next/headers";
import { DISPLAY_CURRENCIES, type DisplayCurrency } from "@/lib/currency";
import { getVisitorOrigin, setVisitorOrigin, type VisitorOrigin } from "@/lib/origin-cookie";
import { getRates } from "@/lib/rates";
import type { DisplayContext } from "@/lib/currency";

const COOKIE = "display-currency";

export async function setDisplayCurrency(c: DisplayCurrency): Promise<void> {
  if (!DISPLAY_CURRENCIES.includes(c)) return;
  (await cookies()).set(COOKIE, c, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
}

/** Explicit choice wins; otherwise Nepal visitors see NPR and everyone else sees USD. */
export async function getDisplayContext(): Promise<DisplayContext> {
  const saved = (await cookies()).get(COOKIE)?.value as DisplayCurrency | undefined;
  const origin = await getVisitorOrigin();
  const currency = saved && DISPLAY_CURRENCIES.includes(saved) ? saved : origin === "nepal" ? "NPR" : "USD";
  return { currency, snapshot: await getRates() };
}

export async function getSavedCurrency(): Promise<DisplayCurrency | null> {
  const saved = (await cookies()).get(COOKIE)?.value as DisplayCurrency | undefined;
  return saved && DISPLAY_CURRENCIES.includes(saved) ? saved : null;
}

export type VisitorRegion = "nepal" | "india" | "bangladesh" | "pakistan" | "other";

const REGIONS: Record<VisitorRegion, { origin: VisitorOrigin; currency: DisplayCurrency }> = {
  nepal: { origin: "nepal", currency: "NPR" },
  india: { origin: "saarc", currency: "INR" },
  bangladesh: { origin: "saarc", currency: "BDT" },
  pakistan: { origin: "saarc", currency: "PKR" },
  other: { origin: "other", currency: "USD" },
};

/** Picking where you're visiting from sets the pricing tier AND switches the display currency to match (overwriting any earlier currency choice). */
export async function setVisitorRegion(region: VisitorRegion): Promise<void> {
  const r = REGIONS[region];
  if (!r) return;
  await setVisitorOrigin(r.origin);
  await setDisplayCurrency(r.currency);
}
