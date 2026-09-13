import { defineQuery } from "next-sanity";

import { sanityClient } from "@/lib/sanity/client";
import type {
  ProductDetail,
  ProductGender,
  ProductSummary,
} from "@/lib/sanity/types";

const HOME_SELECTION_LIMIT = 4;

// El catalogo tiene un maximo de 40 productos: se cargan todos de una,
// sin paginacion. Este limite es un resguardo, no una paginacion real.
const COLLECTION_PRODUCTS_LIMIT = 40;

// Trae productos visibles, priorizando los destacados; si no hay destacados
// (o no alcanzan), completa con la seleccion mas reciente. Nunca trae
// productos con visible !== true.
export const HOME_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && visible == true]
  | order(featured desc, _createdAt desc)
  [0...${HOME_SELECTION_LIMIT}]{
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
`);

export async function getHomeProducts(): Promise<ProductSummary[]> {
  return sanityClient.fetch(HOME_PRODUCTS_QUERY);
}

// Todos los productos visibles para la pagina de coleccion. El filtro, el
// buscador y el orden son solo cliente: esta query no recibe parametros y
// siempre trae el mismo set (agotados incluidos, invisibles nunca).
export const COLLECTION_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && visible == true]
  | order(featured desc, _createdAt desc)
  [0...${COLLECTION_PRODUCTS_LIMIT}]{
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
`);

export async function getCollectionProducts(): Promise<ProductSummary[]> {
  return sanityClient.fetch(COLLECTION_PRODUCTS_QUERY);
}

// Productos visibles de un genero, para las paginas SEO de genero
// (/perfumes-masculinos, /perfumes-femeninos, /perfumes-unisex). Nunca trae
// productos con visible !== true.
export const PRODUCTS_BY_GENDER_QUERY = defineQuery(`
  *[_type == "product" && visible == true && gender == $gender]
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
`);

export async function getProductsByGender(
  gender: ProductGender
): Promise<ProductSummary[]> {
  return sanityClient.fetch(PRODUCTS_BY_GENDER_QUERY, { gender });
}

// Slugs de todos los productos visibles, para generateStaticParams. Un
// producto con visible !== true nunca debe tener pagina estatica generada.
export const VISIBLE_PRODUCT_SLUGS_QUERY = defineQuery(`
  *[_type == "product" && visible == true].slug.current
`);

export async function getVisibleProductSlugs(): Promise<string[]> {
  return sanityClient.fetch(VISIBLE_PRODUCT_SLUGS_QUERY);
}

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    price,
    available,
    visible,
    featured,
    usedInVideo,
    videoUrl,
    gender,
    sizeMl,
    concentration,
    description,
    topNotes,
    heartNotes,
    baseNotes,
    "brand": brand->{ name, slug },
    "category": category->{ name, slug },
    images
  }
`);

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  return sanityClient.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
}
