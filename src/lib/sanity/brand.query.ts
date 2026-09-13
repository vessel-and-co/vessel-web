import { defineQuery } from "next-sanity";

import { sanityClient } from "@/lib/sanity/client";
import type { BrandDetail, BrandSummary } from "@/lib/sanity/types";

// Slugs de todas las marcas, para generateStaticParams. No hay campo
// `visible` en marca: si existe, tiene pagina.
export const BRAND_SLUGS_QUERY = defineQuery(`
  *[_type == "brand"].slug.current
`);

export async function getBrandSlugs(): Promise<string[]> {
  return sanityClient.fetch(BRAND_SLUGS_QUERY);
}

// Todas las marcas, para la pagina indice /marcas. No hay campo `visible`
// en marca: si existe, se muestra.
export const ALL_BRANDS_QUERY = defineQuery(`
  *[_type == "brand"] | order(name asc){
    _id,
    name,
    slug,
    description,
    logo
  }
`);

export async function getAllBrands(): Promise<BrandSummary[]> {
  return sanityClient.fetch(ALL_BRANDS_QUERY);
}

const HOME_BRANDS_LIMIT = 6;

// Seleccion acotada de marcas para la home: no es un indice, es una
// muestra. La pagina /marcas es la que lista todas.
export const HOME_BRANDS_QUERY = defineQuery(`
  *[_type == "brand"] | order(name asc)[0...${HOME_BRANDS_LIMIT}]{
    _id,
    name,
    slug,
    description,
    logo
  }
`);

export async function getHomeBrands(): Promise<BrandSummary[]> {
  return sanityClient.fetch(HOME_BRANDS_QUERY);
}

// Trae la marca y, embebidos, sus productos visibles (agotados incluidos,
// invisibles nunca). Una sola query evita un segundo roundtrip a Sanity.
export const BRAND_BY_SLUG_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    description,
    origin,
    logo,
    "products": *[_type == "product" && visible == true && references(^._id)]
      | order(featured desc, _createdAt desc){
        _id,
        name,
        slug,
        price,
        available,
        featured,
        usedInVideo,
        gender,
        sizeMl,
        concentration,
        "brand": brand->{ name, slug },
        images
      }
  }
`);

export async function getBrandBySlug(
  slug: string
): Promise<BrandDetail | null> {
  return sanityClient.fetch(BRAND_BY_SLUG_QUERY, { slug });
}
