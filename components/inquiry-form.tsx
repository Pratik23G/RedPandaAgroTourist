"use client";

import { useState, type FormEvent } from "react";
import { inquirySchema } from "@/lib/inquiry-schema";
import { packages } from "@/lib/data/packages";
import { OFFICES } from "@/components/whatsapp-cta";

/**
 * v1 inquiry flow (Phase 0-2 scope): validates with the shared Zod schema,
 * then relays the inquiry as a pre-filled WhatsApp message — no DB write or
 * email yet. Phase 3 adds `/api/inquiries` (Zod + Turnstile + rate limit ->
 * Postgres + Resend) using this same form and schema; only the submit handler
 * changes.
 */
export function InquiryForm({ packageSlug }: { packageSlug?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [office, setOffice] = useState<keyof typeof OFFICES>("tumling");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      country: formData.get("country"),
      packageSlug: formData.get("packageSlug") || undefined,
      groupSize: formData.get("groupSize"),
      preferredDates: formData.get("preferredDates"),
      message: formData.get("message") || undefined,
    };

    const result = inquirySchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const pkg = packages.find((p) => p.slug === result.data.packageSlug);
    const lines = [
      `New booking inquiry${pkg ? ` — ${pkg.name}` : ""}`,
      `Name: ${result.data.name}`,
      `Contact: ${result.data.contact}`,
      `Country: ${result.data.country}`,
      `Group size: ${result.data.groupSize}`,
      `Preferred dates: ${result.data.preferredDates}`,
      result.data.message ? `Message: ${result.data.message}` : undefined,
    ].filter(Boolean);

    const phone = OFFICES[office].phone;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-forest-800">
          Full name
        </label>
        <input id="name" name="name" required maxLength={120} className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 px-3" />
        {errors.name && <p className="mt-1 text-sm text-rust-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-forest-800">
          Phone / WhatsApp or email
        </label>
        <input id="contact" name="contact" required maxLength={120} className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 px-3" />
        {errors.contact && <p className="mt-1 text-sm text-rust-600">{errors.contact}</p>}
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-forest-800">
          Country you&apos;re visiting from
        </label>
        <input id="country" name="country" required maxLength={80} className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 px-3" />
        {errors.country && <p className="mt-1 text-sm text-rust-600">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="packageSlug" className="block text-sm font-medium text-forest-800">
          Package
        </label>
        <select
          id="packageSlug"
          name="packageSlug"
          defaultValue={packageSlug ?? ""}
          className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 bg-white px-3"
        >
          <option value="">Not sure yet</option>
          {packages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="groupSize" className="block text-sm font-medium text-forest-800">
            Group size
          </label>
          <input id="groupSize" name="groupSize" type="number" min={1} max={50} defaultValue={2} required className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 px-3" />
          {errors.groupSize && <p className="mt-1 text-sm text-rust-600">{errors.groupSize}</p>}
        </div>
        <div>
          <label htmlFor="preferredDates" className="block text-sm font-medium text-forest-800">
            Preferred dates
          </label>
          <input id="preferredDates" name="preferredDates" required maxLength={120} placeholder="e.g. mid-October 2026" className="tap-target mt-1 w-full rounded-lg border border-forest-700/30 px-3" />
          {errors.preferredDates && <p className="mt-1 text-sm text-rust-600">{errors.preferredDates}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-forest-800">
          Anything else we should know?
        </label>
        <textarea id="message" name="message" maxLength={2000} rows={4} className="mt-1 w-full rounded-lg border border-forest-700/30 px-3 py-2" />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-forest-800">Send to</legend>
        <div className="mt-1 flex gap-4 text-sm">
          {(Object.keys(OFFICES) as (keyof typeof OFFICES)[]).map((key) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="radio"
                name="office"
                checked={office === key}
                onChange={() => setOffice(key)}
              />
              {OFFICES[key].label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="tap-target w-full rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600 sm:w-auto"
      >
        Send Inquiry via WhatsApp
      </button>
      <p className="text-xs text-forest-700/60">
        We&apos;ll open WhatsApp with your details pre-filled — nothing is stored on our server yet in this version.
      </p>
    </form>
  );
}
