import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/icons";
import { getBrandBySlug, getBrandSlugs } from "@/lib/sanity/brand.query";
import { urlForImage } from "@/lib/sanity/image";
import { getSettings } from "@/lib/sanity/settings.query";
import type { BrandDetail } from "@/lib/sanity/types";
import { getSiteUrl } from "@/lib/site";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const JSON_LD_LOGO_WIDTH = 600;
const HEADER_LOGO_WIDTH = 200;

// Largo recomendado para una meta description: Google la trunca cerca de
// los 155-160 caracteres.
const META_DESCRIPTION_MAX_LENGTH = 155;
// Por debajo de este largo, la description de la marca no alcanza para
// una meta description util: se genera una en su lugar.
const META_DESCRIPTION_MIN_LENGTH = 40;

const NOT_FOUND_METADATA: Metadata = {
  title: "Marca no encontrada",
  description: "Esta marca no está disponible en Vessel Perfumes.",
};

function truncateForMeta(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  const cutIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  return `${truncated.slice(0, cutIndex).trimEnd()}…`;
}

function buildBrandMetaDescription(brand: BrandDetail): string {
  if (
    brand.description &&
    brand.description.length >= META_DESCRIPTION_MIN_LENGTH
  ) {
    return truncateForMeta(brand.description, META_DESCRIPTION_MAX_LENGTH);
  }
  const originPart = brand.origin ? ` de ${brand.origin}` : "";
  return `Descubrí los perfumes ${brand.name}${originPart} disponibles en Paraguay. Consultá precio y disponibilidad por WhatsApp con Vessel.`;
}

export async function generateStaticParams() {
  const slugs = await getBrandSlugs();
  return slugs.map((slug) => ({ slug }));
}

type BrandPageProps = PageProps<"/marcas/[slug]">;

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return NOT_FOUND_METADATA;
  }

  const title = `Perfumes ${brand.name} en Paraguay`;
  const description = buildBrandMetaDescription(brand);
  const ogImage = brand.logo
    ? urlForImage(brand.logo)
        .width(OG_IMAGE_WIDTH)
        .height(OG_IMAGE_HEIGHT)
        .fit("crop")
        .url()
    : "/og.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const [brand, settings] = await Promise.all([
    getBrandBySlug(slug),
    getSettings(),
  ]);

  if (!brand) {
    notFound();
  }

  const whatsappNumber = settings?.whatsappNumber ?? null;
  const siteUrl = getSiteUrl();
  const brandUrl = `${siteUrl}/marcas/${brand.slug.current}`;

  const brandJsonLd = {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: brand.name,
    description: buildBrandMetaDescription(brand),
    url: brandUrl,
    logo: brand.logo
      ? urlForImage(brand.logo).width(JSON_LD_LOGO_WIDTH).url()
      : undefined,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: brand.products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/perfumes/${product.slug.current}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(brandJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {brand.products.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

      <div className="px-10 pt-11 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:pt-16">
        <p className="mb-5 text-xs text-ink-3">
          <Link href="/coleccion" className="hover:text-ink-2">
            Colección
          </Link>{" "}
          / {brand.name}
        </p>

        <div className="flex items-start gap-5">
          {brand.logo ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-line bg-white lg:h-20 lg:w-20">
              <Image
                src={urlForImage(brand.logo)
                  .width(HEADER_LOGO_WIDTH)
                  .fit("max")
                  .url()}
                alt={brand.name}
                fill
                className="object-contain p-2"
              />
            </div>
          ) : null}

          <div>
            <div className="mb-2 h-px w-11 bg-brand-gold" />
            <h1 className="font-serif text-[40px] font-normal text-brand-green lg:text-[56px]">
              {brand.name}
            </h1>
            {brand.origin ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-3">
                <Icon.mapPin className="h-4 w-4 flex-shrink-0" />
                {brand.origin}
              </p>
            ) : null}
          </div>
        </div>

        {brand.description ? (
          <p className="mt-5 max-w-[65ch] text-[15px] leading-relaxed text-ink-2">
            {brand.description}
          </p>
        ) : null}
      </div>

      <div className="border-t border-line px-10 py-6 lg:mx-auto lg:max-w-[1152px] lg:px-24 lg:py-10">
        {brand.products.length > 0 && whatsappNumber ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-[26px] lg:gap-y-8">
            {brand.products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[15px] text-ink-2">
            Todavía no tenemos perfumes de {brand.name} cargados en el catálogo.
            Escribinos por WhatsApp y te avisamos apenas sumemos alguno.
          </p>
        )}
      </div>
    </div>
  );
}
