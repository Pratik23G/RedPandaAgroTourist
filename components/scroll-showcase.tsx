"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { photos, type PhotoKey } from "@/lib/data/photos";
import { cn } from "@/lib/utils";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Runs `fn` on every animation frame in which the page scrolled or resized. Mutates the DOM directly (no React renders). */
function useScrollFrame(fn: () => void) {
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fn);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [fn]);
}

/** Drifts its children vertically at `speed` x scroll distance from viewport centre. Negative = rises faster. */
function Drift({ speed, className, style, children }: { speed: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.parentElement!.getBoundingClientRect();
    const offset = r.top + r.height / 2 - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${(offset * speed).toFixed(1)}px, 0)`;
  });
  return (
    <div ref={ref} className={cn("will-change-transform", className)} style={style}>
      {children}
    </div>
  );
}

function Photo({ k, sizes, className, priority }: { k: PhotoKey; sizes: string; className?: string; priority?: boolean }) {
  return <Image src={photos[k].src} alt={photos[k].alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />;
}

/* ------------------------------------------------------------------ */
/* 1. Red panda parallax: big portrait that scrolls slower than its frame, with photos floating at different depths. */
/* ------------------------------------------------------------------ */

const FLOATERS: { k: PhotoKey; pos: string; rot: string; speed: number; size: string; label: string }[] = [
  { k: "red-panda-cub", pos: "left-[2%] top-[6%] sm:left-[6%]", rot: "-rotate-3", speed: -0.12, size: "w-32 sm:w-44 lg:w-56", label: "Cubs learn to climb by spring" },
  { k: "kanchenjunga-tumling", pos: "right-[2%] top-[2%] sm:right-[5%]", rot: "rotate-2", speed: -0.2, size: "w-36 sm:w-52 lg:w-64", label: "Kanchenjunga from Tumling" },
  { k: "rhododendron", pos: "left-[4%] bottom-[2%] sm:left-[9%]", rot: "rotate-2", speed: 0.05, size: "w-32 sm:w-44 lg:w-52", label: "Rhododendron forest" },
  { k: "owl", pos: "right-[3%] bottom-[0%] sm:right-[8%]", rot: "-rotate-2", speed: 0.07, size: "w-28 sm:w-40 lg:w-48", label: "Himalayan wood owl" },
];

export function PandaParallax() {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    const f = frame.current;
    const i = inner.current;
    if (!f || !i) return;
    const r = f.getBoundingClientRect();
    const t = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight; // -1..1
    i.style.transform = `translate3d(0, ${(t * -12).toFixed(2)}%, 0) scale(1.18)`;
  });

  return (
    <section className="relative overflow-hidden bg-forest-900 py-24 text-cream-50 sm:py-32" aria-labelledby="panda-heading">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-8">
        {/* Stage: portrait + floating photos live here so they can never drift into the text block below. */}
        <div className="relative flex w-full justify-center pb-24 pt-8 sm:pb-32">
        {/* floating photo cards */}
        {FLOATERS.map((f) => (
          <Drift key={f.k} speed={f.speed} className={cn("absolute z-20", f.pos)}>
            <figure
              className={cn(
                "group transition-transform duration-500 hover:z-30 hover:-translate-y-2 hover:rotate-0 hover:scale-105",
                f.rot,
                f.size,
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border-[5px] border-cream-50 bg-cream-50 shadow-2xl">
                <Photo k={f.k} sizes="(min-width: 1024px) 256px, 176px" />
              </div>
              <figcaption className="mt-2 hidden text-center text-xs text-cream-100/70 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                {f.label}
              </figcaption>
            </figure>
          </Drift>
        ))}

        {/* centre portrait */}
        <div ref={frame} className="relative z-10 aspect-[3/4] w-[58%] max-w-sm overflow-hidden rounded-t-full border border-cream-100/20 shadow-2xl sm:w-[40%]">
          <div ref={inner} className="absolute inset-0 will-change-transform">
            <Photo k="red-panda-langtang" sizes="(min-width: 640px) 400px, 60vw" />
          </div>
        </div>
        </div>

        <div className="relative z-30 mt-4 max-w-xl text-center">
          <span className="eyebrow text-gold-400">
            <span aria-hidden className="h-px w-6 bg-gold-400" />
            Meet the locals
          </span>
          <h2 id="panda-heading" className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            The red panda hides in plain sight.
          </h2>
          <p className="mt-4 text-cream-100/80">
            Our local guides know the Singhalila habitat — where the bamboo is thick, the moss is deep, and the clouds roll in at dawn.
          </p>
          <Link href="/red-panda" className="btn-primary mt-7">
            Learn about the red panda
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Pinned horizontal scenes: vertical scroll pulls a film-strip of photos sideways; photos counter-drift inside frames. */
/* ------------------------------------------------------------------ */

const SCENES: { k: PhotoKey; title: string; note: string }[] = [
  { k: "kanchenjunga-tumling", title: "Tumling Fatak", note: "Kanchenjunga and Everest, side by side." },
  { k: "red-panda-tree", title: "In the canopy", note: "Wild red pandas, tracked by local guides." },
  { k: "landrover-singalila", title: "Land Rover ridge road", note: "The classic way up through Singalila." },
  { k: "rhododendron", title: "Rhododendron forest", note: "Colour spilling down the hillside." },
  { k: "ilam-tea", title: "Ilam tea estates", note: "A slow morning among the clouds." },
  { k: "village-terraces", title: "Farm-family villages", note: "Stay, eat and work alongside your hosts." },
];

/** Phones: a swipeable card stack (drag a card away, Tinder/Stories style) instead of the scroll-pinned film strip. */
function SceneSwipeDeck() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, active: false });
  const [exit, setExit] = useState<0 | 1 | -1>(0);
  const startX = useRef<number | null>(null);
  const n = SCENES.length;

  const commit = (dir: 1 | -1) => {
    setExit(dir);
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % n);
      setExit(0);
      setDrag({ x: 0, active: false });
    }, 260);
  };

  const cards = [0, 1, 2].map((o) => ({ o, scene: SCENES[(index + o) % n]!, i: (index + o) % n }));

  return (
    <section className="bg-cream-100 px-4 py-14 md:hidden" aria-labelledby="scenes-heading-m">
      <span className="eyebrow">
        <span aria-hidden className="h-px w-6 bg-rust-500" />
        Scenes from the trail
      </span>
      <h2 id="scenes-heading-m" className="mt-2 font-display text-3xl font-bold text-forest-900">
        Swipe through the ridge.
      </h2>

      <div className="relative mx-auto mt-8 aspect-[4/5] w-full max-w-sm select-none">
        {[...cards].reverse().map(({ o, scene, i }) => {
          const top = o === 0;
          const x = top ? (exit ? exit * 520 : drag.x) : 0;
          const rot = top ? x / 18 : 0;
          return (
            <figure
              key={scene.k}
              onPointerDown={(e) => {
                if (!top || exit) return;
                startX.current = e.clientX;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                setDrag({ x: 0, active: true });
              }}
              onPointerMove={(e) => {
                if (!top || startX.current === null) return;
                setDrag({ x: e.clientX - startX.current, active: true });
              }}
              onPointerUp={() => {
                if (!top || startX.current === null) return;
                startX.current = null;
                if (Math.abs(drag.x) > 80) commit(drag.x > 0 ? 1 : -1);
                else setDrag({ x: 0, active: false });
              }}
              onPointerCancel={() => {
                startX.current = null;
                setDrag({ x: 0, active: false });
              }}
              className={cn(
                "absolute inset-0 touch-pan-y overflow-hidden rounded-lg border-[6px] border-cream-50 bg-forest-800 shadow-xl",
                top && !drag.active && "transition-transform duration-300 ease-out",
                !top && "transition-transform duration-300 ease-out",
              )}
              style={{
                transform: top
                  ? `translateX(${x}px) rotate(${rot}deg)`
                  : `translateY(${o * 14}px) scale(${1 - o * 0.05})`,
                opacity: exit && top ? 0 : 1,
                zIndex: 10 - o,
                transitionProperty: "transform, opacity",
              }}
            >
              <Photo k={scene.k} sizes="90vw" priority={top} />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                <span className="font-display text-sm text-gold-400">
                  {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
                <p className="font-display text-2xl leading-tight">{scene.title}</p>
                <p className="mt-1 text-sm text-cream-100/90">{scene.note}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => commit(-1)}
          aria-label="Skip to the next scene (swipe left)"
          className="tap-target h-12 w-12 rounded-full border border-forest-700/30 text-xl text-forest-800 active:scale-90"
        >
          ←
        </button>
        <span className="text-sm text-forest-700/85">Drag the card or tap an arrow</span>
        <button
          type="button"
          onClick={() => commit(1)}
          aria-label="Next scene (swipe right)"
          className="tap-target h-12 w-12 rounded-full bg-rust-500 text-xl text-cream-50 active:scale-90"
        >
          →
        </button>
      </div>
      <Link href="/gallery" className="tap-target mt-4 font-display text-xl text-rust-600">
        See the full gallery →
      </Link>
    </section>
  );
}

function SceneStrip() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame(() => {
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;
    const r = o.getBoundingClientRect();
    const scrollable = o.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / scrollable));
    const dist = Math.max(0, t.scrollWidth - window.innerWidth);
    t.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
    imgs.current.forEach((el) => {
      if (!el) return;
      const c = el.parentElement!.getBoundingClientRect();
      const d = (c.left + c.width / 2 - window.innerWidth / 2) / window.innerWidth; // -1..1ish
      el.style.transform = `translate3d(${(d * -9).toFixed(2)}%,0,0) scale(1.25)`;
    });
  });

  return (
    // Tall wrapper = scroll distance; the inner pane stays pinned while we translate the strip.
    <section ref={outer} className="relative hidden h-[320vh] bg-cream-100 motion-reduce:h-auto md:block" aria-labelledby="scenes-heading">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-20 motion-reduce:static motion-reduce:h-auto motion-reduce:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <span className="eyebrow">
            <span aria-hidden className="h-px w-6 bg-rust-500" />
            Scenes from the trail
          </span>
          <h2 id="scenes-heading" className="mt-2 font-display text-3xl font-bold text-forest-900 sm:text-5xl">
            Keep scrolling. The ridge keeps going.
          </h2>
        </div>

        <div ref={track} className="mt-6 flex w-max gap-5 px-4 will-change-transform sm:mt-8 sm:gap-8 sm:px-8 motion-reduce:w-full motion-reduce:flex-wrap">
          {SCENES.map((s, i) => (
            <figure
              key={s.k}
              className={cn(
                "group relative w-[78vw] shrink-0 sm:w-[44vw] lg:w-[32vw]",
                i % 2 ? "sm:translate-y-8" : "sm:-translate-y-2",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-forest-800 shadow-xl sm:aspect-[5/6] max-h-[52vh] w-full">
                <div ref={(el) => { imgs.current[i] = el; }} className="absolute inset-0 will-change-transform">
                  <Photo k={s.k} sizes="(min-width: 1024px) 32vw, 78vw" className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream-50">
                  <span className="font-display text-sm text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display text-2xl leading-tight">{s.title}</p>
                  <p className="mt-1 text-sm text-cream-100/80 transition-all duration-300 sm:max-h-0 sm:overflow-hidden sm:opacity-0 sm:group-hover:max-h-20 sm:group-hover:opacity-100">
                    {s.note}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
          <div className="flex w-[60vw] shrink-0 items-center sm:w-[28vw]">
            <Link href="/gallery" className="font-display text-2xl text-rust-600 hover:underline">
              See the full gallery →
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 h-0.5 w-full max-w-6xl px-4 sm:px-8 motion-reduce:hidden" aria-hidden>
          <div className="h-full bg-forest-900/15">
            <div ref={bar} className="h-full origin-left bg-rust-500" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Big screens keep the scroll-pinned film strip; phones get the swipeable deck. */
export function HorizontalScenes() {
  return (
    <>
      <SceneSwipeDeck />
      <SceneStrip />
    </>
  );
}
