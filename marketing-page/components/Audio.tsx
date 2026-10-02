import { Chapter } from "@/components/Chapter";
import { AUDIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// The privacy argument, drawn: every stage sits inside the line around "Your Mac", and the only
// thing outside it is the model download.
function AudioPath() {
  return (
    <figure aria-label={AUDIO.pathLabel} className="mt-10 font-sans">
      <div className="rounded-xl border-2 border-foreground px-5 pb-7 pt-4 sm:px-8">
        <p className="text-sm font-semibold">{AUDIO.boundary}</p>
        <ol className="audio-path mt-5 grid gap-y-5 sm:grid-cols-5 sm:gap-x-10">
          {AUDIO.stages.map((stage) => (
            <li key={stage.name} className="relative">
              <strong className="block text-[1.2rem] leading-snug">{stage.name}</strong>
              <span className="mt-0.5 block text-[0.95rem] text-muted">{stage.detail}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="ml-8 flex items-center gap-3 text-[0.95rem]">
        <span aria-hidden="true" className="h-10 w-0.5 bg-foreground/40" />
        <span>
          <strong>{AUDIO.outside}</strong> <span className="text-muted">{AUDIO.outsideDetail}</span>
        </span>
      </p>
    </figure>
  );
}

export function Audio() {
  return (
    <Chapter id="privacy" title={AUDIO.title} wide className="desk mt-24 py-16 sm:mt-32 sm:py-24">
      <AudioPath />
      <div className="max-w-2xl">
        {AUDIO.paragraphs.map((p) => (
          <p key={p} className="mt-6">
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
      </div>
    </Chapter>
  );
}
