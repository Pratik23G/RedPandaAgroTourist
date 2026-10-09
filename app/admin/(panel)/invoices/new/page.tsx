import { db } from "@/lib/db";
import { packages } from "@/lib/data/packages";
import { NewInvoiceForm } from "./new-invoice-form";

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ inquiry?: string }> }) {
  const { inquiry: inquiryId } = await searchParams;
  const q = inquiryId ? await db.inquiry.findUnique({ where: { id: inquiryId } }) : null;
  const pkg = q ? packages.find((p) => p.slug === q.packageSlug) : undefined;
  const isEmail = q?.contact.includes("@");
  const defaults = {
    inquiryId: q?.id ?? "",
    customerName: q?.name ?? "",
    customerEmail: q && isEmail ? q.contact : "",
    customerPhone: q && !isEmail ? q.contact : "",
    description: pkg ? `${pkg.name}${q ? ` — ${q.groupSize} ${q.groupSize === 1 ? "person" : "people"}, ${q.preferredDates}` : ""}` : "",
    amount: pkg?.price.confirmed && pkg.price.amount ? String(pkg.price.amount * (pkg.price.unit.includes("per person") && q ? q.groupSize : 1)) : "",
    currency: pkg?.price.currency ?? "USD",
  };
  return (
    <>
      <h1 className="font-display text-3xl font-bold text-forest-800">New invoice</h1>
      {q && <p className="mt-1 text-sm text-forest-700/70">From inquiry by {q.name}. Check the amount before sending — package prices are prefilled only when confirmed.</p>}
      <NewInvoiceForm defaults={defaults} />
    </>
  );
}
