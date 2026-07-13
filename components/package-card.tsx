import Image from "next/image";
import Link from "next/link";
import type { PackageData } from "@/lib/data/packages";
import { formatPrice } from "@/lib/pricing";

export function PackageCard({ pkg }: { pkg: PackageData }) {
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-forest-700/10 bg-cream-50 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-cream-100">
        <Image
          src={pkg.heroImage}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        {pkg.guaranteeNoSighting && (
          <span className="absolute left-2 top-2 rounded-full bg-rust-500 px-3 py-1 text-xs font-semibold text-cream-50">
            No sighting = no charge
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg text-forest-800">{pkg.name}</h3>
        <p className="line-clamp-2 text-sm text-forest-700/80">{pkg.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm text-forest-700/70">{pkg.durationLabel}</span>
          <span className="font-semibold text-rust-600">{formatPrice(pkg.price)}</span>
        </div>
      </div>
    </Link>
  );
}
