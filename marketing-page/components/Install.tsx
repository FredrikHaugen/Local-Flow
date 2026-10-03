import { Chapter } from "@/components/Chapter";
import { MoreLink } from "@/components/MoreLink";
import { Inlines } from "@/components/PageBody";
import { INSTALL_GUIDE, INTRO, QUESTIONS, USING } from "@/lib/content";
import { SITE } from "@/lib/site";

// The end of the page: where the release stands and what a Mac needs to run it, the four build steps at
// reading size, then how fast it is and how to dictate hands-free.
export function Install() {
  return (
    <Chapter id="install" title={INSTALL_GUIDE.title} wide className="pb-12 pt-24 sm:pb-16 sm:pt-32">
      <p data-status className="mt-4 max-w-2xl text-[clamp(1.15rem,1.05rem+0.4vw,1.35rem)] leading-[1.45]">
        {INTRO.release} {INSTALL_GUIDE.runsOn}
      </p>
      <ol className="mt-10 grid max-w-4xl gap-x-12 gap-y-5 text-[1.15rem] leading-snug sm:grid-cols-2">
        {INSTALL_GUIDE.steps.map((step, i) => (
          <li key={i} className="grid grid-cols-[1.75rem_1fr] border-t border-border pt-4">
            <span aria-hidden="true" className="font-sans font-semibold text-muted">
              {i + 1}
            </span>
            <span>
              <Inlines parts={step} />
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-12 max-w-2xl text-[1.15rem] leading-[1.45]">
        {USING.paragraphs[0]} {QUESTIONS.items[0].a}
      </p>
      <p className="mt-6 font-sans text-[0.95rem] text-muted">
        {QUESTIONS.detailsBefore}
        <a href={`${SITE.repoUrl}#readme`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {QUESTIONS.detailsLink}
        </a>
        {QUESTIONS.detailsAfter} {QUESTIONS.moreBefore}
        <a href={`${SITE.repoUrl}/issues`} className="underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground">
          {QUESTIONS.moreLink}
        </a>
        {QUESTIONS.moreAfter}
      </p>
      <MoreLink {...INSTALL_GUIDE.more} />
    </Chapter>
  );
}
