import { defineQuery } from "next-sanity";

import { sanityClient } from "@/lib/sanity/client";
import type { Settings } from "@/lib/sanity/types";

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0]{
    whatsappNumber,
    instagramUrl,
    tagline,
    contactInfo
  }
`);

export async function getSettings(): Promise<Settings | null> {
  return sanityClient.fetch(SETTINGS_QUERY);
}
