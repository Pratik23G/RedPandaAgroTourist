import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Red Panda Agro Tourist collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">Privacy Policy</h1>
      <p className="mt-2 text-sm text-forest-700/60">
        Draft placeholder — full legal copy is written and reviewed in Phase 4 before launch.
      </p>

      <section className="mt-8 space-y-4 text-forest-700/90">
        <p>
          In this current version of the site, our booking inquiry form does not yet submit data to our server —
          it opens a pre-filled WhatsApp message instead, so no personal data is stored by us through the form.
          Once the inquiry backend goes live, this page will be updated to describe exactly what we collect
          (name, email, phone, country, travel dates, group size, message), why, how long we retain it (planned:
          12 months), and how to request deletion.
        </p>
        <p>
          If you have questions about your data now, contact us directly using the phone numbers on our{" "}
          <a href="/contact" className="text-rust-600 underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </div>
  );
}
