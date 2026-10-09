import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/money";
import { StatusBadge } from "@/components/admin-status-badge";
import { logInboundEmail } from "../../actions";

export default async function EmailsPage() {
  const [emails, invoices] = await Promise.all([
    db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { invoice: { select: { id: true, number: true } } } }),
    db.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, number: true, customerName: true } }),
  ]);
  const f = "tap-target w-full rounded-lg border border-forest-700/30 bg-white px-3 text-sm";
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-forest-800">Payment emails</h1>
      <p className="text-sm text-forest-700/70">Every invoice / receipt email the site sends is logged here. “SKIPPED” means email isn&apos;t configured yet — nothing was sent.</p>

      <details className="mt-6 rounded-lg border border-forest-700/15 bg-white p-4">
        <summary className="cursor-pointer font-semibold">Log an email you received (e.g. a customer&apos;s bank slip)</summary>
        <form action={logInboundEmail} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs">From<input name="from" required className={f} /></label>
          <label className="text-xs">Invoice<select name="invoiceId" className={f}><option value="">— none —</option>{invoices.map((i) => <option key={i.id} value={i.id}>{i.number} · {i.customerName}</option>)}</select></label>
          <label className="text-xs sm:col-span-2">Subject<input name="subject" required className={f} /></label>
          <label className="text-xs sm:col-span-2">Body / summary<textarea name="body" rows={4} className="w-full rounded-lg border border-forest-700/30 px-3 py-2 text-sm" /></label>
          <button className="btn-primary sm:w-fit">Save to log</button>
        </form>
      </details>

      <ul className="mt-6 space-y-2">
        {emails.length === 0 && <li className="text-forest-700/60">No emails logged yet.</li>}
        {emails.map((e) => (
          <li key={e.id} className="rounded-lg border border-forest-700/15 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={e.status === "SENT" ? "CONFIRMED" : e.status} label={e.status} />
              <span className="text-xs uppercase tracking-wider text-forest-700/60">{e.direction === "INBOUND" ? "From" : "To"}</span>
              <span>{e.toAddress}</span>
              {e.invoice && <Link href={`/admin/invoices/${e.invoice.id}`} className="text-rust-600 hover:underline">{e.invoice.number}</Link>}
              <span className="ml-auto text-forest-700/60">{formatDate(e.createdAt)}</span>
            </div>
            <p className="mt-1 font-semibold">{e.subject}</p>
            {e.error && <p className="mt-1 text-rust-600">{e.error}</p>}
            <details className="mt-1"><summary className="cursor-pointer text-forest-700/70">Show body</summary><pre className="mt-2 whitespace-pre-wrap font-sans text-forest-800">{e.body}</pre></details>
          </li>
        ))}
      </ul>
    </>
  );
}
