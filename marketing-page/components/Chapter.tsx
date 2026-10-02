// A page section: an id to link to, a plain h2, then whatever the section is made of. Every section
// shares the page's left edge; text stays at reading width unless `wide` lets the content use the
// whole 64rem column (tables side by side, the cleanup picker).
export function Chapter({
  id,
  title,
  wide = false,
  hiddenTitle = false,
  center = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  wide?: boolean;
  /** Keep the plain label for screen readers when the section shows its own display line instead. */
  hiddenTitle?: boolean;
  /** Centre the heading and everything under it. */
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-6 px-4 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-5xl">
        <div className={`${wide ? "" : "max-w-2xl"} ${center ? "mx-auto text-center" : ""}`}>
          <h2
            id={headingId}
            className={hiddenTitle ? "sr-only" : "text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.1] tracking-[-0.015em]"}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
