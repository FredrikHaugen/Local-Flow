// The two brand devices, used everywhere a section starts.
//
// Marker: the real recording overlay (a dark capsule with level bars), shrunk to a section label.
// Marked: a headline whose key phrase is "just typed" — selected, with the cursor parked after it.
// The cursor holds still on purpose: it is a mark, not an animation.

const MARKER_BARS = [0.45, 0.9, 0.6, 1, 0.5, 0.75];

export function Marker({
  label,
  tone = "plain",
  className = "",
}: {
  label: string;
  tone?: "plain" | "ink" | "accent";
  className?: string;
}) {
  const skin =
    tone === "ink"
      ? "bg-ink-foreground text-ink"
      : tone === "accent"
        ? "bg-accent-foreground text-accent"
        : "bg-ink text-ink-foreground";
  const key = tone === "plain" ? "bg-ink-accent text-ink" : tone === "ink" ? "bg-accent text-accent-foreground" : "bg-accent text-accent-foreground";
  return (
    <p className={`inline-flex h-8 items-center gap-2.5 rounded-full pl-1 pr-3.5 text-[0.8rem] font-semibold ${skin} ${className}`}>
      <span aria-hidden="true" className={`font-display grid h-6 w-6 place-items-center rounded-full text-[0.85rem] leading-none ${key}`}>
        ⌥
      </span>
      <span aria-hidden="true" className="flex h-3.5 items-center gap-[2px]">
        {MARKER_BARS.map((h, i) => (
          <span
            key={i}
            className="wave-bar w-[2px] rounded-full bg-current"
            style={{ height: `${Math.round(h * 100)}%` }}
          />
        ))}
      </span>
      {label}
    </p>
  );
}

export function Marked({ text, mark }: { text: string; mark?: string }) {
  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="typed">{mark}</span>
      <span aria-hidden="true" className="typed-caret" />
      {text.slice(at + mark.length)}
    </>
  );
}
