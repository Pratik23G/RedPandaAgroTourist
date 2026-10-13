import Image from "next/image";
import Link from "next/link";
import { OriginSelector } from "@/components/origin-selector";
import { getVisitorOrigin } from "@/lib/origin-cookie";
import { CurrencySelector } from "@/components/currency-selector";
import { getSavedCurrency } from "@/lib/display-currency";
import { MobileNav } from "@/components/mobile-nav";
import { HeaderShell } from "@/components/header-shell";

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
    <HeaderShell>
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-8 xl:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-display text-base font-bold tracking-tightest text-forest-900 sm:gap-3 sm:text-lg">
          <Image src="/images/logo.png" alt="" width={56} height={56} priority className="h-10 w-10 shrink-0 sm:h-14 sm:w-14 drop-shadow-sm transition-transform duration-300 hover:rotate-6 hover:scale-105" />
          <span className="min-w-0 leading-tight">Red Panda Agro Tourist<span className="block truncate text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-rust-600 sm:text-[0.65rem] sm:tracking-[0.18em]">Tours &amp; Travel Pvt. Ltd.</span></span>
        </Link>

        {/* Desktop: full nav + selectors */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-wide xl:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link tap-target">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 xl:flex">
          <OriginSelector initialOrigin={origin} />
          <CurrencySelector key={currency} current={currency} />
        </div>

        {/* Mobile / tablet: hamburger panel */}
        <MobileNav links={NAV_LINKS}>
          <OriginSelector initialOrigin={origin} stacked />
          <CurrencySelector key={currency} current={currency} stacked />
        </MobileNav>
      </div>
    </HeaderShell>
  );
}
