import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE } from "@/lib/site";
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
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
