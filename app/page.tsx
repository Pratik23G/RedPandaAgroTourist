import Image from "next/image";
import Link from "next/link";
import { getFeaturedPackages } from "@/lib/data/packages";
import { testimonials } from "@/lib/data/testimonials";
import { PackageCard } from "@/components/package-card";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { AnimatedHero } from "@/components/animated-hero";

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
      <AnimatedHero />

      <section className="bg-cream-100 py-6 text-center">
        <span className="tap-target inline-flex rounded-sm border border-rust-500 bg-rust-500/10 px-4 text-sm font-semibold text-rust-600">
          No red panda sighted in 2–3 days? The package is free.
        </span>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-rust-500" />
          Why travel with us
        </span>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {USPS.map((usp, i) => (
            <div key={usp.title} className="flex gap-5 border-t border-forest-700/15 pt-5">
              <span className="font-display text-3xl text-cream-200/80" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl text-forest-900">{usp.title}</h3>
                <p className="mt-2 text-forest-700/80">{usp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-8">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-rust-500" />
          Scenes from the trail
        </span>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/lakeylakes.jpeg"
              alt="Alpine lake along the Singhalila ridge trail"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
            <Image
              src="/images/prayerFlag.jpeg"
              alt="Prayer flags strung at a Himalayan viewpoint"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-forest-900 py-20 text-cream-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-gold-400">
                <span aria-hidden className="h-px w-6 bg-gold-400" />
                Featured packages
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Choose your trip</h2>
            </div>
            <Link href="/packages" className="tap-target font-semibold text-gold-400 hover:text-gold-500">
              See all packages →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-rust-500" />
          What travelers say
        </span>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="border-l-2 border-rust-500 py-1 pl-6">
              <p className="font-display text-xl leading-snug text-forest-900">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-3 text-sm text-forest-700/70">
                — {t.authorName}, {t.country}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-rust-600 py-20 text-center text-cream-50">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to track a red panda?</h2>
          <p className="mt-3 text-cream-50/90">
            Send an inquiry and our team will confirm your dates within one business day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary bg-forest-900 hover:bg-forest-800">
              Send an Inquiry
            </Link>
            <WhatsAppCta />
          </div>
        </div>
      </section>
    </>
  );
}
