import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { JsonLd } from "@/components/JsonLd";
import { SEO, SITE } from "@/lib/site";
import "./globals.css";

// Geist and Geist Mono, latin subset only, self-hosted (see app/fonts/README.md). The site's copy
// is English, so the other subsets only added @font-face rules to the inlined CSS.
const geistSans = localFont({
  variable: "--font-geist-sans",
  src: "./fonts/geist-latin.woff2",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: "./fonts/geist-mono-latin.woff2",
  weight: "100 900",
  display: "swap",
  preload: false,
});

// The signature face: Archivo pinned to its narrowest width (wdth 62) at 800, so every headline
// reads tall and compressed. A static instance, self-hosted (see app/fonts/README.md).
const display = localFont({
  variable: "--font-display-face",
  src: "./fonts/archivo-extracondensed-800.woff2",
  weight: "800",
  display: "swap",
  // Next's generated fallback is Arial with no weight, so 800 headings got a synthetic bold that
  // is wider than this condensed face: the hero rewrapped on swap (mobile CLS 0.10 in Lighthouse).
  // "display-fallback" in globals.css declares weight 800, so the browser doesn't embolden it.
  adjustFontFallback: false,
  fallback: ["display-fallback"],
});

// og:image comes from app/opengraph-image.png (+ .alt.txt); X falls back to it for the large card.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SEO.title,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO.title,
    description: SITE.description,
    url: "/",
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SITE.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <JsonLd />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
