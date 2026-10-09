import type { Metadata } from "next";
import Link from "next/link";
import { packages } from "@/lib/data/packages";
import { PackageCard } from "@/components/package-card";
import { PrayerFlags } from "@/components/prayer-flags";
import { getVisitorOrigin } from "@/lib/origin-cookie";
import { originToDefaultTier } from "@/lib/pricing";
import { getDisplayContext } from "@/lib/display-currency";
import { CURRENCY_LABELS } from "@/lib/currency";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tour Packages",
  description:
    "Browse red panda tracking and agro-tourism packages: International and Regional all-inclusive expeditions, plus local Nepal packages for camping, homestays, and sightseeing.",
};

type Tab = "ALL" | "EXPEDITIONS" | "TOURS";
const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "All Packages" },
  { value: "EXPEDITIONS", label: "All-inclusive expeditions" },
  { value: "TOURS", label: "Day tours, stays & camping" },
];

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const origin = await getVisitorOrigin();
  const display = await getDisplayContext();
  const view = (TABS.find((t) => t.value === params.view?.toUpperCase())?.value ?? "ALL") as Tab;
  const fit = originToDefaultTier(origin);

  // Everyone sees every package. The tier that suits the visitor's origin just floats to the top.
  const filtered = packages.filter((p) =>
    view === "ALL" ? true : view === "EXPEDITIONS" ? p.tier !== "LOCAL" : p.tier === "LOCAL",
  );
  const visible = [...filtered].sort((a, b) => Number(b.tier === fit) - Number(a.tier === fit));
  const { snapshot } = display;

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
            Every tour is open to every visitor. Expeditions are all-inclusive flat rates (flight, food, guide, transport);
            day tours, stays and camping are priced in Nepali Rupees. Prices show in your chosen currency at today&apos;s exchange rate.
          </p>
        </div>
        <div className="ridge-divider absolute inset-x-0 bottom-0 text-cream-100" aria-hidden />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <nav aria-label="Filter packages" className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Link
              key={tab.value}
              href={tab.value === "ALL" ? "/packages" : `/packages?view=${tab.value}`}
              className={cn(
                "tap-target rounded-sm border px-4 text-sm font-semibold transition-colors",
                view === tab.value
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
            <PackageCard key={pkg.slug} pkg={pkg} display={display} recommended={pkg.tier === fit} />
          ))}
        </div>

        <p className="mt-8 text-xs text-forest-700/60">
          Showing {CURRENCY_LABELS[display.currency]}.{" "}
          {snapshot.live
            ? `Converted at live rates${snapshot.updatedAt ? ` (updated ${new Date(snapshot.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})` : ""}`
            : "Live rates are unavailable right now, so these are approximate"}
          . Final amounts are confirmed in your invoice.
        </p>
      </div>
    </div>
  );
}
