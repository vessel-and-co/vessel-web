import type { AnchorHTMLAttributes, ReactNode } from "react";

type PreorderButtonVariant = "primary" | "mini";

type PreorderButtonProps = {
  href: string;
  children: ReactNode;
  variant?: PreorderButtonVariant;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

const VARIANT_CLASSES: Record<PreorderButtonVariant, string> = {
  primary: "px-6 py-4 text-base",
  mini: "px-[11px] py-[11px] text-sm",
};

export function PreorderButton({
  href,
  children,
  variant = "mini",
  className,
  ...anchorProps
}: PreorderButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`block w-full rounded-md border border-brand-gold text-center font-medium text-brand-green transition-colors hover:bg-brand-gold hover:text-brand-green-900 ${VARIANT_CLASSES[variant]} ${className ?? ""}`}
      {...anchorProps}
    >
      {children}
    </a>
  );
}
