const DEFAULT_SITE_URL = "https://vesselperfumes.com";

/**
 * URL publica del sitio, sin slash final. Sale de NEXT_PUBLIC_SITE_URL
 * (en local apunta a localhost:3000, en produccion al dominio real).
 */
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return siteUrl.replace(/\/$/, "");
}
