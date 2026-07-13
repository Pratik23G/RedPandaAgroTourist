import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiry-form";
import { OFFICES } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Red Panda Agro Tourist by phone, WhatsApp, or inquiry form — Tumling and Kathmandu offices.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">Contact Us</h1>
      <p className="mt-2 text-forest-700/80">
        Send an inquiry below, or reach us directly — we typically reply within one business day.
      </p>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold text-forest-800">Offices</h2>
          <dl className="mt-3 space-y-3 text-forest-700/90">
            <div>
              <dt className="font-semibold text-forest-800">{OFFICES.tumling.label}</dt>
              <dd>+91 7063727464</dd>
            </div>
            <div>
              <dt className="font-semibold text-forest-800">{OFFICES.kathmandu.label}</dt>
              <dd>+977 9823808506</dd>
            </div>
          </dl>

          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg bg-cream-100">
            <iframe
              title="Map of Tumling"
              src="https://www.google.com/maps?q=Tumling,Nepal&output=embed"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-forest-800">Send an Inquiry</h2>
          <div className="mt-3">
            <InquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
