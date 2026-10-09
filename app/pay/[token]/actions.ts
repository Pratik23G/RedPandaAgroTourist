"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  token: z.string().min(10).max(60),
  method: z.enum(["BANK_TRANSFER", "WHATSAPP", "ESEWA", "KHALTI", "CASH", "OTHER"]),
  amount: z.coerce.number().positive().max(1_000_000),
  reference: z.string().trim().max(120).optional(),
  payerNote: z.string().trim().max(500).optional(),
});

export type ReportState = { ok: boolean; message: string };

/** Customer says "I paid". Creates a PENDING payment only — the owner confirms in /admin once it lands. */
export async function reportPayment(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const parsed = schema.safeParse({
    token: formData.get("token"),
    method: formData.get("method"),
    amount: formData.get("amount"),
    reference: formData.get("reference") || undefined,
    payerNote: formData.get("payerNote") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Please check the amount and payment method." };

  const invoice = await db.invoice.findUnique({ where: { publicToken: parsed.data.token } });
  if (!invoice || invoice.status === "VOID" || invoice.status === "DRAFT") {
    return { ok: false, message: "This invoice is not open for payment." };
  }
  await db.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: parsed.data.amount,
      currency: invoice.currency,
      method: parsed.data.method,
      reference: parsed.data.reference,
      payerNote: parsed.data.payerNote,
    },
  });
  revalidatePath(`/pay/${parsed.data.token}`);
  revalidatePath("/admin");
  return { ok: true, message: "Thank you — we've been notified and will confirm once the payment reaches us." };
}
