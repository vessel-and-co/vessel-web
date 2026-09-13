import { Fraunces } from "next/font/google";
import localFont from "next/font/local";

/**
 * Vastago Grotesk (Atipo, comercial): fuente funcional para cuerpo, UI,
 * precios, filtros, botones y labels.
 */
export const vastagoGrotesk = localFont({
  src: [
    {
      path: "../../assets/fonts/VastagoGrotesk-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../assets/fonts/VastagoGrotesk-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-vastago",
  display: "swap",
});

/**
 * Fraunces (Google Fonts): serif display para titulares, nombres de
 * producto y de marca.
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
