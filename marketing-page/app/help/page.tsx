import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { HELP } from "@/lib/pages/help";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/help");

export default function HelpPage() {
  return (
    <PageShell path="/help">
      <PageIntro path="/help" lead={HELP.lead} />
      <PageBody sections={HELP.sections} />
      <JsonLdScript data={pageJsonLd("/help")} />
    </PageShell>
  );
}
