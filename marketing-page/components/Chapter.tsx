// A page section: an id to link to, a plain h2, then whatever the section is made of. Every section
// shares the page's left edge; text stays at reading width unless `wide` lets the content use the
// whole 64rem column (tables side by side, the cleanup picker).
export function Chapter({
  id,
  title,
  wide = false,
  display = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  wide?: boolean;
  /** A section that is the page's moment: its heading set at display size. */
  display?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-6 px-4 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-5xl">
        <div className={wide ? "" : "max-w-2xl"}>
          <h2
            id={headingId}
            className={
              display
                ? "text-[clamp(2.4rem,1.5rem+3.6vw,4.5rem)] leading-[1.05] tracking-[-0.02em]"
                : "text-[clamp(1.75rem,1.45rem+1.3vw,2.4rem)] leading-[1.15] tracking-[-0.01em]"
            }
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}
