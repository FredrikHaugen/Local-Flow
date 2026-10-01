import { Section } from "@/components/Section";
import { REQUIREMENTS, SITE } from "@/lib/site";

export function Requirements() {
  return (
    <Section id="requirements" title="Requirements">
      <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {REQUIREMENTS.map((req) => (
          <div key={req.title}>
            <dt className="font-semibold">{req.title}</dt>
            <dd className="mt-1 text-muted">{req.detail}</dd>
          </div>
        ))}
      </dl>
      <a
        href={SITE.releasesUrl}
        className="mt-12 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Download {SITE.name}
      </a>
    </Section>
  );
}
