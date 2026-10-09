"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, SESSION_MAX_AGE_S, checkPassword, createSessionToken } from "@/lib/admin-auth";
import { requireAdmin } from "@/lib/admin-session";
import { createInvoiceWithNumber, syncInvoiceStatus } from "@/lib/invoices";
import { sendLoggedEmail } from "@/lib/email";
import { formatMoney, toNumber } from "@/lib/money";

// ---------- auth ----------
const attempts = new Map<string, { n: number; first: number }>();

export async function login(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rec = attempts.get(ip);
  const now = Date.now();
  if (rec && now - rec.first < 15 * 60 * 1000 && rec.n >= 8) return { error: "Too many attempts. Try again in 15 minutes." };

  if (!(await checkPassword(String(formData.get("password") ?? "")))) {
    attempts.set(ip, rec && now - rec.first < 15 * 60 * 1000 ? { n: rec.n + 1, first: rec.first } : { n: 1, first: now });
    return { error: "Wrong password, or admin is not configured (ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." };
  }
  attempts.delete(ip);
  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- inquiries ----------
export async function setInquiryStatus(formData: FormData) {
  await requireAdmin();
  const status = z.enum(["NEW", "CONTACTED", "INVOICED", "LOST", "CLOSED"]).parse(formData.get("status"));
  await db.inquiry.update({ where: { id: String(formData.get("id")) }, data: { status } });
  revalidatePath("/admin/inquiries");
}

/** Admin logs a lead that came in outside the website form (WhatsApp chat, phone call...). */
export async function addLead(formData: FormData) {
  await requireAdmin();
  const d = z
    .object({
      name: z.string().trim().min(2).max(120),
      contact: z.string().trim().min(3).max(120),
      country: z.string().trim().max(80).optional(),
      source: z.enum(["WHATSAPP", "PHONE", "OTHER"]),
      packageSlug: z.string().max(120).optional(),
      groupSize: z.coerce.number().int().min(1).max(50).default(1),
      message: z.string().trim().max(2000).optional(),
    })
    .parse(Object.fromEntries(formData));
  await db.inquiry.create({
    data: { ...d, country: d.country || "—", packageSlug: d.packageSlug || null, preferredDates: "—", message: d.message || null, status: "CONTACTED" },
  });
  revalidatePath("/admin", "layout");
}

// ---------- invoices ----------
const invoiceSchema = z.object({
  inquiryId: z.string().optional(),
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  customerPhone: z.string().trim().max(40).optional(),
  description: z.string().trim().min(3).max(300),
  amount: z.coerce.number().positive().max(1_000_000),
  currency: z.enum(["USD", "NPR"]),
  dueDate: z.string().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function createInvoice(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  await requireAdmin();
  const parsed = invoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  const d = parsed.data;
  const invoice = await createInvoiceWithNumber({
    inquiryId: d.inquiryId || null,
    customerName: d.customerName,
    customerEmail: d.customerEmail || null,
    customerPhone: d.customerPhone || null,
    description: d.description,
    amount: d.amount,
    currency: d.currency,
    dueDate: d.dueDate ? new Date(d.dueDate) : null,
    notes: d.notes || null,
  });
  if (d.inquiryId) await db.inquiry.update({ where: { id: d.inquiryId }, data: { status: "INVOICED" } });
  revalidatePath("/admin", "layout");
  redirect(`/admin/invoices/${invoice.id}`);
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Emails the customer their invoice + /pay link (logged), and moves DRAFT -> SENT. */
export async function sendInvoice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const inv = await db.invoice.findUnique({ where: { id } });
  if (!inv) return;
  if (inv.status === "DRAFT") await db.invoice.update({ where: { id }, data: { status: "SENT" } });
  if (inv.customerEmail) {
    await sendLoggedEmail({
      invoiceId: id,
      to: inv.customerEmail,
      subject: `Invoice ${inv.number} — Red Panda Agro Tourist`,
      body: `Hello ${inv.customerName},\n\nThank you for booking with Red Panda Agro Tourist.\n\n${inv.description}\nAmount due: ${formatMoney(toNumber(inv.amount), inv.currency)}\n\nSee payment options (bank wire or WhatsApp) and report your payment here:\n${siteUrl()}/pay/${inv.publicToken}\n\nPlease use ${inv.number} as your transfer reference.\n\nWarm regards,\nRed Panda Agro Tourist`,
    });
  }
  revalidatePath(`/admin/invoices/${id}`);
  revalidatePath("/admin", "layout");
}

export async function voidInvoice(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await db.invoice.update({ where: { id }, data: { status: "VOID" } });
  revalidatePath(`/admin/invoices/${id}`);
  revalidatePath("/admin", "layout");
}

// ---------- payments ----------
const paymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.coerce.number().positive().max(1_000_000),
  method: z.enum(["BANK_TRANSFER", "WHATSAPP", "ESEWA", "KHALTI", "CASH", "OTHER"]),
  reference: z.string().trim().max(120).optional(),
});

/** Admin records money that already arrived -> straight to CONFIRMED. */
export async function recordPayment(formData: FormData) {
  await requireAdmin();
  const d = paymentSchema.parse(Object.fromEntries(formData));
  const inv = await db.invoice.findUniqueOrThrow({ where: { id: d.invoiceId } });
  await db.payment.create({
    data: { invoiceId: d.invoiceId, amount: d.amount, currency: inv.currency, method: d.method, reference: d.reference || null, status: "CONFIRMED", confirmedAt: new Date() },
  });
  await syncInvoiceStatus(d.invoiceId);
  revalidatePath("/admin", "layout");
}

export async function reviewPayment(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const decision = z.enum(["CONFIRMED", "REJECTED"]).parse(formData.get("decision"));
  const pay = await db.payment.update({
    where: { id },
    data: { status: decision, confirmedAt: decision === "CONFIRMED" ? new Date() : null },
    include: { invoice: true },
  });
  await syncInvoiceStatus(pay.invoiceId);
  if (decision === "CONFIRMED" && pay.invoice.customerEmail) {
    await sendLoggedEmail({
      invoiceId: pay.invoiceId,
      to: pay.invoice.customerEmail,
      subject: `Payment received — ${pay.invoice.number}`,
      body: `Hello ${pay.invoice.customerName},\n\nWe've received your payment of ${formatMoney(toNumber(pay.amount), pay.currency)} for invoice ${pay.invoice.number}. Thank you!\n\nWarm regards,\nRed Panda Agro Tourist`,
    });
  }
  revalidatePath("/admin", "layout");
}

// ---------- emails ----------
/** Admin pastes in an email the customer sent (e.g. bank slip) so it's on the invoice record. */
export async function logInboundEmail(formData: FormData) {
  await requireAdmin();
  const d = z
    .object({ invoiceId: z.string().optional(), from: z.string().trim().min(3).max(200), subject: z.string().trim().min(1).max(300), body: z.string().trim().max(10000) })
    .parse(Object.fromEntries(formData));
  await db.emailLog.create({
    data: { invoiceId: d.invoiceId || null, direction: "INBOUND", toAddress: d.from, subject: d.subject, body: d.body, status: "LOGGED" },
  });
  revalidatePath("/admin/emails");
}
