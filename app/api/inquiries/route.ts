import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquirySchema } from "@/lib/inquiry-schema";

// Naive per-instance throttle: 5 inquiries / 10 min / IP. Replace with Turnstile + shared store at launch.
const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const json = await req.json().catch(() => null);
  if (json && typeof json === "object" && "website" in json && json.website) {
    return NextResponse.json({ ok: true }); // honeypot filled: pretend success
  }
  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  try {
    const inquiry = await db.inquiry.create({ data: parsed.data });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch {
    // DB down / not configured: the WhatsApp relay still carries the inquiry, so don't hard-fail the user.
    return NextResponse.json({ error: "Could not save" }, { status: 503 });
  }
}
