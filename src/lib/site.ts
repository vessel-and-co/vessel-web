const DEFAULT_SITE_URL = "https://vessel.com.py";

// Dominio del ambiente de staging (rama test). Nunca debe indexarse: no es
// contenido real, es donde se prueban cambios antes de produccion.
const STAGING_SITE_HOSTNAME = "test.vessel.com.py";

/**
 * URL publica del sitio, sin slash final. Sale de NEXT_PUBLIC_SITE_URL
 * (en local apunta a localhost:3000, en produccion al dominio real).
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return siteUrl.replace(/\/$/, "");
}

/**
 * True cuando el sitio esta corriendo en el ambiente de staging
 * (test.vessel.com.py). Se usa para bloquear indexacion: sitemap y robots
 * no deben exponer ese ambiente a buscadores.
 */
export function isStagingSite(): boolean {
  return new URL(getSiteUrl()).hostname === STAGING_SITE_HOSTNAME;
}
