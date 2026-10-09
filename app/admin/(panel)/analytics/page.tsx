import Link from "next/link";
import { db } from "@/lib/db";
import { packages } from "@/lib/data/packages";
import { formatMoney, toNumber } from "@/lib/money";

const RANGES = [7, 30, 90] as const;
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: d } = await searchParams;
  const days = RANGES.find((r) => String(r) === d) ?? 30;
  const since = new Date(Date.now() - days * 86_400_000);

  const [visitors, waClickers, waByLabel, topPages, inquiries, paidInvoices] = await Promise.all([
    db.trackingEvent.findMany({ where: { type: "PAGE_VIEW", createdAt: { gte: since } }, distinct: ["visitorId"], select: { visitorId: true } }),
    db.trackingEvent.findMany({ where: { type: "WHATSAPP_CLICK", createdAt: { gte: since } }, distinct: ["visitorId"], select: { visitorId: true } }),
    db.trackingEvent.groupBy({ by: ["label"], where: { type: "WHATSAPP_CLICK", createdAt: { gte: since } }, _count: true, orderBy: { _count: { label: "desc" } } }),
    db.trackingEvent.groupBy({ by: ["packageSlug"], where: { type: "PAGE_VIEW", packageSlug: { not: null }, createdAt: { gte: since } }, _count: true, orderBy: { _count: { packageSlug: "desc" } }, take: 7 }),
    db.inquiry.findMany({ where: { createdAt: { gte: since } }, include: { invoices: { select: { status: true, amount: true, currency: true } } } }),
    db.invoice.findMany({ where: { status: { in: ["PAID", "PARTIALLY_PAID"] }, createdAt: { gte: since } }, include: { payments: true } }),
  ]);

  const live = (q: (typeof inquiries)[number]) => q.status !== "LOST";
  const leads = inquiries.filter((q) => live(q) && (q.status !== "NEW" || q.invoices.length > 0));
  const invoiced = inquiries.filter((q) => q.invoices.some((i) => i.status !== "VOID" && i.status !== "DRAFT"));
  const booked = inquiries.filter((q) => q.invoices.some((i) => i.status === "PAID" || i.status === "PARTIALLY_PAID"));

  const steps = [
    { label: "Website visitors", n: visitors.length },
    { label: "Clicked WhatsApp", n: waClickers.length },
    { label: "Inquiries (form + logged leads)", n: inquiries.length },
    { label: "Leads (conversation started)", n: leads.length },
    { label: "Invoiced", n: invoiced.length },
    { label: "Booked (payment received)", n: booked.length },
  ];
  const top = Math.max(1, ...steps.map((s) => s.n));

  const revenue = { USD: 0, NPR: 0 };
  for (const inv of paidInvoices) for (const p of inv.payments) if (p.status === "CONFIRMED") revenue[p.currency] += toNumber(p.amount);

  const bySource = new Map<string, number>();
  for (const q of inquiries) bySource.set(q.source, (bySource.get(q.source) ?? 0) + 1);
  const byCountry = new Map<string, number>();
  for (const q of inquiries) byCountry.set(q.country, (byCountry.get(q.country) ?? 0) + 1);
  const card = "rounded-lg border border-forest-700/15 bg-white p-5";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-800">Funnel</h1>
        <div className="flex gap-2 text-sm">
          {RANGES.map((r) => (
            <Link key={r} href={`/admin/analytics?days=${r}`} className={`rounded-sm border px-3 py-1 ${days === r ? "border-forest-700 bg-forest-700 text-cream-50" : "border-forest-700/30"}`}>Last {r} days</Link>
          ))}
        </div>
      </div>

      <div className={`${card} mt-6`}>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-forest-800">{s.label}</span>
                <span><strong className="font-display text-lg">{s.n}</strong>{i > 0 && <span className="ml-2 text-forest-700/60">{pct(s.n, steps[i - 1]!.n)} of previous</span>}</span>
              </div>
              <div className="mt-1 h-3 rounded-sm bg-forest-700/10"><div className="h-3 rounded-sm bg-rust-500" style={{ width: `${Math.max(1, (s.n / top) * 100)}%` }} /></div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-forest-700/60">
          Visitors and WhatsApp clicks are anonymous browser counts. Website visitors who message on WhatsApp appear in the funnel only once you add them as a lead on the Inquiries page,
          because WhatsApp itself doesn&apos;t tell the site what was said. Overall visitor → booking: <strong>{pct(booked.length, visitors.length)}</strong>.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Confirmed revenue</p><p className="mt-1 font-display text-xl">{formatMoney(revenue.USD, "USD")}</p><p className="font-display text-xl">{formatMoney(revenue.NPR, "NPR")}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Inquiry → booking</p><p className="mt-1 font-display text-3xl">{pct(booked.length, inquiries.length)}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Lost</p><p className="mt-1 font-display text-3xl">{inquiries.filter((q) => q.status === "LOST").length}</p></div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h2 className="font-display text-xl text-forest-800">WhatsApp clicks by button</h2>
          <ul className="mt-3 space-y-1 text-sm">{waByLabel.length === 0 && <li className="text-forest-700/60">None yet.</li>}{waByLabel.map((r) => <li key={r.label ?? "x"} className="flex justify-between"><span>{r.label ?? "page"}</span><strong>{r._count}</strong></li>)}</ul>
        </div>
        <div className={card}>
          <h2 className="font-display text-xl text-forest-800">Most viewed packages</h2>
          <ul className="mt-3 space-y-1 text-sm">{topPages.length === 0 && <li className="text-forest-700/60">None yet.</li>}{topPages.map((r) => <li key={r.packageSlug} className="flex justify-between"><span>{packages.find((p) => p.slug === r.packageSlug)?.name ?? r.packageSlug}</span><strong>{r._count}</strong></li>)}</ul>
        </div>
        <div className={card}>
          <h2 className="font-display text-xl text-forest-800">Inquiries by source</h2>
          <ul className="mt-3 space-y-1 text-sm">{[...bySource].map(([k, v]) => <li key={k} className="flex justify-between"><span>{k.toLowerCase()}</span><strong>{v}</strong></li>)}</ul>
        </div>
        <div className={card}>
          <h2 className="font-display text-xl text-forest-800">Inquiries by country</h2>
          <ul className="mt-3 space-y-1 text-sm">{[...byCountry].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => <li key={k} className="flex justify-between"><span>{k}</span><strong>{v}</strong></li>)}</ul>
        </div>
      </div>
    </>
  );
}
