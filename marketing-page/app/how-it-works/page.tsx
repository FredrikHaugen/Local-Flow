import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { HOW_IT_WORKS } from "@/lib/pages/how-it-works";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/how-it-works");

export default function HowItWorksPage() {
  return (
    <PageShell path="/how-it-works">
      <PageIntro path="/how-it-works" lead={HOW_IT_WORKS.lead} />
      <PageBody sections={HOW_IT_WORKS.sections} />
      <JsonLdScript data={pageJsonLd("/how-it-works")} />
    </PageShell>
  );
}
