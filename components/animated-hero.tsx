import Image from "next/image";
import Link from "next/link";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { PrayerFlags } from "@/components/prayer-flags";

export function AnimatedHero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-forest-900 text-cream-50 sm:min-h-[85vh]">
      <Image
        src="/images/tumling-road.jpg"
        alt="The winding road up to the misty hillside village at Tumling"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Bottom-left scrim only, for headline contrast — never a full-image fog. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top right, rgba(13,29,21,0.85) 0%, rgba(13,29,21,0.45) 28%, transparent 55%)",
        }}
      />

      <PrayerFlags className="absolute inset-x-0 top-16 z-10 text-cream-50" />

      <div className="relative z-10 flex min-h-[70vh] w-full items-end px-4 pb-16 pt-32 sm:min-h-[85vh] sm:px-8 lg:px-16">
        <div className="max-w-2xl">
          <span className="eyebrow text-gold-400">
            <span aria-hidden className="h-px w-6 bg-gold-400" />
            Tumling &middot; Singhalila &middot; Eastern Himalayas
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
            Track wild red pandas where the clouds live.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-cream-100/85">
            Guided tracking, bird watching, cultural village tours, and farm-family homestays — with
            Kanchenjunga and Everest views along the way.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/packages" className="btn-primary">
              View Packages
            </Link>
            <WhatsAppCta />
          </div>
        </div>
      </div>

      {/* Real sighting photo, floating card over the hero photo's right edge. */}
      <div className="animate-float absolute bottom-16 right-4 z-10 hidden w-40 rotate-2 rounded-sm border-4 border-cream-50 bg-cream-50 shadow-xl sm:block sm:right-8 lg:right-16 lg:w-48">
        <Image
          src="/images/redP.jpg"
          alt="A red panda spotted on the Singhalila ridge"
          width={400}
          height={267}
          className="h-auto w-full rounded-[1px] object-cover"
        />
      </div>

      <div className="ridge-divider absolute inset-x-0 bottom-0 z-10 text-cream-100" aria-hidden />
    </section>
  );
}
