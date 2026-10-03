import { Audio } from "@/components/Audio";
import { Cleanup } from "@/components/Cleanup";
import { Install } from "@/components/Install";
import { Intro } from "@/components/Intro";
import { JsonLdScript, homeJsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Words } from "@/components/Words";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/");

export default function Home() {
  return (
    <PageShell path="/">
      <Intro />
      <Cleanup />
      <Words />
      <Audio />
      <Install />
      <JsonLdScript data={homeJsonLd()} />
    </PageShell>
  );
}
