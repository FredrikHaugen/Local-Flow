import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { FAQ, faqForJsonLd } from "@/lib/pages/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/faq");

// Each question is a section, so it gets an id to link to and an h2.
export default function FaqPage() {
  return (
    <PageShell path="/faq">
      <PageIntro path="/faq" lead={FAQ.lead} />
      <PageBody sections={FAQ.items.map((item) => ({ id: item.id, heading: item.q, blocks: [{ p: item.a }] }))} />
      <JsonLdScript data={pageJsonLd("/faq", faqForJsonLd())} />
    </PageShell>
  );
}
