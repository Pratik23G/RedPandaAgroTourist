import Image from "next/image";
import Link from "next/link";
import { OriginSelector } from "@/components/origin-selector";
import { getVisitorOrigin } from "@/lib/origin-cookie";
import { CurrencySelector } from "@/components/currency-selector";
import { getSavedCurrency } from "@/lib/display-currency";

const NAV_LINKS = [
  { href: "/packages", label: "Packages" },
  { href: "/red-panda", label: "The Red Panda" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const origin = await getVisitorOrigin();
  const currency = (await getSavedCurrency()) ?? (origin === "nepal" ? "NPR" : "USD");

  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold tracking-tightest text-forest-900">
          <Image src="/images/logo.png" alt="" width={56} height={56} priority className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow-sm transition-transform duration-300 hover:rotate-6 hover:scale-105" />
          <span className="leading-tight">Red Panda Agro Tourist<span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-rust-600">Tours &amp; Travel Pvt. Ltd.</span></span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="tap-target text-forest-700 hover:text-rust-600">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-4">
          <OriginSelector initialOrigin={origin} />
          <CurrencySelector key={currency} current={currency} />
        </div>
      </div>
    </header>
  );
}
