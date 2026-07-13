import type { Metadata } from "next";
import Link from "next/link";
import { packages, type PackageTier } from "@/lib/data/packages";
import { PackageCard } from "@/components/package-card";
import { PrayerFlags } from "@/components/prayer-flags";
import { getVisitorOrigin } from "@/lib/origin-cookie";
import { originToDefaultTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Browse red panda tracking and agro-tourism packages: International and Regional all-inclusive expeditions, plus local Nepal packages for camping, homestays, and sightseeing.",
};

const TABS: { value: PackageTier | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Packages" },
  { value: "INTERNATIONAL", label: "International" },
  { value: "REGIONAL", label: "Regional (India / Bangladesh / Pakistan)" },
  { value: "LOCAL", label: "Local (Nepal)" },
];

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  const origin = await getVisitorOrigin();
  const requestedTier = params.tier?.toUpperCase();
  const activeTier: PackageTier | "ALL" =
    requestedTier === "INTERNATIONAL" || requestedTier === "REGIONAL" || requestedTier === "LOCAL"
      ? requestedTier
      : requestedTier === "ALL"
        ? "ALL"
        : originToDefaultTier(origin);

  const visible = activeTier === "ALL" ? packages : packages.filter((p) => p.tier === activeTier);

  return (
    <div>
      <section className="relative overflow-hidden bg-forest-900 pb-12 pt-10 text-cream-50">
        <PrayerFlags className="text-cream-50" />
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-8">
          <span className="eyebrow text-gold-400">
            <span aria-hidden className="h-px w-6 bg-gold-400" />
            Every trip, one page
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Tour Packages</h1>
          <p className="mt-3 max-w-2xl text-cream-100/85">
            International and Regional packages are all-inclusive flat rates (flight, food, guide, transport).
            Local packages are priced separately in Nepali Rupees and may require ID verification at booking.
          </p>
        </div>
        <div className="ridge-divider absolute inset-x-0 bottom-0 text-cream-100" aria-hidden />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <nav aria-label="Filter packages by tier" className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "ALL" ? "/packages" : `/packages?tier=${tab.value}`}
              className={cn(
                "tap-target rounded-sm border px-4 text-sm font-semibold transition-colors",
                activeTier === tab.value
                  ? "border-rust-500 bg-rust-500 text-cream-50"
                  : "border-forest-700/20 text-forest-700 hover:border-rust-500 hover:text-rust-600",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
}
