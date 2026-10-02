// A page section: an id to link to, a plain h2, then whatever the section is made of.
// `wide` gives the content the full 64rem column; everything else reads at prose width.
export function Chapter({
  id,
  title,
  wide = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-6 px-4 sm:px-6 ${className}`}>
      <div className={`mx-auto ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
        <h2 id={headingId} className="text-[clamp(1.75rem,1.45rem+1.3vw,2.4rem)] leading-[1.15] tracking-[-0.01em]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
