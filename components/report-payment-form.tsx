"use client";

import { useActionState } from "react";
import { reportPayment, type ReportState } from "@/app/pay/[token]/actions";

const initial: ReportState = { ok: false, message: "" };
const field = "tap-target mt-1 w-full rounded-lg border border-forest-700/30 bg-white px-3";

export function ReportPaymentForm({ token, defaultAmount }: { token: string; defaultAmount: number }) {
  const [state, action, pending] = useActionState(reportPayment, initial);

  if (state.ok) {
    return <p className="rounded-lg border border-forest-600/30 bg-forest-600/10 p-4 text-forest-800">{state.message}</p>;
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-forest-800">
          How did you pay?
          <select name="method" className={field} defaultValue="BANK_TRANSFER">
            <option value="BANK_TRANSFER">Bank wire transfer</option>
            <option value="WHATSAPP">Arranged on WhatsApp</option>
            <option value="ESEWA">eSewa</option>
            <option value="KHALTI">Khalti</option>
            <option value="CASH">Cash</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-forest-800">
          Amount sent
          <input name="amount" type="number" step="0.01" min="0.01" defaultValue={defaultAmount} required className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium text-forest-800">
        Transaction / reference number (from your bank slip)
        <input name="reference" maxLength={120} className={field} />
      </label>
      <label className="block text-sm font-medium text-forest-800">
        Note (optional)
        <textarea name="payerNote" maxLength={500} rows={2} className="mt-1 w-full rounded-lg border border-forest-700/30 px-3 py-2" />
      </label>
      {state.message && <p className="text-sm text-rust-600">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? "Sending…" : "I've sent the payment"}
      </button>
    </form>
  );
}
