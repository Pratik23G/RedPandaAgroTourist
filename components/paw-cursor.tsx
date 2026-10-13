"use client";

import { useEffect, useRef, useState } from "react";
import { PawPrint } from "@/components/paw-print";

const INTERACTIVE =
  'a, button, summary, label, [role="button"], input[type="radio"], input[type="checkbox"], input[type="submit"]';
const NATIVE = 'input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]), textarea, select';

interface Stamp {
  id: number;
  x: number;
  y: number;
  r: number;
}

/** Red-panda paw: follows the mouse (or the finger on touch screens), grows over clickable things, squishes on press and leaves a fading paw print on click/tap. */
export function PawCursor() {
  const paw = useRef<HTMLDivElement>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);

  useEffect(() => {
    const el = paw.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let nextId = 0;
    let state: "idle" | "link" | "hidden" = "hidden";
    let pressed = false;
    let x = -100;
    let y = -100;
    let raf = 0;

    const render = () => {
      raf = 0;
      const scale = (state === "link" ? 1.3 : 1) * (pressed ? 0.8 : 1);
      const rot = state === "link" ? -25 : -12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity = state === "hidden" ? "0" : "1";
      el.style.color = state === "link" ? "#C85A1E" : "#1F3A2C";
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") {
        state = "hidden";
        schedule();
        return;
      }
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      state = t?.closest?.(NATIVE) ? "hidden" : t?.closest?.(INTERACTIVE) ? "link" : "idle";
      schedule();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") return;
      pressed = true;
      const id = nextId++;
      const stamp = { id, x: e.clientX, y: e.clientY, r: Math.round(Math.random() * 50 - 25) };
      setStamps((st) => [...st.slice(-5), stamp]);
      setTimeout(() => setStamps((st) => st.filter((p) => p.id !== id)), 700);
      schedule();
    };
    const onUp = () => {
      pressed = false;
      schedule();
    };
    const onLeave = () => {
      state = "hidden";
      schedule();
    };

    // Touch: paw appears under the finger, follows it while dragging/scrolling, stamps on tap, fades on release.
    const touchPoint = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (!t) return;
      x = t.clientX;
      y = t.clientY;
      const target = document.elementFromPoint(x, y);
      state = target?.closest?.(NATIVE) ? "hidden" : target?.closest?.(INTERACTIVE) ? "link" : "idle";
    };
    const onTouchStart = (e: TouchEvent) => {
      touchPoint(e);
      pressed = true;
      const id = nextId++;
      const stamp = { id, x, y, r: Math.round(Math.random() * 50 - 25) };
      setStamps((st) => [...st.slice(-5), stamp]);
      setTimeout(() => setStamps((st) => st.filter((p) => p.id !== id)), 700);
      schedule();
    };
    const onTouchMove = (e: TouchEvent) => {
      touchPoint(e);
      schedule();
    };
    const onTouchEnd = () => {
      pressed = false;
      state = "hidden";
      schedule();
    };

    let mode: "off" | "mouse" | "touch" = "off";
    const disable = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      document.documentElement.classList.remove("paw-cursor");
      mode = "off";
      state = "hidden";
      setStamps([]);
      render();
    };
    const enable = (next: "mouse" | "touch") => {
      if (mode === next) return;
      disable();
      mode = next;
      if (next === "mouse") {
        document.documentElement.classList.add("paw-cursor");
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
      } else {
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      }
    };
    // Re-evaluate whenever the device class changes (e.g. DevTools device toolbar, tablet docking).
    const sync = () => (reduce.matches ? disable() : enable(fine.matches ? "mouse" : "touch"));

    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      disable();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <div
        ref={paw}
        className="absolute left-0 top-0 opacity-0 transition-[opacity,color] duration-150 will-change-transform"
        style={{ filter: "drop-shadow(0 0 1.5px #FBF8F1) drop-shadow(0 1px 2px rgba(0,0,0,.35))" }}
      >
        <PawPrint className="h-8 w-8" />
      </div>
      {stamps.map((s) => (
        <PawPrint
          key={s.id}
          className="absolute h-8 w-8 text-rust-500"
          style={{ left: s.x, top: s.y, ["--r" as string]: `${s.r}deg`, animation: "paw-stamp 0.7s ease-out forwards" } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
