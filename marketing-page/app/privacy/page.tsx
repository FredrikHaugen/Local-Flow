import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageBody } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { PRIVACY } from "@/lib/pages/privacy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <PageShell path="/privacy">
      <PageIntro path="/privacy" lead={PRIVACY.lead} />
      <PageBody
        sections={PRIVACY.sections}
        after={
          <p className="mt-10 font-sans text-[0.95rem] text-muted">
            {PRIVACY.updatedLabel} <time dateTime={PRIVACY.updated}>{PRIVACY.updated}</time>.
          </p>
        }
      />
      <JsonLdScript data={pageJsonLd("/privacy")} />
    </PageShell>
  );
}
