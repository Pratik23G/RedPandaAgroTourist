import type { PackagePrice, PackageTier } from "@/lib/data/packages";
import type { VisitorOrigin } from "@/lib/origin-cookie";
import { convert, formatCurrency, niceRound, type DisplayContext } from "@/lib/currency";

/** Which package tier is the "natural fit" for a visitor — used only to sort/badge, never to hide tours. */
export function originToDefaultTier(origin: VisitorOrigin): PackageTier {
  switch (origin) {
    case "nepal":
      return "LOCAL";
    case "saarc":
      return "REGIONAL";
    case "other":
      return "INTERNATIONAL";
  }
}

export interface PriceDisplay {
  /** Headline, e.g. "$22 per 6 persons" */
  main: string;
  /** Small print, e.g. "NPR 3,000 base price" — present only when converted. */
  note?: string;
}

export function formatPrice(price: PackagePrice, ctx: DisplayContext): PriceDisplay {
  if (price.displayOverride) return { main: price.displayOverride };
  if (price.amount == null || !price.confirmed) return { main: "Price TBC — confirm with owner" };

  const base = formatCurrency(price.amount, price.currency);
  if (price.currency === ctx.currency) return { main: `${base} ${price.unit}` };

  const converted = niceRound(convert(price.amount, price.currency, ctx.currency, ctx.snapshot.rates));
  return { main: `≈ ${formatCurrency(converted, ctx.currency)} ${price.unit}`, note: `${base} base price` };
}

/** Compact string for places that can't render two lines (e.g. book page subtitle). */
export function formatPriceInline(price: PackagePrice, ctx: DisplayContext): string {
  const p = formatPrice(price, ctx);
  return p.note ? `${p.main} (${p.note})` : p.main;
}
