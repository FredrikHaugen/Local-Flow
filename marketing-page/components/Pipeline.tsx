import { Section } from "@/components/Section";
import { PIPELINE } from "@/lib/site";

export function Pipeline() {
  return (
    <Section
      id="under-the-hood"
      title="Under the hood"
      intro="Every dictation runs through five on-device stages. If any one of them fails, your words still land somewhere you can see them."
    >
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE.map((stage, i) => (
          <li key={stage.name} className="bg-card p-6">
            <span aria-hidden="true" className="font-mono text-sm text-accent">
              {i + 1}
            </span>
            <h3 className="mt-2 font-semibold">{stage.name}</h3>
            <p className="mt-2 text-sm text-muted">{stage.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
