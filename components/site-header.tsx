import Link from "next/link";
import { OriginSelector } from "@/components/origin-selector";
import { getVisitorOrigin } from "@/lib/origin-cookie";

const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/red-panda", label: "The Red Panda" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const origin = await getVisitorOrigin();

  return (
    <header className="sticky top-0 z-40 border-b border-forest-700/10 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-display text-lg font-bold text-forest-800">
          Red Panda Agro Tourist
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="tap-target text-forest-700 hover:text-rust-600">
              {link.label}
            </Link>
          ))}
        </nav>
        <OriginSelector initialOrigin={origin} />
      </div>
    </header>
  );
}
