import type { Metadata } from "next";

import {
  CollectionExplorer,
  type CollectionItem,
} from "./__components/CollectionExplorer";
import { ProductCard } from "@/components/ProductCard";
import { getCollectionProducts } from "@/lib/sanity/product.query";
import { getSettings } from "@/lib/sanity/settings.query";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const TITLE = "La colección";
const DESCRIPTION =
  "Descubrí el catálogo completo de perfumes en Paraguay: fragancias originales, árabes y de nicho. Filtrá por género, buscá por marca y consultá por WhatsApp.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: ["/og.webp"],
    },
  };
}

export default async function CollectionPage() {
  const [products, settings] = await Promise.all([
    getCollectionProducts(),
    getSettings(),
  ]);
  const whatsappNumber = settings?.whatsappNumber ?? null;

  // La tarjeta se renderiza aca, en el server: usa `urlForImage`, que carga
  // el cliente de Sanity y su token de lectura. `CollectionExplorer` es
  // client y solo recibe el resultado ya renderizado (`card`), nunca el
  // componente ni el cliente de Sanity.
  const items: CollectionItem[] = whatsappNumber
    ? products.map((product) => ({
        name: product.name,
        brandName: product.brand.name,
        brandSlug: product.brand.slug.current,
        gender: product.gender,
        price: product.price,
        featured: product.featured,
        card: (
          <ProductCard
            key={product._id}
            product={product}
            whatsappNumber={whatsappNumber}
          />
        ),
      }))
    : [];

  return (
    <div>
      <div className="px-10 pt-11 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:pt-16">
        <div className="mb-2 h-px w-11 bg-brand-gold" />
        <h1 className="mt-2 font-serif text-[40px] font-normal text-brand-green lg:text-[56px]">
          La colección
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
          Todos probados por nosotros. Los agotados quedan a la vista: si te
          interesa uno, te avisamos cuando vuelve.
        </p>
      </div>

      {whatsappNumber ? <CollectionExplorer items={items} /> : null}
    </div>
  );
}
