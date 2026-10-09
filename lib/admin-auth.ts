/**
 * Single-owner admin auth: one shared password (ADMIN_PASSWORD) -> HS256-style signed,
 * expiring, httpOnly cookie. Uses Web Crypto only so the same code runs in middleware (edge)
 * and server actions (node). Brief §6.8 suggests Auth.js; this is the lightweight stand-in.
 */
export const ADMIN_COOKIE = "rp_admin";
const SESSION_MS = 1000 * 60 * 60 * 12;

const enc = new TextEncoder();

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(message: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", k, enc.encode(message)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  const s = secret();
  if (!expected || !s) return false;
  // Compare HMACs of both so length differences don't leak.
  return safeEqual(await hmac(input, s), await hmac(expected, s));
}

export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + SESSION_MS);
  return `${exp}.${await hmac(exp, secret()!)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const s = secret();
  if (!token || !s) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(exp, s));
}

export const SESSION_MAX_AGE_S = SESSION_MS / 1000;
