import type { SVGProps } from "react";

/**
 * Isotipo horizontal "Vessel & Co", derivado de
 * LOGOS/SVG/Vessel - Logo blanco horiz.svg (unico vector limpio del
 * lockup horizontal). La V y "&CO" van siempre en dorado de marca;
 * "ESSEL" hereda `currentColor` para adaptarse a fondo claro u oscuro.
 */
export function VesselWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vessel & Co"
      {...props}
    >
      <text
        transform="translate(229.48 282.13) scale(1.06 1)"
        fill="currentColor"
        fontFamily="var(--font-vastago)"
        fontWeight={700}
        fontSize="93.2px"
        style={{ letterSpacing: "0.35em" }}
      >
        ESSEL
      </text>
      <text
        x="696.75"
        y="281.78"
        fill="var(--color-brand-gold)"
        fontFamily="var(--font-vastago)"
        fontWeight={700}
        fontSize="36.18px"
        style={{ letterSpacing: "0.09em" }}
      >
        &amp;
        <tspan x="729.93" y="281.78" style={{ letterSpacing: "0.11em" }}>
          C
        </tspan>
        <tspan x="759.45" y="281.78" style={{ letterSpacing: "0.1em" }}>
          O
        </tspan>
      </text>
      <path
        fill="var(--color-brand-gold)"
        d="M254.17,92.49a1.46,1.46,0,0,0,.07-.19l0-.14a1.36,1.36,0,0,1,0-.17c0-.06,0-.11,0-.17s0-.1,0-.14l0-.21a.57.57,0,0,1,0-.13c0-.07,0-.15,0-.22V91a1.48,1.48,0,0,1,0-.21s0-.11,0-.16,0-.11,0-.17,0-.12,0-.19l0-.14-.06-.19a.65.65,0,0,0,0-.13,1.34,1.34,0,0,0-.07-.18l-.06-.14-.07-.15-.09-.15-.07-.13-.11-.15a.44.44,0,0,0-.08-.11l-.12-.15-.09-.1-.13-.13-.12-.11-.11-.1-.16-.11-.07,0,0,0-.19-.11-.1-.05-.18-.08-.11,0-.17,0-.14,0-.14,0-.17,0-.13,0H212.7A3.11,3.11,0,0,0,210,89.31L145.16,214.58a3.75,3.75,0,0,0,1.15,4.81,2.92,2.92,0,0,0,1.58.48,3.13,3.13,0,0,0,2.74-1.77l63.9-123.5H245.8l-92,176.8L59.58,89.31s0,0,0-.08l-.1-.17-.09-.14a1.13,1.13,0,0,1-.1-.13l-.12-.14a.39.39,0,0,0-.08-.1,1.85,1.85,0,0,0-.14-.14l-.09-.09-.15-.12-.11-.08-.13-.1-.14-.08-.13-.07L58,87.8l-.12,0-.17-.06-.13,0-.17,0-.15,0-.15,0H15.19a3.11,3.11,0,0,0-2.74,1.76,3.92,3.92,0,0,0,0,3.53L109.39,280.2a3.1,3.1,0,0,0,2.73,1.76h22.94a3.55,3.55,0,0,0,0-7H113.94L20.66,94.6H55l96,185.6a3.12,3.12,0,0,0,2.73,1.76h0a3.13,3.13,0,0,0,2.74-1.76L254,92.85l0,0,.09-.2A.61.61,0,0,0,254.17,92.49Z"
      />
    </svg>
  );
}
