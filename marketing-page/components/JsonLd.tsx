import { FOOTER, SEO, SITE } from "@/lib/site";

// Schema.org for search engines and AI answers: what peluni is, what it runs on, and that it's free.
// No ratings or reviews (there are none to cite) and no FAQPage (Google retired those rich results).
export function jsonLd() {
  const home = `${SITE.url}/`;
  const license = FOOTER.project.find((link) => link.label === "MIT License")!.href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${home}#software`,
        name: SITE.name,
        description: SITE.description,
        url: home,
        applicationCategory: SEO.category,
        operatingSystem: SEO.operatingSystem,
        processorRequirements: SEO.processor,
        softwareVersion: SITE.version,
        license,
        downloadUrl: SITE.releasesUrl,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        sameAs: [SITE.repoUrl],
        isPartOf: { "@id": `${home}#website` },
      },
    ],
  };
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }}
    />
  );
}
