import { Chapter } from "@/components/Chapter";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} className="pt-20 sm:pt-28">
      {AUDIO.paragraphs.map((p) => (
        <p key={p} className="mt-5">
          {p}
        </p>
      ))}
      <p className="mt-5">
        {AUDIO.storageBefore} <code className="rounded bg-card px-1.5 py-0.5 font-mono text-[0.85em]">{AUDIO.storagePath}</code>{" "}
        {AUDIO.storageAfter}
      </p>
      <p className="mt-5">
        {AUDIO.sourceBefore}{" "}
        <a href={SITE.repoUrl} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {AUDIO.sourceLink}
        </a>
        {AUDIO.sourceAfter}
      </p>
    </Chapter>
  );
}
