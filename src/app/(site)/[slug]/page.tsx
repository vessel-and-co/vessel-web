import { toPlainText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortableTextBody } from "@/components/PortableTextBody";
import { getPageBySlug, getPageSlugs } from "@/lib/sanity/page.query";
import type { PageDetail } from "@/lib/sanity/types";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

// Sin `dynamicParams = false`: una pagina nueva cargada en el CMS despues
// del build debe funcionar sin redeploy, cayendo a render dinamico.

// Largo recomendado para una meta description: Google la trunca cerca de
// los 155-160 caracteres.
const META_DESCRIPTION_MAX_LENGTH = 155;
const GENERIC_PAGE_DESCRIPTION = "Información de Vessel Perfumes.";

const NOT_FOUND_METADATA: Metadata = {
  title: "Página no encontrada",
  description: "Esta página no está disponible en Vessel Perfumes.",
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

function buildPageMetaDescription(page: PageDetail): string {
  const plainText = toPlainText(page.body).trim();
  return plainText.length > 0
    ? truncateForMeta(plainText, META_DESCRIPTION_MAX_LENGTH)
    : GENERIC_PAGE_DESCRIPTION;
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

type InfoPageProps = PageProps<"/[slug]">;

export async function generateMetadata({
  params,
}: InfoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return NOT_FOUND_METADATA;
  }

  return {
    title: page.title,
    description: buildPageMetaDescription(page),
  };
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[760px] px-10 py-11 lg:px-16 lg:py-[72px]">
      <div className="mb-4 h-px w-11 bg-brand-gold" />
      <h1 className="font-serif text-[38px] leading-[1.05] font-normal text-brand-green lg:text-[52px]">
        {page.title}
      </h1>
      <PortableTextBody value={page.body} />
    </div>
  );
}
