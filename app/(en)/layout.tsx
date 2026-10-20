import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AppWidgets } from "@/components/app/AppWidgets";
import { Providers } from "@/components/Providers";
import { ThemeScript } from "@/components/ThemeScript";
import { structuredData } from "@/lib/seo";

// Root layout for the English site (/). The Arabic site has its own root layout in (ar).
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

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(structuredData("en")).replace(/</g, "\\u003c");

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <Providers>
          {children}
          <AppWidgets locale="en" />
        </Providers>
      </body>
    </html>
  );
}
