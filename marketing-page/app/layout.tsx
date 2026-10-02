import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { JsonLd } from "@/components/JsonLd";
import { SEO, SITE } from "@/lib/site";
import "./globals.css";

// Self-hosted, latin subset only (see app/fonts/README.md).
// Source Serif 4 sets headings and reading text; Atkinson Hyperlegible Next the interface;
// Atkinson Hyperlegible Mono the transcripts and commands.
const text = localFont({
  variable: "--font-text",
  src: "./fonts/source-serif-4-latin.woff2",
  weight: "400 700",
  display: "swap",
});

const ui = localFont({
  variable: "--font-ui",
  src: "./fonts/atkinson-hyperlegible-next-latin.woff2",
  weight: "400 700",
  display: "swap",
});

const code = localFont({
  variable: "--font-code",
  src: "./fonts/atkinson-hyperlegible-mono-latin.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
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
      className={`${text.variable} ${ui.variable} ${code.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <JsonLd />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
