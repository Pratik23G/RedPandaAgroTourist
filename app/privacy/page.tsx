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
        Plain-language summary. Have a lawyer review it before launch.
      </p>

      <section className="mt-8 space-y-4 text-forest-700/90">
        <p>
          <strong>Inquiries and bookings.</strong> When you send an inquiry we store your name, phone/WhatsApp or email,
          country, preferred dates, group size and message, so our team can reply and prepare your invoice. If you book, we
          also keep your invoice and payment records (amount, method, transfer reference). We never ask for card numbers or
          passport details on this site. Planned retention for inquiries that don&apos;t become bookings: 12 months.
        </p>
        <p>
          <strong>Anonymous analytics.</strong> We use a first-party cookie holding a random ID to count visits and clicks
          on our WhatsApp buttons, so we can see which pages help travellers reach us. It contains no name, email or IP
          address and is not shared with advertisers. If your browser sends &quot;Do Not Track&quot;, we don&apos;t record anything.
        </p>
        <p>
          <strong>Your choices.</strong> Ask us to see or delete your inquiry data any time by contacting us.
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
