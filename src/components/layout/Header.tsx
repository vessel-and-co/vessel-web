import Link from "next/link";

import { Icon } from "@/components/icons";
import { MobileNavToggle } from "@/components/layout/MobileNavToggle";
import { VesselWordmark } from "@/components/logo/VesselWordmark";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/coleccion", label: "Colección" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/preguntas", label: "Preguntas" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-[1152px] items-center justify-between px-10 py-3 lg:px-24 lg:py-4">
        <Link href="/" aria-label="Vessel" className="text-brand-green">
          <VesselWordmark className="h-11 w-auto lg:h-14" />
        </Link>
        <nav className="hidden gap-[30px] text-sm text-brand-green lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="pb-0.5 hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-brand-green">
          <Link href="/coleccion" aria-label="Buscar">
            <Icon.search className="h-5 w-5" />
          </Link>
          <Link href="/coleccion" className="hidden text-sm lg:inline">
            Colección
          </Link>
          <MobileNavToggle links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
