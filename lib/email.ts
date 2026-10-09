import { db } from "@/lib/db";

interface SendArgs {
  to: string;
  subject: string;
  body: string;
  invoiceId?: string;
}

/**
 * Sends via Resend's REST API when RESEND_API_KEY is set, and ALWAYS writes an EmailLog row
 * (SENT / FAILED / SKIPPED) so the admin page is the record of every payment email.
 * With no key configured the row is SKIPPED and the body is kept so it can be sent by hand.
 */
export async function sendLoggedEmail({ to, subject, body, invoiceId }: SendArgs) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  let status: "SENT" | "FAILED" | "SKIPPED" = "SKIPPED";
  let error: string | undefined;

  if (key && from) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, text: body }),
      });
      if (res.ok) status = "SENT";
      else {
        status = "FAILED";
        error = `Resend ${res.status}: ${(await res.text()).slice(0, 300)}`;
      }
    } catch (e) {
      status = "FAILED";
      error = e instanceof Error ? e.message : "Network error";
    }
  } else {
    error = "RESEND_API_KEY / RESEND_FROM_EMAIL not set — email not sent";
  }

  await db.emailLog.create({
    data: { invoiceId, direction: "OUTBOUND", toAddress: to, subject, body, status, error },
  });
  return { status, error };
}
