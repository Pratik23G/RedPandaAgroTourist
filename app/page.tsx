import Image from "next/image";
import Link from "next/link";
import { getFeaturedPackages } from "@/lib/data/packages";
import { testimonials } from "@/lib/data/testimonials";
import { PackageCard } from "@/components/package-card";
import { WhatsAppCta } from "@/components/whatsapp-cta";

const USPS = [
  {
    title: `"No sighting, no charge"`,
    description: "Our red panda tracking guarantee: if we don't find one in 2–3 days, the package is free.",
  },
  {
    title: "All-inclusive pricing",
    description: "Flight, food, accommodation, guide, and transport — one flat rate, no surprise add-ons.",
  },
  {
    title: "Authentic farm-stay immersion",
    description: "Homestays and hands-on agriculture with local farming families, not a resort.",
  },
  {
    title: "Two Himalayan giants, one trip",
    description: "See both Kanchenjunga and Everest from Tumling Fatak in a single itinerary.",
  },
];

export default function HomePage() {
  const featured = getFeaturedPackages();

  return (
    <>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-forest-800 text-cream-50">
        <Image
          src="/placeholders/hero-home.svg"
          alt="Red panda in the Singhalila forest canopy"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="tap-target inline-flex rounded-full bg-rust-500 px-4 text-sm font-semibold">
            No sighting = no charge
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Track Wild Red Pandas in the Eastern Himalayas
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cream-100/90">
            Guided tracking, bird watching, cultural village tours, and farm-family homestays in Tumling &amp;
            Singhalila — with Kanchenjunga and Everest views along the way.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/packages"
              className="tap-target rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600"
            >
              View Packages
            </Link>
            <WhatsAppCta />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-2xl font-bold text-forest-800 sm:text-3xl">
          Why Travel With Us
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map((usp) => (
            <div key={usp.title} className="rounded-lg border border-forest-700/10 bg-cream-50 p-5">
              <h3 className="font-display text-lg text-forest-800">{usp.title}</h3>
              <p className="mt-2 text-sm text-forest-700/80">{usp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-2xl font-bold text-forest-800 sm:text-3xl">
            Featured Packages
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/packages" className="tap-target font-semibold text-rust-600 hover:text-rust-500">
              See all packages →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-display text-2xl font-bold text-forest-800 sm:text-3xl">
          What Travelers Say
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="rounded-lg border border-forest-700/10 bg-cream-50 p-6">
              <p className="text-forest-800">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-3 text-sm text-forest-700/70">
                — {t.authorName}, {t.country}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="bg-forest-700 py-16 text-center text-cream-50">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to Track a Red Panda?</h2>
          <p className="mt-3 text-cream-100/90">
            Send an inquiry and our team will confirm your dates within one business day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="tap-target rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600"
            >
              Send an Inquiry
            </Link>
            <WhatsAppCta />
          </div>
        </div>
      </section>
    </>
  );
}
