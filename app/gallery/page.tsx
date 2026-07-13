import type { Metadata } from "next";
import { packages } from "@/lib/data/packages";
import { LightboxGallery } from "@/components/lightbox-gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from red panda tracking, bird watching, cultural village tours, and homestays in Tumling / Singhalila.",
};

export default function GalleryPage() {
  const seen = new Set<string>();
  const items = packages
    .flatMap((pkg) => [pkg.heroImage, ...pkg.galleryImages].map((src) => ({ src, alt: pkg.name })))
    .filter((item) => (seen.has(item.src) ? false : (seen.add(item.src), true)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">Gallery</h1>
      <p className="mt-2 max-w-2xl text-forest-700/80">
        Placeholder photography — real photos from the owner will replace these before launch.
      </p>
      <div className="mt-8">
        <LightboxGallery items={items} />
      </div>
    </div>
  );
}
