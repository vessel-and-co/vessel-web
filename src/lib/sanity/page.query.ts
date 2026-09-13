import { defineQuery } from "next-sanity";

import { sanityClient } from "@/lib/sanity/client";
import type { PageDetail } from "@/lib/sanity/types";

// Slugs de todas las paginas informativas, para generateStaticParams.
export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page"].slug.current
`);

export async function getPageSlugs(): Promise<string[]> {
  return sanityClient.fetch(PAGE_SLUGS_QUERY);
}

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    body
  }
`);

export async function getPageBySlug(slug: string): Promise<PageDetail | null> {
  return sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug });
}
