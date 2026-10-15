import Link from "next/link";
import { getFeaturedPackages } from "@/lib/data/packages";
import { testimonials } from "@/lib/data/testimonials";
import { getDisplayContext } from "@/lib/display-currency";
import { PackageCard } from "@/components/package-card";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { AnimatedHero } from "@/components/animated-hero";
import { PandaParallax, HorizontalScenes } from "@/components/scroll-showcase";
import { Reveal } from "@/components/reveal";
import { PawPrint } from "@/components/paw-print";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { PandaReel, type ReelClip } from "@/components/panda-video";

const REEL_CLIPS: ReelClip[] = [
  { src: "/videos/red-panda.mp4", poster: "/videos/red-panda.jpg", caption: "Up in the branches", portrait: true },
  {
    src: "/videos/red-panda-2.mp4",
    poster: "/videos/red-panda-2.jpg",
    caption: "Settling in for a nap",
    credit: "Clip 2: Ailurus fulgens, MatthiasKabel, CC BY-SA 3.0 (Wikimedia Commons). Filmed in captivity.",
  },
  {
    src: "/videos/red-panda-3.mp4",
    poster: "/videos/red-panda-3.jpg",
    caption: "Foraging on the ground",
    credit: "Clip 3: NaIzletuSi, CC BY 3.0 (Wikimedia Commons). Filmed in captivity.",
  },
];

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

export default async function HomePage() {
  const featured = getFeaturedPackages();
  const display = await getDisplayContext();

  return (
    <>
      <AnimatedHero />

      <section className="bg-cream-100 px-4 py-10 sm:py-14">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          {/* hand-stamped look: tilted, dashed ink border, paw seal */}
          <div className="relative shrink-0 -rotate-6" aria-hidden>
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-rust-600 bg-cream-50 text-rust-600 shadow-sm sm:h-28 sm:w-28">
              <PawPrint className="h-8 w-8 animate-float sm:h-9 sm:w-9" />
              <span className="mt-1 font-display text-xs font-bold uppercase leading-tight tracking-wider">
                Our
                <br />
                promise
              </span>
            </div>
          </div>
          <div>
            <p className="font-display text-3xl font-bold leading-tight text-forest-900 sm:text-4xl">
              No red panda? <span className="text-rust-600">No charge.</span>
            </p>
            <p className="mt-2 text-base text-forest-800 sm:text-lg">
              If we can&apos;t find one for you in 2&ndash;3 days on the trail, the package is on us. That&apos;s how sure our guides are.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-rust-500" />
          Why travel with us
        </span>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {USPS.map((usp, i) => (
            <Reveal key={usp.title} delay={i * 90} className="flex gap-5 border-t border-forest-700/15 pt-5">
              <span className="font-display text-3xl text-rust-500/60" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl text-forest-900">{usp.title}</h3>
                <p className="mt-2 text-forest-700/80">{usp.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-8" aria-labelledby="video-heading">
        <Reveal>
          <span className="eyebrow">
            <span aria-hidden className="h-px w-6 bg-rust-500" />
            In the wild
          </span>
          <h2 id="video-heading" className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-4xl">
            This is what you came to see.
          </h2>
          <div className="mt-6">
            <PandaReel clips={REEL_CLIPS} />
          </div>
        </Reveal>
      </section>

      <PandaParallax />

      <HorizontalScenes />

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
              <PackageCard key={pkg.slug} pkg={pkg} display={display} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <span className="eyebrow">
          <span aria-hidden className="h-px w-6 bg-rust-500" />
          What guests say
        </span>
        <div className="mt-8">
          <TestimonialCarousel items={testimonials} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-rust-600 py-20 text-center text-cream-50">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to track a red panda?</h2>
          <p className="mt-3 text-cream-50/90">
            Send an inquiry and our team will confirm your dates within one business day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" data-wa-label="home-cta">
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
