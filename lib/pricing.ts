import type { PackagePrice, PackageTier } from "@/lib/data/packages";
import type { VisitorOrigin } from "@/lib/origin-cookie";

/** Brief §4.2: origin selector drives which tier of packages is shown/prioritized. */
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

const CURRENCY_FORMATTERS: Record<PackagePrice["currency"], Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  NPR: new Intl.NumberFormat("en-IN", { style: "currency", currency: "NPR", maximumFractionDigits: 0 }),
};

export function formatPrice(price: PackagePrice): string {
  if (price.displayOverride) return price.displayOverride;
  if (price.amount == null || !price.confirmed) return "Price TBC — confirm with owner";
  return `${CURRENCY_FORMATTERS[price.currency].format(price.amount)} ${price.unit}`;
}
