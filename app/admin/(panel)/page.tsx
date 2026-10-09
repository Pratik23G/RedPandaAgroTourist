import Link from "next/link";
import { db } from "@/lib/db";
import { confirmedTotal } from "@/lib/invoices";
import { formatDate, formatMoney, toNumber } from "@/lib/money";
import { reviewPayment } from "../actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-config";

export default async function AdminDashboard() {
  const [newInquiries, openInvoices, pending] = await Promise.all([
    db.inquiry.count({ where: { status: "NEW" } }),
    db.invoice.findMany({ where: { status: { in: ["SENT", "PARTIALLY_PAID"] } }, include: { payments: true } }),
    db.payment.findMany({ where: { status: "PENDING" }, include: { invoice: true }, orderBy: { receivedAt: "desc" } }),
  ]);

  const outstanding = { USD: 0, NPR: 0 };
  for (const inv of openInvoices) outstanding[inv.currency] += toNumber(inv.amount) - confirmedTotal(inv.payments);

  const stat = "rounded-lg border border-forest-700/15 bg-white p-5";
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-forest-800">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Link href="/admin/inquiries" className={stat}><p className="text-xs uppercase tracking-wider text-forest-700/60">New inquiries</p><p className="mt-1 font-display text-3xl">{newInquiries}</p></Link>
        <Link href="/admin/invoices" className={stat}><p className="text-xs uppercase tracking-wider text-forest-700/60">Open invoices</p><p className="mt-1 font-display text-3xl">{openInvoices.length}</p></Link>
        <div className={stat}><p className="text-xs uppercase tracking-wider text-forest-700/60">Outstanding</p><p className="mt-1 font-display text-xl">{formatMoney(outstanding.USD, "USD")}</p><p className="font-display text-xl">{formatMoney(outstanding.NPR, "NPR")}</p></div>
        <div className={stat}><p className="text-xs uppercase tracking-wider text-forest-700/60">Awaiting your check</p><p className="mt-1 font-display text-3xl text-rust-600">{pending.length}</p></div>
      </div>

      <h2 className="mt-10 font-display text-2xl text-forest-800">Payments to verify</h2>
      <p className="text-sm text-forest-700/70">Customers reported these. Confirm only after the money shows in your bank / wallet.</p>
      {pending.length === 0 ? <p className="mt-4 text-forest-700/70">Nothing waiting.</p> : (
        <ul className="mt-4 divide-y divide-forest-700/10 rounded-lg border border-forest-700/15 bg-white">
          {pending.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/invoices/${p.invoiceId}`} className="font-semibold text-forest-800 hover:underline">{p.invoice.number} · {p.invoice.customerName}</Link>
                <p className="text-sm text-forest-700/70">{formatMoney(p.amount, p.currency)} via {PAYMENT_METHOD_LABELS[p.method]} · ref {p.reference ?? "—"} · {formatDate(p.receivedAt)}</p>
                {p.payerNote && <p className="text-sm italic text-forest-700/70">“{p.payerNote}”</p>}
              </div>
              <div className="flex gap-2">
                {(["CONFIRMED", "REJECTED"] as const).map((d) => (
                  <form key={d} action={reviewPayment}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="decision" value={d} />
                    <button className={d === "CONFIRMED" ? "tap-target rounded-sm bg-forest-700 px-4 text-sm font-semibold text-cream-50 hover:bg-forest-600" : "tap-target rounded-sm border border-rust-500 px-4 text-sm font-semibold text-rust-600 hover:bg-rust-500/10"}>{d === "CONFIRMED" ? "Confirm" : "Reject"}</button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
