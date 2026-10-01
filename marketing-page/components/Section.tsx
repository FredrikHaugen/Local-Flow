import { Marked, Marker } from "@/components/Brand";

export function Section({
  id,
  title,
  mark,
  intro,
  kicker,
  tone = "plain",
  children,
  bleed,
}: {
  id: string;
  title: string;
  // The phrase inside `title` set as "just typed".
  mark?: string;
  intro?: string;
  kicker?: string;
  tone?: "plain" | "ink";
  children: React.ReactNode;
  // Full-width content after the contained body (e.g. the closing CTA band).
  bleed?: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  const ink = tone === "ink";
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-16 pt-20 sm:pt-28 ${bleed ? "" : "pb-20 sm:pb-28"} ${ink ? "surface-ink bg-ink text-ink-foreground" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            {kicker && <Marker label={kicker} tone={ink ? "ink" : "plain"} />}
            <h2
              id={headingId}
              className="font-display mt-6 text-[clamp(3.25rem,13vw,6.25rem)] font-extrabold leading-[0.9] tracking-[-0.01em] text-balance"
            >
              <Marked text={title} mark={mark} />
            </h2>
          </div>
          {intro && (
            <p className={`max-w-md text-lg leading-relaxed lg:pb-2 ${ink ? "text-ink-muted" : "text-muted"}`}>{intro}</p>
          )}
        </div>
        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
      {bleed}
    </section>
  );
}
