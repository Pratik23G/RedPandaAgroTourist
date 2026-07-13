import type { Metadata } from "next";
import Image from "next/image";
import { OFFICES } from "@/components/whatsapp-cta";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Red Panda Agro Tourist Tours & Travel Pvt. Ltd — a locally-run eco- and agro-tourism operator in Tumling / Singhalila, Eastern Himalayas.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">About Red Panda Agro Tourist</h1>
      <p className="mt-3 text-forest-700/80">
        Red Panda Agro Tourist Tours &amp; Travel Pvt. Ltd runs eco-tourism and agro-tourism experiences in the
        Tumling / Singhalila region on the Nepal–India border, in the Eastern Himalayas. Our tours are built around
        red panda tracking, bird watching, cultural village visits, homestays with local farmers, cowshed camping,
        and Land Rover sightseeing — all run in partnership with the families who live in these villages.
      </p>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-cream-100">
        <Image
          src="/placeholders/gallery-village.svg"
          alt="Local village and farmland in the Tumling / Singhalila region"
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          className="object-cover"
        />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">Community-Rooted Tourism</h2>
        <p className="mt-2 text-forest-700/80">
          Homestays and agro-tourism income go directly to the local farming families who host guests. Guides are
          drawn from the same communities, bringing first-hand knowledge of red panda habitat, birding trails, and
          the region&apos;s cultural sites.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-forest-800">Our Offices</h2>
        <ul className="mt-3 space-y-2 text-forest-700/90">
          <li>
            <strong>{OFFICES.tumling.label}:</strong> +91 7063727464
          </li>
          <li>
            <strong>{OFFICES.kathmandu.label}:</strong> +977 9823808506
          </li>
        </ul>
      </section>
    </div>
  );
}
