import { Logomark } from "@/components/Logomark";
import { SITE } from "@/lib/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2 text-[1.45rem] font-extrabold leading-none ${className}`}>
      <Logomark className="h-7 w-7 shrink-0" />
      {SITE.name}
    </span>
  );
}
