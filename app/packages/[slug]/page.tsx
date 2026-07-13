import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageBySlug, packages } from "@/lib/data/packages";
import { formatPrice } from "@/lib/pricing";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { PrayerFlags } from "@/components/prayer-flags";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.name,
    description: pkg.summary,
    openGraph: { title: pkg.name, description: pkg.summary, images: [pkg.heroImage] },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.summary,
    touristType: pkg.tier === "LOCAL" ? "Domestic" : "International",
    itinerary: pkg.itineraryDays.map((d) => ({
      "@type": "TouristAttraction",
      name: `Day ${d.dayNumber}: ${d.title}`,
      description: d.description,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-forest-900 text-cream-50">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <Image src={pkg.heroImage} alt={pkg.name} fill sizes="100vw" className="object-cover opacity-70" priority />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/30 to-forest-900/10" />
          <PrayerFlags className="absolute inset-x-0 top-4 text-cream-50" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <Link href="/packages" className="text-sm text-cream-100/80 hover:text-gold-400">
                ← All packages
              </Link>
              {pkg.guaranteeNoSighting && (
                <span className="mt-3 inline-flex bg-rust-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream-50">
                  No sighting = no charge
                </span>
              )}
              <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{pkg.name}</h1>
              <p className="mt-2 max-w-2xl text-cream-100/85">{pkg.summary}</p>
            </div>
          </div>
        </div>
        <div className="ridge-divider text-cream-100" aria-hidden />
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-6 border-y border-forest-700/15 py-5">
          <div>
            <div className="eyebrow">Duration</div>
            <div className="mt-1 font-display text-lg text-forest-900">{pkg.durationLabel}</div>
          </div>
          <div>
            <div className="eyebrow">Price</div>
            <div className="mt-1 font-display text-lg text-rust-600">{formatPrice(pkg.price)}</div>
          </div>
          <Link href={`/book/${pkg.slug}`} className="btn-primary ml-auto">
            Book Inquiry
          </Link>
        </div>

        <section className="mt-10">
          <span className="eyebrow">
            <span aria-hidden className="h-px w-6 bg-rust-500" />
            What&apos;s included
          </span>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {pkg.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-forest-700/90">
                <span aria-hidden className="mt-1 text-rust-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <span className="eyebrow">
            <span aria-hidden className="h-px w-6 bg-rust-500" />
            Day-by-day itinerary
          </span>
          <div className="mt-6">
            <ItineraryTimeline days={pkg.itineraryDays} />
          </div>
        </section>

        {pkg.galleryImages.length > 0 && (
          <section className="mt-10">
            <span className="eyebrow">
              <span aria-hidden className="h-px w-6 bg-rust-500" />
              Gallery
            </span>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pkg.galleryImages.map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden bg-cream-100">
                  <Image src={src} alt={`${pkg.name} gallery photo`} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 bg-forest-900 p-6 text-cream-50">
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold">Ready to book?</h2>
            <p className="mt-1 text-cream-100/90">Send an inquiry or message us directly on WhatsApp.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/book/${pkg.slug}`} className="btn-primary">
              Book Inquiry
            </Link>
            <WhatsAppCta message={`Hi! I'm interested in the ${pkg.name} package.`} />
          </div>
        </div>
      </div>
    </div>
  );
}
