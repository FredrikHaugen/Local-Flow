import { SITE } from "@/lib/site";

// Placeholder mark until the real logo exists — swap it here only.
// For now: the one key you need, as a keycap, with the record light on it.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2 text-[1.45rem] font-extrabold leading-none ${className}`}>
      <span
        aria-hidden="true"
        className="relative grid h-7 w-7 place-items-center rounded-[0.45rem] bg-foreground text-[1.05rem] text-background shadow-[inset_0_-2px_0_var(--muted)]"
      >
        ⌥
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
      </span>
      {SITE.name}
    </span>
  );
}
