import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppCta } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "The Red Panda Experience",
  description:
    "How our guided red panda tracking works in Singhalila, Eastern Himalayas — best seasons, the tracking process, and the birds you'll see along the way.",
};

export default function RedPandaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">The Red Panda Experience</h1>
      <p className="mt-3 text-forest-700/80">
        Red pandas are shy, elusive, and spend most of their time in dense forest canopy — which is exactly why we
        back every local tracking package with a simple promise: if our guides don&apos;t find one within your
        tracking window, you don&apos;t pay.
      </p>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-cream-100">
        <Image
          src="/placeholders/gallery-red-panda-1.svg"
          alt="Red panda in Singhalila forest habitat"
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          className="object-cover"
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">How Tracking Works</h2>
        <p className="mt-2 text-forest-700/80">
          Local guides who know the Singhalila habitat lead small groups on foot and by Land Rover to areas with
          recent red panda activity, tracking signs, feeding trees, and known territory. Bird watching happens
          alongside — the same quiet, patient approach spots dozens of Himalayan species in a single day.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">Best Seasons</h2>
        <p className="mt-2 text-forest-700/80">
          Exact seasonal sighting data should come from the owner/local guides before launch — this section is a
          placeholder pending that input rather than a guess presented as fact.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">Bird Watching</h2>
        <p className="mt-2 text-forest-700/80">
          A full species checklist for the Singhalila region should be supplied by the owner or a local naturalist
          before launch, so visitors get an accurate list rather than an invented one.
        </p>
      </section>

      <div className="mt-10 flex justify-center">
        <WhatsAppCta message="Hi! I'd like to know more about red panda tracking seasons.">
          Ask About Tracking Seasons
        </WhatsAppCta>
      </div>
    </div>
  );
}
