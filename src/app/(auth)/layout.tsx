import type { Metadata } from "next";

import { fraunces, vastagoGrotesk } from "@/app/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Acceso privado | Vessel Perfumes",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${vastagoGrotesk.variable} ${fraunces.variable}`}
    >
      <body className="bg-brand-green-950 text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
