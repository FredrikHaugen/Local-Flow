import { Section } from "@/components/Section";
import { PRIVACY_POINTS } from "@/lib/site";

export function Privacy() {
  return (
    <Section
      id="privacy"
      title="Private by construction"
      intro="Not a privacy setting — the architecture. There's no server for your voice to go to."
    >
      <ul className="grid gap-6 sm:grid-cols-2">
        {PRIVACY_POINTS.map((point) => (
          <li key={point.title} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">{point.title}</h3>
            <p className="mt-2 text-muted">{point.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
