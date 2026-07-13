import type { Metadata } from "next";
import Link from "next/link";
import { packages, type PackageTier } from "@/lib/data/packages";
import { PackageCard } from "@/components/package-card";
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">Tour Packages</h1>
      <p className="mt-2 max-w-2xl text-forest-700/80">
        International and Regional packages are all-inclusive flat rates (flight, food, guide, transport). Local
        packages are priced separately in Nepali Rupees and may require ID verification at booking.
      </p>

      <nav aria-label="Filter packages by tier" className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value === "ALL" ? "/packages" : `/packages?tier=${tab.value}`}
            className={cn(
              "tap-target rounded-full border px-4 text-sm font-medium",
              activeTier === tab.value
                ? "border-rust-500 bg-rust-500 text-cream-50"
                : "border-forest-700/20 text-forest-700 hover:border-rust-500",
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
  );
}
