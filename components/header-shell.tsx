"use client";

import { useEffect, useState } from "react";

/** Sticky header wrapper. Below `xl` it slides away while scrolling down and returns on scroll up, so it never covers content. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 80) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-forest-900/10 bg-cream-50/95 backdrop-blur transition-transform duration-300 motion-reduce:transition-none ${
        hidden ? "max-xl:-translate-y-full" : ""
      }`}
    >
      {children}
    </header>
  );
}
