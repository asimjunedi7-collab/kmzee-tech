import type { Metadata } from "next";
import {
  COVERAGE,
  FOUNDED,
  HOLDING_URL,
  LEGAL_NAME,
  LOCALE_PATHS,
  SITE_NAME,
  SITE_URL,
  SOCIALS,
} from "./site";

export type Locale = "en" | "ar";

// Titles and descriptions are written for the Saudi Arabia and India audiences.
// They are plain, factual sentences, and the coverage list comes from the live site.
const seo = {
  en: {
    title: "KMZee Technology | Business + Tech: Digital Products & Business Transformation",
    description:
      "Technology execution shaped by business understanding. KMZee Technology builds digital products and runs business transformation (strategy, operations and data) for companies in Saudi Arabia, India, the UK and Canada.",
    ogLocale: "en_IN",
    ogAlternate: "ar_SA",
    ogAlt: "KMZee Technology: Business + Tech",
    description2:
      "Digital product development, business transformation, strategy, operations and data for businesses in Saudi Arabia and India.",
  },
  ar: {
    title: "KMZee Technology | الأعمال + التقنية: منتجات رقمية وتحول في الأعمال في السعودية والهند",
    description:
      "تنفيذ تقني مبني على فهم حقيقي للأعمال. تطور KMZee Technology المنتجات الرقمية وتقدم خدمات التحول في الأعمال (الاستراتيجية والعمليات والبيانات) للشركات في السعودية والهند وبريطانيا وكندا.",
    ogLocale: "ar_SA",
    ogAlternate: "en_IN",
    ogAlt: "KMZee Technology: الأعمال + التقنية",
    description2:
      "تطوير المنتجات الرقمية، والتحول في الأعمال، والاستراتيجية، والعمليات، والبيانات للشركات في السعودية والهند.",
  },
} as const;

// hreflang: the same English page serves Indian, Saudi and other English readers.
// The Arabic page serves Saudi Arabia and other Arabic readers.
const languageAlternates = {
  en: LOCALE_PATHS.en,
  "en-IN": LOCALE_PATHS.en,
  "en-SA": LOCALE_PATHS.en,
  ar: LOCALE_PATHS.ar,
  "ar-SA": LOCALE_PATHS.ar,
  "x-default": LOCALE_PATHS.en,
};

export function pageMetadata(locale: Locale): Metadata {
  const copy = seo[locale];
  const path = LOCALE_PATHS[locale];
  const image = {
    url: "/icons/og-image.png",
    width: 1200,
    height: 630,
    alt: copy.ogAlt,
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.title,
    description: copy.description,
    applicationName: SITE_NAME,
    alternates: {
      canonical: path,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
      url: path,
      locale: copy.ogLocale,
      alternateLocale: [copy.ogAlternate],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [image.url],
    },
    manifest: locale === "en" ? "/manifest.webmanifest" : "/manifest.ar.webmanifest",
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      title: "KMZee",
      statusBarStyle: "default",
    },
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

// Organization and WebSite structured data. No street address is included
// because none was provided. Add it once it is confirmed (see PRD notes).
export function structuredData(locale: Locale) {
  const path = LOCALE_PATHS[locale];
  const url = `${SITE_URL}${path}`;
  const inLanguage = locale === "en" ? "en" : "ar";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icons/icon-512.png`,
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/icons/og-image.png`,
        description: seo[locale].description2,
        foundingDate: FOUNDED,
        parentOrganization: {
          "@type": "Organization",
          name: "KMZee Holding",
          url: HOLDING_URL,
        },
        areaServed: COVERAGE.map((country) => ({
          "@type": "Country",
          name: country.name,
        })),
        knowsLanguage: ["en", "ar"],
        sameAs: SOCIALS.map((social) => social.href),
        inLanguage,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url,
        inLanguage,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
