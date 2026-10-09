"use client";

import { useActionState } from "react";
import { createInvoice } from "../../../actions";

const f = "tap-target mt-1 w-full rounded-lg border border-forest-700/30 bg-white px-3";

export function NewInvoiceForm({ defaults }: { defaults: Record<string, string> }) {
  const [state, action, pending] = useActionState(createInvoice, { error: "" });
  return (
    <form action={action} className="mt-6 max-w-xl space-y-4">
      <input type="hidden" name="inquiryId" value={defaults.inquiryId} />
      <label className="block text-sm font-medium">Customer name<input name="customerName" required defaultValue={defaults.customerName} className={f} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Email (for sending the invoice)<input name="customerEmail" type="email" defaultValue={defaults.customerEmail} className={f} /></label>
        <label className="block text-sm font-medium">Phone / WhatsApp<input name="customerPhone" defaultValue={defaults.customerPhone} className={f} /></label>
      </div>
      <label className="block text-sm font-medium">Description<input name="description" required defaultValue={defaults.description} className={f} /></label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium sm:col-span-2">Amount<input name="amount" type="number" step="0.01" min="0.01" required defaultValue={defaults.amount} className={f} /></label>
        <label className="block text-sm font-medium">Currency<select name="currency" defaultValue={defaults.currency} className={f}><option>USD</option><option>NPR</option></select></label>
      </div>
      <label className="block text-sm font-medium">Due date (optional)<input name="dueDate" type="date" className={f} /></label>
      <label className="block text-sm font-medium">Internal notes<textarea name="notes" rows={2} className="mt-1 w-full rounded-lg border border-forest-700/30 px-3 py-2" /></label>
      {state.error && <p role="alert" className="text-sm text-rust-600">{state.error}</p>}
      <button disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Creating…" : "Create invoice (draft)"}</button>
    </form>
  );
}
