import Image from "next/image";

import { urlForImage } from "@/lib/sanity/image";
import type { BrandSummary } from "@/lib/sanity/types";

const LOGO_IMAGE_WIDTH = 240;

type BrandLogoBoxProps = {
  brand: Pick<BrandSummary, "name" | "logo">;
  className?: string;
};

// Recuadro neutro (mismo fondo y tamano para todas las marcas) para
// mostrar los logos como conjunto ordenado, aunque vengan en colores y
// formatos dispares. Si la marca no tiene logo cargado, cae al nombre en
// Fraunces en vez de dejar un hueco.
export function BrandLogoBox({ brand, className = "" }: BrandLogoBoxProps) {
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-md border border-line bg-white p-4 transition-colors group-hover:border-brand-gold ${className}`}
    >
      {brand.logo ? (
        <div className="relative h-full w-full">
          <Image
            src={urlForImage(brand.logo)
              .width(LOGO_IMAGE_WIDTH)
              .fit("max")
              .url()}
            alt={brand.name}
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-center font-serif text-base text-brand-green">
          {brand.name}
        </span>
      )}
    </div>
  );
}
