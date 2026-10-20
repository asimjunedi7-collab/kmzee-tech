import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { AppWidgets } from "@/components/app/AppWidgets";
import { Providers } from "@/components/Providers";
import { ThemeScript } from "@/components/ThemeScript";
import { structuredData } from "@/lib/seo";

// Arabic companion font, approved in the PRD. Self-hosted at build time so it works offline.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kmzee.tech"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0c343d" },
    { media: "(prefers-color-scheme: dark)", color: "#071e23" },
  ],
};

// Root layout for the Arabic site (/ar/). Server-rendered Arabic copy, RTL direction.
export default function ArabicRootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(structuredData("ar")).replace(/</g, "\\u003c");

  return (
    <html lang="ar" dir="rtl" className={plexArabic.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Providers>
          {children}
          <AppWidgets locale="ar" />
        </Providers>
      </body>
    </html>
  );
}
