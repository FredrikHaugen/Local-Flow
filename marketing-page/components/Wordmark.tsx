import { Logomark } from "@/components/Logomark";
import { SITE } from "@/lib/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-sans inline-flex items-center gap-2.5 text-[1.3rem] font-bold leading-none tracking-[-0.01em] ${className}`}>
      <Logomark className="h-8 w-8 shrink-0" />
      {SITE.name}
    </span>
  );
}
