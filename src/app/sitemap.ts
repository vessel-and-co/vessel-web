import type { MetadataRoute } from "next";

import { getBrandSlugs } from "@/lib/sanity/brand.query";
import { getPageSlugs } from "@/lib/sanity/page.query";
import { getVisibleProductSlugs } from "@/lib/sanity/product.query";
import { getSiteUrl, isStagingSite } from "@/lib/site";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const STATIC_ROUTES = [
  "/",
  "/coleccion",
  "/marcas",
  "/perfumes-masculinos",
  "/perfumes-femeninos",
  "/perfumes-unisex",
  "/preguntas",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Staging (test.vessel.com.py) nunca debe indexarse: un sitemap vacio se
  // suma al disallow de robots.ts como segunda barrera.
  if (isStagingSite()) {
    return [];
  }

  const siteUrl = getSiteUrl();

  const [productSlugs, brandSlugs, pageSlugs] = await Promise.all([
    getVisibleProductSlugs(),
    getBrandSlugs(),
    getPageSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${siteUrl}/perfumes/${slug}`,
  }));

  const brandEntries: MetadataRoute.Sitemap = brandSlugs.map((slug) => ({
    url: `${siteUrl}/marcas/${slug}`,
  }));

  const pageEntries: MetadataRoute.Sitemap = pageSlugs.map((slug) => ({
    url: `${siteUrl}/${slug}`,
  }));

  return [...staticEntries, ...brandEntries, ...productEntries, ...pageEntries];
}
