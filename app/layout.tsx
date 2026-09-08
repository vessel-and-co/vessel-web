import type { Metadata } from "next";
import "./globals.css";

const description =
  "Vessel Perfumes. Perfumería en Paraguay. Fragancias seleccionadas con una experiencia de compra cuidada.";

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vesselperfumes.com"
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Vessel Perfumes",
  description,
  openGraph: {
    title: "Vessel Perfumes",
    description,
    url: siteUrl,
    type: "website",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
