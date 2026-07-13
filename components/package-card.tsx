import Image from "next/image";
import Link from "next/link";
import type { PackageData } from "@/lib/data/packages";
import { formatPrice } from "@/lib/pricing";
import { PawPrint } from "@/components/paw-print";

export function PackageCard({ pkg }: { pkg: PackageData }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-cream-50 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] w-full bg-cream-100">
        <Image
          src={pkg.heroImage}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <PawPrint className="animate-float pointer-events-none absolute bottom-3 right-3 h-7 w-7 text-cream-50/0 transition-colors duration-300 group-hover:text-cream-50/80" />
        {pkg.guaranteeNoSighting && (
          <span className="absolute left-0 top-3 bg-rust-500 py-1 pl-3 pr-4 text-xs font-semibold uppercase tracking-wide text-cream-50">
            No sighting = no charge
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t-2 border-forest-900 p-5">
        <h3 className="font-display text-lg text-forest-900">{pkg.name}</h3>
        <p className="line-clamp-2 text-sm text-forest-700/80">{pkg.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm text-forest-700/70">{pkg.durationLabel}</span>
          <span className="font-display text-lg font-semibold text-rust-600">{formatPrice(pkg.price)}</span>
        </div>
      </div>
    </Link>
  );
}
