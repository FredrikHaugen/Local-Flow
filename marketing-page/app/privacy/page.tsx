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
      <PageBody sections={PRIVACY.sections} />
      <p className="mx-auto mt-10 max-w-5xl px-4 font-sans text-[0.95rem] text-muted sm:px-6">
        {PRIVACY.updatedLabel} <time dateTime={PRIVACY.updated}>{PRIVACY.updated}</time>.
      </p>
      <JsonLdScript data={pageJsonLd("/privacy")} />
    </PageShell>
  );
}
