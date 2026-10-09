import Link from "next/link";
import { db } from "@/lib/db";
import { confirmedTotal } from "@/lib/invoices";
import { formatDate, formatMoney, toNumber } from "@/lib/money";
import { StatusBadge } from "@/components/admin-status-badge";

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = ["DRAFT", "SENT", "PARTIALLY_PAID", "PAID", "VOID"] as const;
  const filter = valid.find((s) => s === status);
  const invoices = await db.invoice.findMany({ where: filter ? { status: filter } : {}, orderBy: { createdAt: "desc" }, take: 200, include: { payments: true } });
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-800">Invoices</h1>
        <Link href="/admin/invoices/new" className="btn-primary">New invoice</Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/invoices" className={`rounded-sm border px-3 py-1 ${!filter ? "border-forest-700 bg-forest-700 text-cream-50" : "border-forest-700/30"}`}>All</Link>
        {valid.map((s) => <Link key={s} href={`/admin/invoices?status=${s}`} className={`rounded-sm border px-3 py-1 ${filter === s ? "border-forest-700 bg-forest-700 text-cream-50" : "border-forest-700/30"}`}>{s.replace("_", " ")}</Link>)}
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-forest-700/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-forest-700/15 text-xs uppercase tracking-wider text-forest-700/60">
            <tr><th className="p-3">Number</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Paid</th><th className="p-3">Status</th><th className="p-3">Issued</th></tr>
          </thead>
          <tbody className="divide-y divide-forest-700/10">
            {invoices.map((i) => (
              <tr key={i.id} className="hover:bg-cream-100/50">
                <td className="p-3 font-mono"><Link href={`/admin/invoices/${i.id}`} className="text-rust-600 hover:underline">{i.number}</Link></td>
                <td className="p-3">{i.customerName}</td>
                <td className="p-3">{formatMoney(toNumber(i.amount), i.currency)}</td>
                <td className="p-3">{formatMoney(confirmedTotal(i.payments), i.currency)}</td>
                <td className="p-3"><StatusBadge status={i.status} /></td>
                <td className="p-3">{formatDate(i.createdAt)}</td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-forest-700/60">No invoices.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
