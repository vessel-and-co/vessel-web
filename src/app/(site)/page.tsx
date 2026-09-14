import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrandLogoBox } from "@/components/BrandLogoBox";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/icons";
import { getHomeBrands } from "@/lib/sanity/brand.query";
import { getHomeProducts } from "@/lib/sanity/product.query";
import { getSettings } from "@/lib/sanity/settings.query";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = "Vessel Perfumes | Perfumería en Paraguay";
  const description = settings?.tagline
    ? `${settings.tagline}. Perfumes originales en Paraguay: elegí acá y cerrá la compra por WhatsApp.`
    : "Perfumes originales en Paraguay: elegí acá y cerrá la compra por WhatsApp.";

  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function HomePage() {
  const [settings, products, brands] = await Promise.all([
    getSettings(),
    getHomeProducts(),
    getHomeBrands(),
  ]);
  const whatsappNumber = settings?.whatsappNumber ?? null;

  return (
    <>
      <section className="hero-surface px-10 pt-10 pb-11 lg:px-24 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-[1152px] lg:grid lg:min-h-[600px] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
          <div className="lg:py-20">
            <p className="mb-4 text-xs tracking-[0.16em] text-ink-3 uppercase">
              Perfumería de autor · Paraguay
            </p>
            <div className="mb-4 h-px w-11 bg-brand-gold" />
            <h1 className="font-serif text-[44px] font-light text-brand-green leading-[1.03] tracking-[-0.02em] lg:text-[60px]">
              Llega en una caja que <em className="font-normal">no</em> vas a
              querer tirar
            </h1>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-ink-2">
              Elegimos con criterio, probamos todo lo que traemos y lo mandamos
              como se merece: caja rígida, lazo y una nota escrita a mano.
              Elegís acá y cerramos por WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/coleccion"
                className="inline-flex items-center justify-center rounded-md bg-brand-green px-6 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-brand-green-900"
              >
                Ver la colección
              </Link>
              <Link
                href="/nosotros"
                className="inline-flex items-center justify-center rounded-md border border-line-2 px-6 py-3.5 text-[15px] font-medium text-brand-green transition-colors hover:border-brand-green"
              >
                Quiénes somos
              </Link>
            </div>
          </div>
          <div className="mt-7 flex items-center justify-center lg:mt-0">
            <div className="axis-surface aspect-[4/3] w-full max-w-md rounded-lg border border-line" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2 px-10 py-7 lg:px-24 lg:py-9">
        <div className="mx-auto grid max-w-[1152px] grid-cols-1 gap-[18px] lg:grid-cols-4 lg:gap-8">
          <TrustItem
            icon={<Icon.truck />}
            title="Envíos a todo el país"
            description="Llega en 2 a 3 días, a cualquier punto del país."
          />
          <TrustItem
            icon={<Icon.undo />}
            title="Con devolución"
            description="Si algo no está como esperabas, lo resolvemos. Tenés cambio."
          />
          <TrustItem
            icon={<Icon.chat />}
            title="Respuesta rápida"
            description="Escribís y te respondemos en el día, sin formularios."
          />
          <TrustItem
            icon={<Icon.mapPin />}
            title="Marca paraguaya"
            description="Tres socios, catálogo elegido a mano, todo probado."
          />
        </div>
      </section>

      <section className="px-10 py-[52px] lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[1152px]">
          <div className="mb-4 h-px w-11 bg-brand-gold" />
          <div className="mb-[26px] flex items-end justify-between gap-4">
            <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-brand-green lg:text-[32px]">
              La selección de la casa
            </h2>
            <Link
              href="/coleccion"
              className="border-b border-brand-gold pb-0.5 text-[13px] whitespace-nowrap text-ink-2"
            >
              Ver la colección
            </Link>
          </div>
          {products.length > 0 && whatsappNumber ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-[26px] lg:gap-y-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-ink-2">
              Muy pronto vas a encontrar acá la selección de la casa.
            </p>
          )}
        </div>
      </section>

      <section className="bg-brand-green px-10 py-13 text-[#e9e2d2] lg:px-24 lg:py-[88px]">
        <div className="mx-auto max-w-[1152px] lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <p className="mb-4 text-xs tracking-[0.16em] text-brand-gold-soft uppercase">
              El paquete
            </p>
            <div className="mb-4 h-px w-11 bg-brand-gold-soft" />
            <h2 className="font-serif text-[30px] font-light text-[#f4eedd] leading-[1.1] lg:text-[38px]">
              Abrirlo es parte del <em className="font-normal">perfume</em>
            </h2>
            <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[#c7c3b2]">
              Caja rígida, tu perfume protegido y una tarjeta de la casa. Simple
              y cuidado. Si es regalo, decinos y va sin precio.
            </p>
            <ol className="mt-6 border-t border-brand-gold/25">
              <PaqueteStep number="01">
                Caja rígida que aguanta el viaje
              </PaqueteStep>
              <PaqueteStep number="02">
                Tarjeta de la casa en cada pedido
              </PaqueteStep>
              <PaqueteStep number="03">
                Listo para regalar, sin vueltas
              </PaqueteStep>
            </ol>
          </div>
          <div className="mt-7 flex items-center justify-center lg:mt-0">
            <div className="axis-surface aspect-[4/3] w-full max-w-md rounded-lg opacity-90" />
          </div>
        </div>
      </section>

      <section className="px-10 py-11 lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[1152px]">
          <div className="mb-4 h-px w-11 bg-brand-gold" />
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-brand-green lg:text-[32px]">
              Las marcas que trabajamos
            </h2>
            <Link
              href="/marcas"
              className="border-b border-brand-gold pb-0.5 text-[13px] whitespace-nowrap text-ink-2"
            >
              Ver todas las marcas
            </Link>
          </div>
          {brands.length > 0 ? (
            <div className="mt-[26px] grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/marcas/${brand.slug.current}`}
                  className="group"
                >
                  <BrandLogoBox brand={brand} />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-10 py-11 lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[1152px]">
          <div className="mb-4 h-px w-11 bg-brand-gold" />
          <div className="mb-[26px]">
            <h2 className="font-serif text-[26px] font-normal tracking-[-0.01em] text-brand-green lg:text-[32px]">
              Encontrá el tuyo
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AxisLink
              href="/perfumes-femeninos"
              icon={<Icon.venus />}
              label="Para ella"
            />
            <AxisLink
              href="/perfumes-masculinos"
              icon={<Icon.mars />}
              label="Para él"
            />
            <AxisLink
              href="/perfumes-unisex"
              icon={<Icon.venusMars />}
              label="Unisex"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2 px-10 py-10 text-center lg:px-24 lg:py-12">
        <div className="mx-auto max-w-[560px]">
          <div className="mx-auto mb-4 h-px w-11 bg-brand-gold" />
          <h2 className="font-serif text-[22px] font-normal text-brand-green lg:text-[26px]">
            Somos tres y una <em className="font-normal">selección corta</em>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
            Arrancamos este año, entre tres socios, porque nos gustaba el
            perfume y en Paraguay no encontrábamos una tienda que eligiera de
            verdad. Elegimos de a uno: si no lo usaríamos nosotros, no entra.
          </p>
          <Link
            href="/nosotros"
            className="mt-5 inline-flex items-center justify-center rounded-md border border-line-2 px-6 py-3 text-sm font-medium text-brand-green transition-colors hover:border-brand-green"
          >
            Leer la historia
          </Link>
        </div>
      </section>
    </>
  );
}

type TrustItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function TrustItem({ icon, title, description }: TrustItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 h-[22px] w-[22px] flex-shrink-0 text-brand-gold">
        {icon}
      </span>
      <div>
        <h4 className="text-[13px] font-semibold text-ink">{title}</h4>
        <p className="mt-[3px] text-xs leading-relaxed text-ink-2">
          {description}
        </p>
      </div>
    </div>
  );
}

function PaqueteStep({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <li className="flex gap-4 border-b border-brand-gold/25 py-4 text-[15px] text-[#d8d2c1]">
      <span className="text-[13px] font-semibold text-brand-gold">
        {number}
      </span>
      {children}
    </li>
  );
}

type AxisLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
};

function AxisLink({ href, icon, label }: AxisLinkProps) {
  return (
    <Link
      href={href}
      className="axis-surface relative flex aspect-[3/4] flex-col items-center justify-center gap-5 rounded-md border border-line p-[18px] transition-colors hover:border-brand-gold"
    >
      <span className="flex flex-1 items-center justify-center text-brand-gold [&_svg]:h-11 [&_svg]:w-11 lg:[&_svg]:h-20 lg:[&_svg]:w-20">
        {icon}
      </span>
      <span className="absolute inset-x-0 bottom-[18px] text-center font-serif text-lg text-brand-green lg:text-xl">
        {label}
      </span>
    </Link>
  );
}
