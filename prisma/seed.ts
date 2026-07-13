/**
 * Seeds the real Postgres DB from the same source data the site currently
 * renders from statically (lib/data/packages.ts, lib/data/testimonials.ts).
 * Only runs once DATABASE_URL points at a real database — not exercised in
 * this scaffolding pass. Run with `npm run db:seed` after `npm run db:migrate`.
 */
import { PrismaClient } from "@prisma/client";
import { packages } from "../lib/data/packages";
import { testimonials } from "../lib/data/testimonials";

const prisma = new PrismaClient();

async function main() {
  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: {
        slug: pkg.slug,
        tier: pkg.tier,
        name: pkg.name,
        summary: pkg.summary,
        durationLabel: pkg.durationLabel,
        priceAmount: pkg.price.amount ?? undefined,
        priceCurrency: pkg.price.currency,
        priceUnit: pkg.price.unit,
        priceConfirmed: pkg.price.confirmed,
        guaranteeNoSighting: pkg.guaranteeNoSighting,
        inclusions: pkg.inclusions,
        heroImage: pkg.heroImage,
        galleryImages: pkg.galleryImages,
        featured: pkg.featured,
        itineraryDays: {
          create: pkg.itineraryDays.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
          })),
        },
      },
    });
  }

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: {
        authorName: t.authorName,
        country: t.country,
        quote: t.quote,
        rating: t.rating,
        featured: t.featured,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
