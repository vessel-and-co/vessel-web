import {
  Mars,
  MapPin,
  Menu,
  MessageCircle,
  Play,
  Search,
  SlidersHorizontal,
  Truck,
  Undo2,
  VenusAndMars,
  Venus,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const DEFAULT_STROKE_WIDTH = 1.5;

function fromLucide(LucideComponent: LucideIcon) {
  return function WrappedIcon(props: LucideProps) {
    return <LucideComponent strokeWidth={DEFAULT_STROKE_WIDTH} {...props} />;
  };
}

function fromSvg(SvgComponent: ComponentType<SVGProps<SVGSVGElement>>) {
  return SvgComponent;
}

/**
 * Namespace unico de iconos del sitio: `Icon.search`, `Icon.venus`, etc.
 * Todos pasan por lucide-react salvo los que no existen ahi (logos de
 * marca como WhatsApp), que quedan como SVG a mano en este mismo folder.
 */
export const Icon = {
  search: fromLucide(Search),
  menu: fromLucide(Menu),
  close: fromLucide(X),
  truck: fromLucide(Truck),
  undo: fromLucide(Undo2),
  chat: fromLucide(MessageCircle),
  mapPin: fromLucide(MapPin),
  venus: fromLucide(Venus),
  mars: fromLucide(Mars),
  venusMars: fromLucide(VenusAndMars),
  play: fromLucide(Play),
  filters: fromLucide(SlidersHorizontal),
  whatsapp: fromSvg(WhatsAppIcon),
  facebook: fromSvg(FacebookIcon),
  tiktok: fromSvg(TikTokIcon),
  instagram: fromSvg(InstagramIcon),
};
