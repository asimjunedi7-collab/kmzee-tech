import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Both locales list each other with hreflang alternates, so search engines
// know which version to show to which audience.
export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = {
    languages: {
      en: `${SITE_URL}/`,
      "en-IN": `${SITE_URL}/`,
      "en-SA": `${SITE_URL}/`,
      ar: `${SITE_URL}/ar/`,
      "ar-SA": `${SITE_URL}/ar/`,
    },
  };

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates,
    },
    {
      url: `${SITE_URL}/ar/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates,
    },
  ];
}
