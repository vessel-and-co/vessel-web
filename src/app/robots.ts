import type { MetadataRoute } from "next";

import { getSiteUrl, isStagingSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isStagingSite()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
