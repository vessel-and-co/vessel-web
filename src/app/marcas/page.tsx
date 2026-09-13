import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogoBox } from "@/components/BrandLogoBox";
import { getAllBrands } from "@/lib/sanity/brand.query";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const TITLE = "Marcas de perfumes en Paraguay";
const DESCRIPTION =
  "Todas las marcas de perfumes que trabajamos en Vessel: fragancias originales, árabes y de nicho en Paraguay. Elegí una marca y consultá por WhatsApp.";

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

export default async function BrandsIndexPage() {
  const brands = await getAllBrands();

  return (
    <div>
      <div className="px-10 pt-11 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:pt-16">
        <div className="mb-2 h-px w-11 bg-brand-gold" />
        <h1 className="mt-2 font-serif text-[40px] font-normal text-brand-green lg:text-[56px]">
          Marcas
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
          Todas las marcas que trabajamos en Vessel, en un solo lugar.
        </p>
      </div>

      <div className="border-t border-line px-10 py-8 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:py-12">
        {brands.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-8">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/marcas/${brand.slug.current}`}
                className="group flex flex-col items-center text-center"
              >
                <BrandLogoBox brand={brand} className="w-full" />
                <p className="mt-3 font-serif text-lg text-brand-green">
                  {brand.name}
                </p>
                {brand.description ? (
                  <p className="mt-1 line-clamp-2 text-xs text-ink-3">
                    {brand.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-ink-2">
            Todavía no tenemos marcas cargadas en el catálogo.
          </p>
        )}
      </div>
    </div>
  );
}
