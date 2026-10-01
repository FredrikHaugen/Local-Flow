import { PHONE } from "@/lib/site";

// Above a phone swipe rail: one tick per card (the first lit), then "Swipe →". Purely visual, so
// hidden from screen readers; they read the list as a list. `until` is where the rail becomes a grid.
export function SwipeHint({ count, tone = "plain", until = "sm" }: { count: number; tone?: "plain" | "ink"; until?: "sm" | "md" }) {
  return (
    <p
      aria-hidden="true"
      className={`swipe-hint mb-4 flex items-center gap-3 font-mono text-xs ${tone === "ink" ? "text-ink-muted" : "text-muted"} ${until === "md" ? "md:hidden" : "sm:hidden"}`}
    >
      <span className="flex gap-1">
        {Array.from({ length: count }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      {PHONE.swipe} →
    </p>
  );
}
