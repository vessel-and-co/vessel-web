import Image from "next/image";
import Link from "next/link";

import { PreorderButton } from "@/components/PreorderButton";
import { ProductStatusBadge } from "@/components/ProductStatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { formatGuaranies } from "@/lib/format";
import { urlForImage } from "@/lib/sanity/image";
import type { ProductSummary } from "@/lib/sanity/types";
import { getSiteUrl } from "@/lib/site";
import {
  buildAvailableProductWhatsAppLink,
  buildSoldOutProductWhatsAppLink,
} from "@/lib/whatsapp";

const GENDER_LABELS: Record<ProductSummary["gender"], string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  unisex: "Unisex",
};

const CARD_IMAGE_WIDTH = 960;
const CARD_IMAGE_SIZES = "(min-width: 900px) 25vw, 50vw";

type ProductCardProps = {
  product: ProductSummary;
  whatsappNumber: string;
};

export function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const mainImage = product.images[0];
  const metaParts = [GENDER_LABELS[product.gender]];
  if (product.sizeMl) {
    metaParts.push(`${product.sizeMl} ml`);
  }

  const whatsappInfo = {
    name: product.name,
    brandName: product.brand.name,
    productUrl: `${getSiteUrl()}/perfumes/${product.slug.current}`,
    price: product.price,
  };

  return (
    <div className="group flex h-full flex-col rounded-md border border-line p-4">
      <Link
        href={`/perfumes/${product.slug.current}`}
        className="flex flex-1 flex-col"
      >
        <ProductStatusBadge
          available={product.available}
          usedInVideo={product.usedInVideo}
          featured={product.featured}
        />
        <div
          className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm ${
            !product.available ? "opacity-70 grayscale-[0.5]" : ""
          }`}
        >
          {mainImage ? (
            <Image
              // Solo se pide `width`: pedir width+height juntos hace que
              // el builder de Sanity recorte la imagen para forzar esa
              // relacion de aspecto, aunque el fit sea "max". Con una
              // sola dimension no recorta nada; `object-contain` la
              // encaja completa dentro de la caja 3:4.
              src={urlForImage(mainImage)
                .width(CARD_IMAGE_WIDTH)
                .fit("max")
                .url()}
              alt={product.name}
              fill
              sizes={CARD_IMAGE_SIZES}
              className="object-contain"
            />
          ) : null}
        </div>
        <p className="mt-3 text-[11px] tracking-[0.12em] text-ink-3 uppercase">
          {product.brand.name}
        </p>
        <p className="mt-[3px] line-clamp-2 font-serif text-[17px] leading-tight text-ink">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-ink-3">{metaParts.join(" · ")}</p>
        <p
          className={`mt-2 mb-4 text-[15px] font-semibold ${
            product.available ? "text-brand-green" : "text-ink-3 line-through"
          }`}
        >
          {formatGuaranies(product.price)}
        </p>
      </Link>
      {product.available ? (
        <WhatsAppButton
          href={buildAvailableProductWhatsAppLink(whatsappNumber, whatsappInfo)}
          variant="mini"
          className="mt-auto"
        >
          Consultar
        </WhatsAppButton>
      ) : (
        <PreorderButton
          href={buildSoldOutProductWhatsAppLink(whatsappNumber, whatsappInfo)}
          variant="mini"
          className="mt-auto"
        >
          Hacer pedido
        </PreorderButton>
      )}
    </div>
  );
}
