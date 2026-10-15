"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Decorative muted loop. Stays hidden (photo underneath shows) for reduced-motion, data-saver and failed loads.
 * `sceneStarts` are the playback times (seconds) at which each scene's crossfade begins; the current scene index is
 * written to data-scene on the nearest ancestor with a data-scene attribute so text colours can follow the footage.
 */
export function AmbientVideo({ src, className, sceneStarts }: { src: string; className?: string; sceneStarts?: number[] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;
    el.src = src;
    void el.play().catch(() => {});
    const onVis = () => (document.hidden ? el.pause() : void el.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);

    const host = el.closest<HTMLElement>("[data-scene]");
    let raf = 0;
    let scene = 0;
    const tick = () => {
      if (host && sceneStarts && !el.paused) {
        let s = 0;
        for (let i = 0; i < sceneStarts.length; i++) if (el.currentTime >= sceneStarts[i]!) s = i;
        if (s !== scene) {
          scene = s;
          host.dataset.scene = String(s);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
      if (host) host.dataset.scene = "0";
    };
  }, [src, sceneStarts]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      className={`${className ?? ""} pointer-events-none transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
