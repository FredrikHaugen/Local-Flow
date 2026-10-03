import { FOOTER_NOTE } from "@/lib/content";
import { page, pageUrl } from "@/lib/pages";
import { SEO, SITE } from "@/lib/site";

// Schema.org for search engines and AI answers. The home page describes the app; every other page is
// a WebPage about it (FAQPage on /faq, where the questions are visible). No ratings or reviews (there
// are none to cite), no Organization (there isn't one), no breadcrumbs (the site is one level deep).
// No Offer or downloadUrl until the first release is on GitHub (seo.test.ts guards this).
export function homeJsonLd() {
  const home = pageUrl("/");
  const license = FOOTER_NOTE.links.find((link) => link.label === "MIT License")!.href;
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
        isAccessibleForFree: true,
        codeRepository: SITE.repoUrl,
        sameAs: [SITE.repoUrl],
        isPartOf: { "@id": `${home}#website` },
      },
    ],
  };
}

export function pageJsonLd(path: string, faq?: readonly { q: string; a: string }[]) {
  const p = page(path);
  const url = pageUrl(path);
  const home = pageUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": faq ? "FAQPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: p.title,
    description: p.description,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", "@id": `${home}#website`, url: home, name: SITE.name },
    about: { "@id": `${home}#software` },
    ...(faq && {
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    }),
  };
}

export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so no string in the data can close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
