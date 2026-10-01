export function Section({
  id,
  title,
  intro,
  kicker,
  tone = "plain",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  kicker?: string;
  tone?: "plain" | "ink";
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  const ink = tone === "ink";
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-16 py-24 sm:py-32 ${ink ? "surface-ink bg-ink text-ink-foreground" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            {kicker && (
              <p
                className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] ${ink ? "text-ink-accent" : "text-accent"}`}
              >
                <span aria-hidden="true" className="h-px w-6 bg-current" />
                {kicker}
              </p>
            )}
            <h2
              id={headingId}
              className="font-display mt-4 text-4xl font-bold leading-[1.02] tracking-[-0.03em] text-balance sm:text-6xl"
            >
              {title}
            </h2>
          </div>
          {intro && (
            <p className={`max-w-md text-lg leading-relaxed lg:pb-2 ${ink ? "text-ink-muted" : "text-muted"}`}>{intro}</p>
          )}
        </div>
        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
