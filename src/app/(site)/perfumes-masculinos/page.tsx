import type { Metadata } from "next";

import { GenderCollection } from "@/components/GenderCollection";
import { GENDER_PAGES } from "@/lib/gender.content";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const SLUG = "perfumes-masculinos" as const;
const content = GENDER_PAGES[SLUG];

export function generateMetadata(): Metadata {
  return {
    title: content.title,
    description: content.metaDescription,
    openGraph: {
      title: content.title,
      description: content.metaDescription,
      images: ["/og.png"],
    },
  };
}

export default function PerfumesMasculinosPage() {
  return <GenderCollection slug={SLUG} />;
}
