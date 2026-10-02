import { Logomark } from "@/components/Logomark";
import { SITE } from "@/lib/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2.5 text-[1.6rem] font-extrabold leading-none ${className}`}>
      <Logomark className="h-8 w-8 shrink-0" />
      {SITE.name}
    </span>
  );
}
