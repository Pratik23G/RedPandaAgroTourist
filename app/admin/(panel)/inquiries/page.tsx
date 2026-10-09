import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/money";
import { packages } from "@/lib/data/packages";
import { addLead, setInquiryStatus } from "../../actions";

const STATUSES = ["NEW", "CONTACTED", "INVOICED", "LOST", "CLOSED"] as const;

export default async function InquiriesPage() {
  const inquiries = await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { invoices: { select: { id: true, number: true } } } });
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-forest-800">Inquiries</h1>
      <details className="mt-4 rounded-lg border border-forest-700/15 bg-white p-4">
        <summary className="cursor-pointer font-semibold">+ Add a lead from WhatsApp / phone</summary>
        <form action={addLead} className="mt-4 grid gap-3 sm:grid-cols-3">
          {([["name", "Name"], ["contact", "Phone / WhatsApp / email"], ["country", "Country"]] as const).map(([n, l]) => (
            <label key={n} className="text-xs">{l}<input name={n} required={n !== "country"} className="tap-target w-full rounded-lg border border-forest-700/30 px-3 text-sm" /></label>
          ))}
          <label className="text-xs">Came from<select name="source" className="tap-target w-full rounded-lg border border-forest-700/30 bg-white px-3 text-sm"><option value="WHATSAPP">WhatsApp</option><option value="PHONE">Phone call</option><option value="OTHER">Other</option></select></label>
          <label className="text-xs">Package<select name="packageSlug" className="tap-target w-full rounded-lg border border-forest-700/30 bg-white px-3 text-sm"><option value="">Not sure</option>{packages.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
          <label className="text-xs">Group size<input name="groupSize" type="number" min={1} defaultValue={2} className="tap-target w-full rounded-lg border border-forest-700/30 px-3 text-sm" /></label>
          <label className="text-xs sm:col-span-3">Notes<input name="message" className="tap-target w-full rounded-lg border border-forest-700/30 px-3 text-sm" /></label>
          <button className="btn-primary sm:w-fit">Add lead</button>
        </form>
      </details>
      {inquiries.length === 0 && <p className="mt-4 text-forest-700/70">No inquiries yet.</p>}
      <ul className="mt-6 space-y-3">
        {inquiries.map((q) => {
          const pkg = packages.find((p) => p.slug === q.packageSlug);
          return (
            <li key={q.id} className="rounded-lg border border-forest-700/15 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest-800">{q.name} <span className="font-normal text-forest-700/60">· {q.country} · via {q.source.toLowerCase()}</span></p>
                  <p className="text-sm">{q.contact}</p>
                  <p className="mt-1 text-sm text-forest-700/80">{pkg?.name ?? "No package chosen"} · {q.groupSize} {q.groupSize === 1 ? "person" : "people"} · {q.preferredDates} · received {formatDate(q.createdAt)}</p>
                  {q.message && <p className="mt-1 text-sm italic text-forest-700/70">“{q.message}”</p>}
                  {q.invoices.map((i) => <Link key={i.id} href={`/admin/invoices/${i.id}`} className="mr-2 text-sm text-rust-600 hover:underline">{i.number}</Link>)}
                </div>
                <div className="flex items-center gap-2">
                  <form action={setInquiryStatus}>
                    <input type="hidden" name="id" value={q.id} />
                    <select name="status" defaultValue={q.status} className="tap-target rounded-sm border border-forest-700/30 bg-white px-2 text-sm">
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button className="tap-target px-2 text-sm text-forest-700 hover:underline">Save</button>
                  </form>
                  <Link href={`/admin/invoices/new?inquiry=${q.id}`} className="btn-primary !min-h-[36px] !px-4 text-sm">Create invoice</Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
