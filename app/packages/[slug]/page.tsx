import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageBySlug, packages } from "@/lib/data/packages";
import { formatPrice } from "@/lib/pricing";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import { WhatsAppCta } from "@/components/whatsapp-cta";

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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/packages" className="text-sm text-forest-700/70 hover:text-rust-600">
        ← All packages
      </Link>

      <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-cream-100">
        <Image src={pkg.heroImage} alt={pkg.name} fill sizes="(max-width: 900px) 100vw, 900px" className="object-cover" priority />
        {pkg.guaranteeNoSighting && (
          <span className="absolute left-3 top-3 rounded-full bg-rust-500 px-3 py-1 text-xs font-semibold text-cream-50">
            No sighting = no charge
          </span>
        )}
      </div>

      <h1 className="mt-6 font-display text-3xl font-bold text-forest-800">{pkg.name}</h1>
      <p className="mt-2 text-forest-700/80">{pkg.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-forest-700/10 bg-cream-50 p-4">
        <div>
          <div className="text-sm text-forest-700/70">Duration</div>
          <div className="font-semibold text-forest-800">{pkg.durationLabel}</div>
        </div>
        <div>
          <div className="text-sm text-forest-700/70">Price</div>
          <div className="font-semibold text-rust-600">{formatPrice(pkg.price)}</div>
        </div>
        <Link
          href={`/book/${pkg.slug}`}
          className="tap-target ml-auto rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600"
        >
          Book Inquiry
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">What&apos;s Included</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {pkg.inclusions.map((item) => (
            <li key={item} className="flex items-start gap-2 text-forest-700/90">
              <span aria-hidden className="mt-1 text-rust-500">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">Day-by-Day Itinerary</h2>
        <div className="mt-4">
          <ItineraryTimeline days={pkg.itineraryDays} />
        </div>
      </section>

      {pkg.galleryImages.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-forest-800">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pkg.galleryImages.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-cream-100">
                <Image src={src} alt={`${pkg.name} gallery photo`} fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-4 rounded-lg bg-forest-700 p-6 text-cream-50">
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold">Ready to book?</h2>
          <p className="mt-1 text-cream-100/90">Send an inquiry or message us directly on WhatsApp.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/book/${pkg.slug}`}
            className="tap-target rounded-lg bg-rust-500 px-6 font-semibold text-cream-50 hover:bg-rust-600"
          >
            Book Inquiry
          </Link>
          <WhatsAppCta message={`Hi! I'm interested in the ${pkg.name} package.`} />
        </div>
      </div>
    </div>
  );
}
