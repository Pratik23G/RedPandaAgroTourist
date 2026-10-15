"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReelClip {
  src: string;
  poster: string;
  caption: string;
  /** Short credit line, shown under the player. */
  credit?: string;
  /** Portrait footage is letterboxed on a blurred copy of itself instead of being cropped. */
  portrait?: boolean;
}

/** Red panda clip reel: autoplays muted when on screen, auto-advances, pick a clip from the thumbnails, tap to pause, sound toggle. */
export function PandaReel({ clips }: { clips: ReelClip[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const visible = useRef(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const clip = clips[index] ?? clips[0]!;

  // Play only while on screen; respect reduced motion.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = video.current;
        if (!entry || !v) return;
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting && !userPaused.current && !reduce) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // New clip: start it if the reel is on screen and the visitor hasn't paused.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.load();
    if (visible.current && !userPaused.current) void v.play().catch(() => {});
  }, [index]);

  const go = (step: 1 | -1) => {
    userPaused.current = false;
    setDir(step);
    setIndex((i) => (i + step + clips.length) % clips.length);
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      void v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div>
      <div
        ref={stage}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Red panda clips. Swipe or use the arrow keys to change clip."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onPointerDown={(e) => {
          if ((e.target as Element).closest("button")) return;
          drag.current = { x: e.clientX, y: e.clientY };
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d || clips.length < 2) return;
          const dx = e.clientX - d.x;
          const dy = e.clientY - d.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className="group/reel relative mx-auto aspect-[9/16] max-h-[78svh] touch-pan-y select-none overflow-hidden rounded-lg bg-forest-900 shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-rust-500 sm:aspect-video sm:max-h-none"
      >
        {/* blurred backdrop so portrait footage fills the frame without cropping the panda */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={clip.poster} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl" />
        <video
          ref={video}
          key={clip.src}
          className="reel-slide relative h-full w-full cursor-pointer object-contain"
          style={{ animationName: dir === 1 ? "reel-in-next" : "reel-in-prev" }}
          poster={clip.poster}
          muted={muted}
          loop={clips.length === 1}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => go(1)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
          }}
          onClick={() => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            toggle();
          }}
          aria-label={clip.caption}
        >
          <source src={clip.src} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-cream-50/20">
          <div ref={bar} className="h-full origin-left bg-rust-500" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="absolute right-3 top-8 z-20 flex gap-2 sm:top-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className="tap-target h-11 w-11 rounded-full bg-forest-900/70 text-cream-50 backdrop-blur transition hover:bg-rust-500 active:scale-90"
          >
            {playing ? <Pause aria-hidden className="h-5 w-5" /> : <Play aria-hidden className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="tap-target h-11 w-11 rounded-full bg-forest-900/70 text-cream-50 backdrop-blur transition hover:bg-rust-500 active:scale-90"
          >
            {muted ? <VolumeX aria-hidden className="h-5 w-5" /> : <Volume2 aria-hidden className="h-5 w-5" />}
          </button>
        </div>

        {clips.length > 1 && (
          <>
            {/* Stories-style: segment bar on top, tap left/right edge for prev/next (phones only) */}
            <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1.5 sm:hidden" aria-hidden>
              {clips.map((c, i) => (
                <span key={c.src} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= index ? "bg-cream-50" : "bg-cream-50/30")} />
              ))}
            </div>
            {([-1, 1] as const).map((step) => (
              <div
                key={`tap${step}`}
                aria-hidden
                onClick={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  go(step);
                }}
                className={cn("absolute top-14 bottom-14 z-10 w-1/4 sm:hidden", step === 1 ? "right-0" : "left-0")}
              />
            ))}
            {([-1, 1] as const).map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => go(step)}
                aria-label={step === 1 ? "Next clip" : "Previous clip"}
                className={cn(
                  "tap-target absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 rounded-full bg-forest-900/60 text-cream-50 opacity-0 backdrop-blur transition-all duration-200 hover:bg-rust-500 active:scale-90 group-hover/reel:opacity-100 group-focus-visible/reel:opacity-100 sm:flex",
                  step === 1 ? "right-3 group-hover/reel:translate-x-0 translate-x-2" : "left-3 group-hover/reel:translate-x-0 -translate-x-2",
                )}
              >
                {step === 1 ? <ChevronRight aria-hidden className="h-6 w-6" /> : <ChevronLeft aria-hidden className="h-6 w-6" />}
              </button>
            ))}
            <div className="pointer-events-none absolute bottom-10 left-0 right-0 flex justify-center gap-1.5">
              {clips.map((c, i) => (
                <span key={c.src} className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-6 bg-rust-500" : "w-1.5 bg-cream-50/70")} />
              ))}
            </div>
            <span className="pointer-events-none absolute bottom-3 right-4 text-xs font-semibold uppercase tracking-wider text-cream-50/90 [text-shadow:0_1px_4px_rgba(13,29,21,0.8)] sm:hidden">
              Tap or swipe ›
            </span>
          </>
        )}

        <p className="pointer-events-none absolute bottom-3 left-4 right-14 text-sm font-semibold text-cream-50 [text-shadow:0_1px_6px_rgba(13,29,21,0.8)]">
          {clip.caption}
        </p>
      </div>

      {clips.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Choose a clip">
          {clips.map((c, i) => (
            <button
              key={c.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Play clip ${i + 1}: ${c.caption}`}
              onClick={() => {
                userPaused.current = false;
                setDir(i >= index ? 1 : -1);
                setIndex(i);
              }}
              className={cn(
                "group relative aspect-video overflow-hidden rounded-sm border-2 bg-forest-900 transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
                i === index ? "border-rust-500" : "border-transparent opacity-80 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.poster} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-forest-900/30">
                <Play className="h-6 w-6 text-cream-50 drop-shadow" />
              </span>
            </button>
          ))}
        </div>
      )}

      {clip.credit && <p className="mt-2 text-xs text-forest-700/85">{clip.credit}</p>}
    </div>
  );
}
