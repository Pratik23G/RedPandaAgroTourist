"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryItem {
  src: string;
  alt: string;
}

export function LightboxGallery({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const touchStartX = useRef<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => setOpenIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  // Lock page scroll behind the viewer
  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openIndex === null]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const RATIOS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <button
            key={item.src + i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={cn(
              "group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-cream-200 p-0 text-left",
              RATIOS[i % RATIOS.length],
            )}
            aria-label={`Open photo: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full [@media(hover:none)]:translate-y-0 bg-gradient-to-t from-forest-900/90 to-transparent p-4 pt-10 text-sm font-medium text-cream-50 transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              {item.alt}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && items[openIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[openIndex].alt}
          className="fixed inset-0 z-[60] flex touch-pan-y flex-col items-center justify-center bg-forest-900/95 p-4"
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const endX = e.changedTouches[0]?.clientX;
            const dx = endX === undefined ? 0 : endX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo viewer"
            className="tap-target absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 rounded-full bg-cream-50/90 px-4 text-forest-800"
          >
            Close ✕
          </button>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === "prev" ? "Previous photo" : "Next photo"}
              onClick={(e) => {
                e.stopPropagation();
                step(dir === "next" ? 1 : -1);
              }}
              className={cn(
                "tap-target absolute top-1/2 z-10 h-12 w-12 -translate-y-1/2 rounded-full bg-cream-50/90 text-2xl text-forest-800",
                dir === "prev" ? "left-3" : "right-3",
              )}
            >
              {dir === "prev" ? "‹" : "›"}
            </button>
          ))}
          <div className="relative h-[75dvh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={items[openIndex].src} alt={items[openIndex].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="mt-3 pb-[env(safe-area-inset-bottom)] text-center text-sm text-cream-100/90">
            {openIndex + 1} / {items.length} · {items[openIndex].alt}
          </p>
        </div>
      )}
    </>
  );
}
