import type { AnchorHTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/icons";

type WhatsAppButtonVariant = "primary" | "mini";

type WhatsAppButtonProps = {
  href: string;
  children: ReactNode;
  variant?: WhatsAppButtonVariant;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

const VARIANT_CLASSES: Record<WhatsAppButtonVariant, string> = {
  primary: "bg-wa px-6 py-4 text-base text-white hover:bg-wa-hover",
  mini: "w-full border border-wa px-[11px] py-[11px] text-sm text-wa hover:bg-wa hover:text-white",
};

export function WhatsAppButton({
  href,
  children,
  variant = "primary",
  className,
  ...anchorProps
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
      {...anchorProps}
    >
      <Icon.whatsapp className="h-[18px] w-[18px]" />
      {children}
    </a>
  );
}
