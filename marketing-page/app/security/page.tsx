import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { SECURITY } from "@/lib/pages/security";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/security");

export default function SecurityPage() {
  return (
    <PageShell path="/security">
      <PageIntro path="/security" lead={SECURITY.lead} />
      <PageBody sections={SECURITY.sections} />
      <JsonLdScript data={pageJsonLd("/security")} />
    </PageShell>
  );
}
