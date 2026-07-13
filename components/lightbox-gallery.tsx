"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface GalleryItem {
  src: string;
  alt: string;
}

export function LightboxGallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, items.length, close]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <button
            key={item.src + i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="tap-target relative aspect-square overflow-hidden rounded-lg bg-cream-100 p-0"
            aria-label={`Open photo: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && items[openIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-800/90 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className="tap-target absolute right-4 top-4 rounded-full bg-cream-50/90 px-4 text-forest-800"
          >
            Close ✕
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={items[openIndex].src}
              alt={items[openIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
