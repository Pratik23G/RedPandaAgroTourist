import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  visitorId: z.string().min(8).max(64),
  type: z.enum(["PAGE_VIEW", "WHATSAPP_CLICK"]),
  path: z.string().max(200),
  label: z.string().max(60).optional(),
  origin: z.enum(["nepal", "saarc", "other"]).optional(),
});

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor/i;
const seen = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  const d = parsed.data;

  // per-visitor throttle (per instance): 200 events / hour
  const now = Date.now();
  const rec = seen.get(d.visitorId);
  if (rec && now - rec.t < 3_600_000) {
    if (rec.n >= 200) return new NextResponse(null, { status: 204 });
    rec.n++;
  } else seen.set(d.visitorId, { n: 1, t: now });
  if (seen.size > 5000) seen.clear();

  const slug = /^\/(?:packages|book)\/([a-z0-9-]+)/.exec(d.path)?.[1];
  try {
    await db.trackingEvent.create({
      data: { visitorId: d.visitorId, type: d.type, path: d.path, label: d.label, origin: d.origin, packageSlug: slug },
    });
  } catch {
    /* analytics must never break the site */
  }
  return new NextResponse(null, { status: 204 });
}
