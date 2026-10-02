import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { SITE } from "@/lib/site";
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

export const metadata: Metadata = {
  title: `${SITE.name}: voice dictation that runs on your Mac`,
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
      className={`${text.variable} ${ui.variable} ${code.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
