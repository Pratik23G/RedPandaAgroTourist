import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { toNumber } from "@/lib/money";

/** Next RP-YYYY-NNNN number. Unique constraint + caller retry guards against races. */
export async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RP-${year}-`;
  const last = await db.invoice.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const n = last ? Number(last.number.slice(prefix.length)) + 1 : 1;
  return `${prefix}${String(n).padStart(4, "0")}`;
}

export async function createInvoiceWithNumber(data: Omit<Prisma.InvoiceUncheckedCreateInput, "number">) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.invoice.create({ data: { ...data, number: await nextInvoiceNumber() } });
    } catch (e) {
      const dup = typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
      if (!dup || attempt === 2) throw e;
    }
  }
  throw new Error("unreachable");
}

export function confirmedTotal(payments: { amount: Prisma.Decimal | number; status: string }[]): number {
  return payments.filter((p) => p.status === "CONFIRMED").reduce((sum, p) => sum + toNumber(p.amount), 0);
}

/** Recompute PAID / PARTIALLY_PAID from confirmed payments. Leaves DRAFT/VOID alone unless money arrived. */
export async function syncInvoiceStatus(invoiceId: string) {
  const inv = await db.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
  if (!inv || inv.status === "VOID") return;
  const paid = confirmedTotal(inv.payments);
  const total = toNumber(inv.amount);
  const status = paid >= total ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : inv.status === "PAID" || inv.status === "PARTIALLY_PAID" ? "SENT" : inv.status;
  if (status !== inv.status) await db.invoice.update({ where: { id: invoiceId }, data: { status } });
}
