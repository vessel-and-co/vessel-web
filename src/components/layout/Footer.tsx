import { getYear } from "date-fns";
import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "@/components/icons";
import type { Settings } from "@/lib/sanity/types";
import {
  GENERAL_WHATSAPP_MESSAGE,
  buildGeneralWhatsAppLink,
} from "@/lib/whatsapp";

const FACEBOOK_URL = "https://www.facebook.com";
const TIKTOK_URL = "https://www.tiktok.com";

type FooterProps = {
  settings: Settings | null;
};

export function Footer({ settings }: FooterProps) {
  const currentYear = getYear(new Date());
  const whatsappHref = settings
    ? buildGeneralWhatsAppLink(
        settings.whatsappNumber,
        GENERAL_WHATSAPP_MESSAGE
      )
    : null;
  const instagramHandle = settings?.instagramUrl
    ? extractInstagramHandle(settings.instagramUrl)
    : null;

  return (
    <footer className="bg-brand-green-900 px-10 py-11 text-[#b9b6a6] lg:px-24 lg:py-16">
      <div className="mx-auto max-w-[1152px]">
        <div className="font-serif text-2xl text-[#f4eedd]">Vessel</div>
        <div className="mt-7 grid grid-cols-1 gap-7 lg:mt-9 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <FooterHeading>Vessel</FooterHeading>
            <p className="max-w-[32ch] text-[13px] leading-relaxed text-[#c7c3b2]">
              Perfumería. Paraguay.
            </p>
            <div className="my-4 flex items-center gap-4 text-brand-gold">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="transition-colors hover:text-brand-gold-soft"
              >
                <Icon.facebook className="h-5 w-5" />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="transition-colors hover:text-brand-gold-soft"
              >
                <Icon.tiktok className="h-5 w-5" />
              </a>
              {settings?.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-brand-gold-soft"
                >
                  <Icon.instagram className="h-5 w-5" />
                </a>
              ) : null}
            </div>
            <FooterLink href="/politica-de-privacidad">
              Política de privacidad
            </FooterLink>
          </div>
          <div>
            <FooterHeading>Navegar</FooterHeading>
            <FooterLink href="/coleccion">La colección</FooterLink>
            <FooterLink href="/nosotros">Nosotros</FooterLink>
            <FooterLink href="/preguntas">Preguntas frecuentes</FooterLink>
          </div>
          <div>
            <FooterHeading>Escribinos</FooterHeading>
            {whatsappHref && settings ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="block py-[5px] text-[13px] text-[#c7c3b2] hover:text-[#f0ead8]"
              >
                WhatsApp {settings.whatsappNumber}
              </a>
            ) : null}
            {settings?.contactInfo ? (
              <p className="py-[5px] text-[13px] text-[#c7c3b2]">
                {settings.contactInfo}
              </p>
            ) : null}
            {settings?.instagramUrl ? (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="block py-[5px] text-[13px] text-[#c7c3b2] hover:text-[#f0ead8]"
              >
                Instagram{instagramHandle ? ` ${instagramHandle}` : ""}
              </a>
            ) : null}
          </div>
          <div>
            <FooterHeading>Ayuda</FooterHeading>
            <FooterLink href="/politica-de-envios">Envíos</FooterLink>
            <FooterLink href="/politica-de-devoluciones">
              Devoluciones
            </FooterLink>
            <FooterLink href="/garantias">Garantías</FooterLink>
          </div>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-[#8f8c7e]">
          <p>
            Vessel · Paraguay · Precios en guaraníes (Gs.), impuestos incluidos.
            © {currentYear} Vessel.
          </p>
          <p>
            Sitio hecho por{" "}
            <a
              href="https://lucasco.dev"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-[#c7c3b2]"
            >
              Kinexa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h5 className="mb-3 text-[11px] font-normal tracking-[0.14em] text-brand-gold-soft uppercase">
      {children}
    </h5>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="block py-[5px] text-[13px] text-[#c7c3b2] hover:text-[#f0ead8]"
    >
      {children}
    </Link>
  );
}

function extractInstagramHandle(url: string): string | null {
  try {
    const { pathname } = new URL(url);
    const handle = pathname.replace(/\//g, "");
    return handle.length > 0 ? handle : null;
  } catch {
    return null;
  }
}
