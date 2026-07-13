import type { MetadataRoute } from "next";
import { packages } from "@/lib/data/packages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/packages", "/red-panda", "/about", "/gallery", "/contact", "/privacy"].map(
    (route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
    }),
  );

  const packageRoutes = packages.map((pkg) => ({
    url: `${siteUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...packageRoutes];
}
