import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { confirmedTotal } from "@/lib/invoices";
import { formatDate, formatMoney, toNumber } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-config";
import { StatusBadge } from "@/components/admin-status-badge";
import { recordPayment, reviewPayment, sendInvoice, voidInvoice } from "../../../actions";

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await db.invoice.findUnique({ where: { id }, include: { payments: { orderBy: { receivedAt: "desc" } }, emails: { orderBy: { createdAt: "desc" } } } });
  if (!inv) notFound();

  const total = toNumber(inv.amount);
  const paid = confirmedTotal(inv.payments);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const payUrl = `${base}/pay/${inv.publicToken}`;
  const waText = `Hello ${inv.customerName}! Here is your invoice ${inv.number} (${formatMoney(total, inv.currency)}) with payment options: ${payUrl}`;
  const waPhone = inv.customerPhone?.replace(/\D/g, "");
  const f = "tap-target w-full rounded-lg border border-forest-700/30 bg-white px-3 text-sm";
  const card = "rounded-lg border border-forest-700/15 bg-white p-5";

  return (
    <>
      <Link href="/admin/invoices" className="text-sm text-forest-700/70 hover:underline">← All invoices</Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-800">{inv.number}</h1>
        <StatusBadge status={inv.status} />
      </div>
      <p className="mt-1 text-forest-700/80">{inv.customerName} · {inv.customerEmail ?? "no email"} · {inv.customerPhone ?? "no phone"}</p>
      <p className="text-forest-700/80">{inv.description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Total</p><p className="mt-1 font-display text-2xl">{formatMoney(total, inv.currency)}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Confirmed paid</p><p className="mt-1 font-display text-2xl">{formatMoney(paid, inv.currency)}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-forest-700/60">Balance</p><p className="mt-1 font-display text-2xl text-rust-600">{formatMoney(Math.max(0, total - paid), inv.currency)}</p></div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form action={sendInvoice}>
          <input type="hidden" name="id" value={inv.id} />
          <button className="btn-primary" disabled={inv.status === "VOID"}>{inv.status === "DRAFT" ? "Mark sent & email customer" : "Re-send invoice email"}</button>
        </form>
        {waPhone && <a href={`https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-forest-800">Send via WhatsApp</a>}
        <Link href={`/pay/${inv.publicToken}`} target="_blank" className="btn-outline text-forest-800">Open customer page</Link>
        {inv.status !== "VOID" && inv.status !== "PAID" && (
          <form action={voidInvoice} className="ml-auto"><input type="hidden" name="id" value={inv.id} /><button className="tap-target px-3 text-sm text-rust-600 hover:underline">Void invoice</button></form>
        )}
      </div>
      {!inv.customerEmail && <p className="mt-2 text-sm text-rust-600">No customer email — use the WhatsApp button or copy the link: <code>{payUrl}</code></p>}

      <h2 className="mt-10 font-display text-2xl text-forest-800">Payments</h2>
      <ul className="mt-3 divide-y divide-forest-700/10 rounded-lg border border-forest-700/15 bg-white">
        {inv.payments.length === 0 && <li className="p-4 text-forest-700/60">No payments yet.</li>}
        {inv.payments.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
            <StatusBadge status={p.status} />
            <span className="font-semibold">{formatMoney(p.amount, p.currency)}</span>
            <span>{PAYMENT_METHOD_LABELS[p.method]} · ref {p.reference ?? "—"} · {formatDate(p.receivedAt)}</span>
            {p.payerNote && <span className="italic text-forest-700/70">“{p.payerNote}”</span>}
            {p.status === "PENDING" && (
              <div className="ml-auto flex gap-2">
                {(["CONFIRMED", "REJECTED"] as const).map((d) => (
                  <form key={d} action={reviewPayment}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value={d} />
                    <button className={d === "CONFIRMED" ? "rounded-sm bg-forest-700 px-3 py-1.5 font-semibold text-cream-50" : "rounded-sm border border-rust-500 px-3 py-1.5 font-semibold text-rust-600"}>{d === "CONFIRMED" ? "Confirm" : "Reject"}</button>
                  </form>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {inv.status !== "VOID" && (
        <form action={recordPayment} className={`${card} mt-4 grid gap-3 sm:grid-cols-5 sm:items-end`}>
          <input type="hidden" name="invoiceId" value={inv.id} />
          <p className="text-sm font-semibold sm:col-span-5">Record a payment you&apos;ve received</p>
          <label className="text-xs">Amount<input name="amount" type="number" step="0.01" min="0.01" required defaultValue={Math.max(0, total - paid) || ""} className={f} /></label>
          <label className="text-xs">Method<select name="method" className={f}>{Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <label className="text-xs sm:col-span-2">Reference<input name="reference" className={f} /></label>
          <button className="btn-primary">Record</button>
        </form>
      )}

      <h2 className="mt-10 font-display text-2xl text-forest-800">Emails on this invoice</h2>
      <ul className="mt-3 space-y-2">
        {inv.emails.length === 0 && <li className="text-forest-700/60">None yet.</li>}
        {inv.emails.map((e) => (
          <li key={e.id} className="rounded-lg border border-forest-700/15 bg-white p-3 text-sm">
            <StatusBadge status={e.status === "SENT" ? "CONFIRMED" : e.status} label={`${e.direction} · ${e.status}`} /> <span className="ml-2 font-semibold">{e.subject}</span>
            <span className="ml-2 text-forest-700/60">{e.toAddress} · {formatDate(e.createdAt)}</span>
            {e.error && <p className="mt-1 text-rust-600">{e.error}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
