import { SITE } from "@/lib/site";

// Placeholder mark until the real logo exists — swap it here only.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2.5 text-[1.05rem] font-bold tracking-tight ${className}`}>
      <span aria-hidden="true" className="relative grid h-7 w-7 place-items-center rounded-lg bg-foreground text-background">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
      </span>
      {SITE.name}
    </span>
  );
}
