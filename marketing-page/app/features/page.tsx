import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { FEATURES } from "@/lib/pages/features";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/features");

export default function FeaturesPage() {
  return (
    <PageShell path="/features">
      <PageIntro path="/features" lead={FEATURES.lead} />
      <PageBody sections={FEATURES.sections} />
      <JsonLdScript data={pageJsonLd("/features")} />
    </PageShell>
  );
}
