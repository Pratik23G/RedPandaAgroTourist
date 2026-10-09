import type { Metadata } from "next";
import { photos } from "@/lib/data/photos";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from red panda tracking, bird watching, cultural village tours, and homestays in Tumling / Singhalila.",
};

// Lead with the red pandas, then the landscape, then people & places.
const ORDER = [
  "owner-red-panda", "red-panda-langtang", "kanchenjunga-tumling", "red-panda-cub", "landrover-singalila", "ilam-tea",
  "red-panda-portrait", "rhododendron", "owner-prayer-flags", "red-panda-tree", "kala-pokhri", "village-terraces",
  "tumling-trail", "owl", "owner-lake", "camping", "singalila-forest", "everest", "village-life", "landrover-singalila-2",
  "sandakphu-village", "swayambhu", "ilam-hills", "kanchenjunga-sandakphu", "owner-road",
] as const satisfies readonly (keyof typeof photos)[];

export default function GalleryPage() {
  const items = ORDER.map((k) => photos[k]);
  const credited = Object.values(photos).filter((p) => "credit" in p);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
      <Reveal>
        <span className="eyebrow"><span aria-hidden className="h-px w-6 bg-rust-500" />Gallery</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-forest-800 sm:text-5xl">Faces, ridges &amp; cloud forests</h1>
        <p className="mt-3 max-w-2xl text-forest-700/80">
          Red pandas, Kanchenjunga, old Land Rovers and farm-family villages from Tumling, Singalila and Ilam. Tap any photo to enlarge.
        </p>
      </Reveal>
      <div className="mt-10">
        <LightboxGallery items={items.map((p) => ({ src: p.src, alt: p.alt }))} />
      </div>

      <details className="mt-12 text-sm text-forest-700/70">
        <summary className="cursor-pointer font-semibold text-forest-800">Photo credits</summary>
        <ul className="mt-3 space-y-1">
          {credited.map((p) => (
            <li key={p.src}>
              {p.alt} — {p.credit!.author}, <a href={p.credit!.url} target="_blank" rel="noopener noreferrer" className="underline">{p.credit!.license}</a>, via Wikimedia Commons
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
