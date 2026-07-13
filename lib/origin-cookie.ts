"use server";

import { cookies } from "next/headers";

export type VisitorOrigin = "nepal" | "saarc" | "other";

const COOKIE_NAME = "visitor-origin";
const VALID_ORIGINS: VisitorOrigin[] = ["nepal", "saarc", "other"];

export async function getVisitorOrigin(): Promise<VisitorOrigin> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return VALID_ORIGINS.includes(value as VisitorOrigin) ? (value as VisitorOrigin) : "other";
}

export async function setVisitorOrigin(origin: VisitorOrigin): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, origin, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    // Not `secure`-only in local dev (http://localhost); Vercel serves https so
    // the cookie still only travels encrypted in production.
  });
}
