"use server";

import { cookies } from "next/headers";
import { DISPLAY_CURRENCIES, type DisplayCurrency } from "@/lib/currency";
import { getVisitorOrigin } from "@/lib/origin-cookie";
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
