import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ProductGallery,
  type GalleryImage,
} from "./__components/ProductGallery";
import { PreorderButton } from "@/components/PreorderButton";
import { ProductStatusBadge } from "@/components/ProductStatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Icon } from "@/components/icons";
import { formatGuaranies } from "@/lib/format";
import { urlForImage } from "@/lib/sanity/image";
import {
  getProductBySlug,
  getVisibleProductSlugs,
} from "@/lib/sanity/product.query";
import { getSettings } from "@/lib/sanity/settings.query";
import type { ProductDetail, ProductGender } from "@/lib/sanity/types";
import { getSiteUrl } from "@/lib/site";
import {
  buildAvailableProductWhatsAppLink,
  buildSoldOutProductWhatsAppLink,
} from "@/lib/whatsapp";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const GENDER_LABELS: Record<ProductGender, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  unisex: "Unisex",
};

const NOTE_LABELS = {
  topNotes: "Salida",
  heartNotes: "Corazón",
  baseNotes: "Fondo",
} as const;

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const JSON_LD_IMAGE_WIDTH = 1200;
const GALLERY_MAIN_IMAGE_WIDTH = 960;
const GALLERY_THUMBNAIL_IMAGE_WIDTH = 200;

const NOT_FOUND_METADATA: Metadata = {
  title: "Producto no encontrado",
  description: "Este perfume no está disponible en Vessel Perfumes.",
};

function buildProductDescription(product: ProductDetail): string {
  return (
    product.description ??
    `${product.name} de ${product.brand.name}. Consultá disponibilidad y precio por WhatsApp.`
  );
}

function buildProductMetaParts(product: ProductDetail): string[] {
  const metaParts = [GENDER_LABELS[product.gender]];
  if (product.sizeMl) {
    metaParts.push(`${product.sizeMl} ml`);
  }
  if (product.concentration) {
    metaParts.push(product.concentration);
  }
  return metaParts;
}

function buildGalleryImages(product: ProductDetail): GalleryImage[] {
  return product.images.map((image) => ({
    key: image._key,
    mainSrc: urlForImage(image)
      .width(GALLERY_MAIN_IMAGE_WIDTH)
      .fit("max")
      .url(),
    thumbSrc: urlForImage(image)
      .width(GALLERY_THUMBNAIL_IMAGE_WIDTH)
      .fit("max")
      .url(),
  }));
}

async function getVisibleProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const product = await getProductBySlug(slug);
  return product && product.visible ? product : null;
}

export async function generateStaticParams() {
  const slugs = await getVisibleProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ProductPageProps = PageProps<"/perfumes/[slug]">;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getVisibleProductBySlug(slug);

  if (!product) {
    return NOT_FOUND_METADATA;
  }

  const title = `${product.name} - ${product.brand.name}`;
  const description = buildProductDescription(product);
  const mainImage = product.images[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: mainImage
        ? [
            {
              url: urlForImage(mainImage)
                .width(OG_IMAGE_WIDTH)
                .height(OG_IMAGE_HEIGHT)
                .fit("crop")
                .url(),
              width: OG_IMAGE_WIDTH,
              height: OG_IMAGE_HEIGHT,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getVisibleProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const whatsappNumber = settings?.whatsappNumber ?? null;
  const productUrl = `${getSiteUrl()}/perfumes/${product.slug.current}`;
  const metaParts = buildProductMetaParts(product);
  const notes = (["topNotes", "heartNotes", "baseNotes"] as const).filter(
    (field) => product[field]
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    category: product.category.name,
    description: buildProductDescription(product),
    image: product.images.map((image) =>
      urlForImage(image).width(JSON_LD_IMAGE_WIDTH).url()
    ),
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PYG",
      price: product.price,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/BackOrder",
    },
  };

  const whatsappInfo = {
    name: product.name,
    brandName: product.brand.name,
    productUrl,
    price: product.price,
  };

  return (
    <div className="px-10 py-8 lg:px-24 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-[1152px]">
        <p className="mb-5 text-xs text-ink-3">
          <Link href="/coleccion" className="hover:text-ink-2">
            Colección
          </Link>{" "}
          / {product.name}
        </p>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
          <ProductGallery
            images={buildGalleryImages(product)}
            productName={product.name}
            badge={
              <ProductStatusBadge
                available={product.available}
                usedInVideo={product.usedInVideo}
                featured={product.featured}
              />
            }
          />

          <div className="mt-8 lg:mt-0">
            <Link
              href={`/marcas/${product.brand.slug.current}`}
              className="text-xs tracking-[0.14em] text-ink-3 uppercase hover:text-ink-2"
            >
              {product.brand.name}
            </Link>
            <h1 className="mt-1.5 font-serif text-[34px] leading-[1.05] font-normal text-brand-green lg:text-[44px]">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-ink-2">{metaParts.join(" · ")}</p>
            <p
              className={`mt-5 text-2xl font-semibold ${
                product.available
                  ? "text-brand-green"
                  : "text-[20px] text-ink-3 line-through"
              }`}
            >
              {formatGuaranies(product.price)}
            </p>

            {whatsappNumber ? (
              <div className="mt-5">
                {product.available ? (
                  <WhatsAppButton
                    href={buildAvailableProductWhatsAppLink(
                      whatsappNumber,
                      whatsappInfo
                    )}
                    className="w-full"
                  >
                    Consultar por WhatsApp
                  </WhatsAppButton>
                ) : (
                  <>
                    <PreorderButton
                      href={buildSoldOutProductWhatsAppLink(
                        whatsappNumber,
                        whatsappInfo
                      )}
                      variant="primary"
                    >
                      Hacer pedido
                    </PreorderButton>
                    <p className="mt-[10px] text-[13px] leading-relaxed text-ink-2">
                      Agotado ahora, pero lo conseguimos bajo pedido. Tocás
                      &quot;Hacer pedido&quot; y coordinamos plazo y pago por
                      WhatsApp antes de que confirmes.
                    </p>
                  </>
                )}
              </div>
            ) : null}

            {product.usedInVideo && product.videoUrl ? (
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 block overflow-hidden rounded-md border border-brand-gold"
              >
                <div className="relative flex aspect-video items-center justify-center bg-brand-green-950">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/95">
                    <Icon.play className="ml-[3px] h-[22px] w-[22px] text-brand-green-950" />
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-paper-2 px-[14px] py-3 text-[13px] text-ink-2">
                  <span className="font-semibold text-ink">
                    Este frasco salió en un video.
                  </span>
                  Es la unidad que mostramos. Mirá el reel en Instagram.
                </div>
              </a>
            ) : null}

            {product.description ? (
              <p className="mt-7 border-t border-line pt-7 text-[15px] leading-relaxed text-ink-2">
                {product.description}
              </p>
            ) : null}

            {notes.length > 0 ? (
              <>
                <h2 className="mt-7 mb-3.5 text-xs tracking-[0.14em] text-ink-3 uppercase">
                  Notas
                </h2>
                <div className="flex flex-col gap-3.5">
                  {notes.map((field) => (
                    <div key={field} className="flex items-baseline gap-3.5">
                      <span className="w-20 flex-shrink-0 font-serif text-[15px] text-brand-gold italic">
                        {NOTE_LABELS[field]}
                      </span>
                      <span className="text-sm leading-relaxed text-ink">
                        {product[field]}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <h2 className="mt-7 mb-3.5 text-xs tracking-[0.14em] text-ink-3 uppercase">
              Detalle
            </h2>
            <div className="border-t border-line">
              <SpecRow label="Marca" value={product.brand.name} />
              <SpecRow label="Género" value={GENDER_LABELS[product.gender]} />
              <SpecRow
                label="Tamaño"
                value={product.sizeMl ? `${product.sizeMl} ml` : "-"}
              />
              <SpecRow
                label="Concentración"
                value={product.concentration ?? "-"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line py-3 text-sm">
      <span className="text-ink-3">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
