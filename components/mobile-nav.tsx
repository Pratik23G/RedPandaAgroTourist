"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  links: { href: string; label: string }[];
  children?: React.ReactNode;
}

/** Hamburger + slide-down panel for screens below `lg`. Selectors are passed in as children. */
export function MobileNav({ links, children }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll while open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="tap-target h-11 w-11 rounded-lg border border-forest-700/30 text-forest-800 transition-all duration-200 hover:border-rust-500 hover:bg-rust-500/10 hover:text-rust-600 active:scale-90"
      >
        {open ? <X aria-hidden className="h-6 w-6" /> : <Menu aria-hidden className="h-6 w-6" />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="menu-panel absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-forest-900/10 bg-cream-50 px-4 pb-6 pt-2 shadow-lg"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ animationDelay: `${i * 50}ms` }}
                className="mobile-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-4">{children}</div>
        </div>
      )}
    </div>
  );
}
