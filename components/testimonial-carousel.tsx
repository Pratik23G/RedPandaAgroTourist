"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { TestimonialData } from "@/lib/data/testimonials";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { cn } from "@/lib/utils";

/** Snap-scrolling review carousel. Works with one review (renders as a single feature card) and grows as reviews are added. */
export function TestimonialCarousel({ items }: { items: TestimonialData[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = items.length + 1; // last slide invites a new review

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild?.getBoundingClientRect().width ?? 1;
      setActive(Math.round(el.scrollLeft / (w + 16)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    const child = el?.children[Math.max(0, Math.min(slides - 1, i))] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
        aria-label="Guest reviews"
      >
        {items.map((t, i) => (
          <figure
            key={i}
            className="relative w-[88%] shrink-0 snap-center overflow-hidden rounded-lg bg-forest-900 p-7 text-cream-50 shadow-xl sm:w-full sm:p-10"
          >
            <span aria-hidden className="pointer-events-none absolute -right-2 -top-8 font-display text-[10rem] leading-none text-rust-500/25 sm:text-[13rem]">
              &rdquo;
            </span>

            <div className="relative">
              <div className="flex items-center gap-1 text-gold-400" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} aria-hidden className={cn("h-5 w-5", s < t.rating ? "fill-current" : "opacity-30")} />
                ))}
              </div>

              <blockquote className="mt-5 font-display text-xl leading-snug sm:text-3xl sm:leading-snug">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rust-500 font-display text-xl font-bold"
                >
                  {t.authorName.trim().charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="block font-semibold">{t.authorName}</span>
                  <span className="block text-sm text-cream-100/80">
                    {t.country}
                    {t.trip ? ` · ${t.trip}` : ""}
                  </span>
                </span>
              </figcaption>

              {t.sample && (
                <p className="mt-5 inline-block rounded-sm border border-dashed border-gold-400/70 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400">
                  Example review &middot; real guest stories coming soon
                </p>
              )}
            </div>
          </figure>
        ))}

        {/* Final slide: invite the next review */}
        <div className="flex w-[88%] shrink-0 snap-center flex-col justify-center rounded-lg border-2 border-dashed border-rust-500/60 bg-cream-50 p-7 sm:w-full sm:p-10">
          <p className="font-display text-2xl font-bold leading-tight text-forest-900 sm:text-3xl">
            Been on a trail with us?
          </p>
          <p className="mt-2 max-w-md text-forest-800">
            Tell us how it went. A line or two about your guide, the homestay, or the moment you spotted your panda is all it takes.
          </p>
          <div className="mt-5" data-wa-label="review-invite">
            <WhatsAppCta message="Hi! I travelled with Red Panda Agro Tourist and would like to share a review.">
              Share your story on WhatsApp
            </WhatsAppCta>
          </div>
        </div>
      </div>

      {slides > 1 && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: slides }).map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                onClick={() => goTo(i)}
                className={cn("h-2 rounded-full transition-all duration-300", i === active ? "w-8 bg-rust-500" : "w-2 bg-forest-700/30")}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous review"
              className="tap-target h-11 w-11 rounded-full border border-forest-700/30 text-forest-800 transition hover:border-rust-500 hover:text-rust-600 active:scale-90"
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next review"
              className="tap-target h-11 w-11 rounded-full border border-forest-700/30 text-forest-800 transition hover:border-rust-500 hover:text-rust-600 active:scale-90"
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
