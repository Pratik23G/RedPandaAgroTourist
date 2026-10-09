"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SKIP = /^\/(admin|pay|api)(\/|$)/;

function visitorId(): string | null {
  try {
    const m = /(?:^|; )rp_vid=([^;]+)/.exec(document.cookie);
    if (m?.[1]) return m[1];
    const id = crypto.randomUUID();
    document.cookie = `rp_vid=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    return id;
  } catch {
    return null;
  }
}

function send(type: "PAGE_VIEW" | "WHATSAPP_CLICK", path: string, label?: string) {
  if (navigator.doNotTrack === "1") return;
  const id = visitorId();
  if (!id) return;
  const origin = /(?:^|; )visitor-origin=(nepal|saarc|other)/.exec(document.cookie)?.[1];
  const body = JSON.stringify({ visitorId: id, type, path, label, origin });
  if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
    void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }
}

/** Anonymous first-party analytics: page views + clicks on any wa.me link. Label via data-wa-label on the link or an ancestor. */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SKIP.test(pathname)) send("PAGE_VIEW", pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='wa.me']");
      if (!a) return;
      const label = a.closest("[data-wa-label]")?.getAttribute("data-wa-label") ?? "page";
      send("WHATSAPP_CLICK", location.pathname, label);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
