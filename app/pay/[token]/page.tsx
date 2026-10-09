import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { confirmedTotal } from "@/lib/invoices";
import { formatDate, formatMoney, toNumber } from "@/lib/money";
import { getBankDetails, hasBankDetails } from "@/lib/payment-config";
import { OFFICES } from "@/components/whatsapp-cta";
import { ReportPaymentForm } from "@/components/report-payment-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pay your invoice", robots: { index: false, follow: false } };

export default async function PayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invoice = await db.invoice.findUnique({ where: { publicToken: token }, include: { payments: true } });
  if (!invoice || invoice.status === "DRAFT") notFound();

  const total = toNumber(invoice.amount);
  const paid = confirmedTotal(invoice.payments);
  const balance = Math.max(0, total - paid);
  const pending = invoice.payments.filter((p) => p.status === "PENDING");
  const bank = getBankDetails();
  const waText = `Hi! I'd like to pay invoice ${invoice.number} (${formatMoney(balance, invoice.currency)}).`;
  const waHref = `https://wa.me/${OFFICES.tumling.phone}?text=${encodeURIComponent(waText)}`;
  const closed = invoice.status === "PAID" || invoice.status === "VOID";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <span className="eyebrow">Invoice {invoice.number}</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-forest-800">{invoice.description}</h1>
      <p className="mt-1 text-forest-700/80">Prepared for {invoice.customerName} · issued {formatDate(invoice.createdAt)}</p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-forest-700/15 py-5 text-center">
        <div><dt className="text-xs uppercase tracking-wider text-forest-700/60">Total</dt><dd className="mt-1 font-display text-xl">{formatMoney(total, invoice.currency)}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-forest-700/60">Received</dt><dd className="mt-1 font-display text-xl">{formatMoney(paid, invoice.currency)}</dd></div>
        <div><dt className="text-xs uppercase tracking-wider text-forest-700/60">Balance</dt><dd className="mt-1 font-display text-xl text-rust-600">{formatMoney(balance, invoice.currency)}</dd></div>
      </dl>

      {invoice.status === "PAID" && <p className="mt-6 rounded-lg bg-forest-600/10 p-4 text-forest-800">Paid in full — thank you! See you in the hills.</p>}
      {invoice.status === "VOID" && <p className="mt-6 rounded-lg bg-rust-500/10 p-4 text-rust-700">This invoice has been cancelled.</p>}

      {!closed && (
        <>
          <h2 className="mt-10 font-display text-2xl text-forest-800">How to pay</h2>

          <section className="mt-4 rounded-lg border border-forest-700/20 bg-white p-5">
            <h3 className="font-semibold text-forest-800">Option 1 — Bank wire transfer</h3>
            {hasBankDetails(bank) ? (
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {([["Bank", bank.bankName], ["Account name", bank.accountName], ["Account number", bank.accountNumber], ["Branch", bank.branch], ["SWIFT / BIC", bank.swift]] as const).map(
                  ([k, v]) => v && (<div key={k} className="contents"><dt className="text-forest-700/70">{k}</dt><dd className="font-mono">{v}</dd></div>),
                )}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-forest-700/80">Message us on WhatsApp and we&apos;ll send our bank details directly.</p>
            )}
            <p className="mt-3 text-sm text-forest-700/80">
              Put <strong>{invoice.number}</strong> in the transfer reference. International wires can take 2–5 business days; bank or
              intermediary fees are paid by the sender.
            </p>
            {bank.notes && <p className="mt-2 text-sm text-forest-700/80">{bank.notes}</p>}
          </section>

          <section className="mt-4 rounded-lg border border-forest-700/20 bg-white p-5">
            <h3 className="font-semibold text-forest-800">Option 2 — Arrange payment on WhatsApp</h3>
            <p className="mt-2 text-sm text-forest-700/80">Prefer to pay another way, or have a question? Chat with us and we&apos;ll sort it out.</p>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary mt-3 bg-forest-700 hover:bg-forest-600">Message us on WhatsApp</a>
          </section>

          {pending.length > 0 && (
            <p className="mt-6 rounded-lg bg-gold-400/20 p-4 text-sm text-forest-800">
              We&apos;ve received your payment report ({pending.map((p) => formatMoney(p.amount, p.currency)).join(", ")}) and are verifying it with the bank.
            </p>
          )}

          <h2 className="mt-10 font-display text-2xl text-forest-800">Already paid?</h2>
          <p className="mb-4 mt-1 text-sm text-forest-700/80">Tell us so we can match it to your invoice.</p>
          <ReportPaymentForm token={token} defaultAmount={balance} />
        </>
      )}
    </div>
  );
}
