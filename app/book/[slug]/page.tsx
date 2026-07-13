import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackageBySlug, packages } from "@/lib/data/packages";
import { formatPrice } from "@/lib/pricing";
import { InquiryForm } from "@/components/inquiry-form";

export function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return {};
  return { title: `Book: ${pkg.name}` };
}

export default async function BookPackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-800">Book: {pkg.name}</h1>
      <p className="mt-2 text-forest-700/80">
        {pkg.durationLabel} · {formatPrice(pkg.price)}
      </p>
      <div className="mt-8">
        <InquiryForm packageSlug={pkg.slug} />
      </div>
    </div>
  );
}
