import { z } from "zod";

/**
 * Shared client/server validation schema for booking inquiries (brief §3, §6.2).
 * Used client-side now for the WhatsApp-relay form; reuse this same schema
 * server-side in Phase 3 when the `/api/inquiries` route + DB write lands —
 * do not fork a second schema.
 */
export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  contact: z.string().trim().min(6, "Enter a phone/WhatsApp number or email").max(120),
  country: z.string().trim().min(2, "Enter your country").max(80),
  packageSlug: z.string().max(120).optional(),
  groupSize: z.coerce.number().int().min(1, "At least 1 person").max(50),
  preferredDates: z.string().trim().min(2, "Let us know your preferred dates").max(120),
  message: z.string().trim().max(2000).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
