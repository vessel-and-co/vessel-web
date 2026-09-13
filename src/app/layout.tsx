import type { Metadata } from "next";

import { fraunces, vastagoGrotesk } from "@/app/fonts";
import "@/app/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppStickyBar } from "@/components/layout/WhatsAppStickyBar";
import { getSettings } from "@/lib/sanity/settings.query";
import { getSiteUrl } from "@/lib/site";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const description =
  "Perfumes en Paraguay elegidos con criterio. Fragancias originales, arabes y de nicho: consulta y compra por WhatsApp con envios a todo el pais.";

const siteUrl = new URL(getSiteUrl());

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Vessel Perfumes | Perfumería en Paraguay",
    template: "%s | Vessel Perfumes",
  },
  description,
  openGraph: {
    title: "Vessel Perfumes",
    description,
    url: siteUrl,
    type: "website",
    locale: "es_PY",
    images: ["/og.webp"],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html
      lang="es"
      className={`${vastagoGrotesk.variable} ${fraunces.variable}`}
    >
      <body className="bg-brand-green-950 text-ink antialiased">
        {/* Topa el ancho solo en monitores ultra anchos (>1920px) y centra.
        Los elementos `fixed` (barra de WhatsApp, drawers) topan y centran
        su propio ancho con este mismo `max-w-[1920px] mx-auto`, NO con un
        `transform` en este contenedor: un transform (incluso `scale-100`)
        convierte a este div en el containing block de sus descendientes
        `fixed`, atandolos a la altura de TODA la pagina en vez de al
        viewport, y los deja invisibles fuera de pantalla al hacer scroll.
        El fondo de cada seccion sigue yendo de punta a punta; el aire a
        los costados del contenido vive en el padding de cada seccion, no
        en un marco de otro color. */}
        <div className="relative mx-auto max-w-[1920px] bg-paper">
          <Header />
          <div className="pb-[76px] lg:pb-0">
            {children}
            <Footer settings={settings} />
          </div>
          <WhatsAppStickyBar settings={settings} />
        </div>
      </body>
    </html>
  );
}
