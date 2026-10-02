import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { Inlines } from "@/components/PageBody";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { CHANGELOG } from "@/lib/changelog";
import { CHANGELOG_PAGE } from "@/lib/pages/changelog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/changelog");

// One section per version, one dated list per day, all from the repo's CHANGELOG.md. The version
// heading stays well below the h1; what it needs, and whether it's out yet, sits right under it.
export default function ChangelogPage() {
  return (
    <PageShell path="/changelog">
      <PageIntro path="/changelog" lead={CHANGELOG_PAGE.lead} />
      <div className="px-4 pb-20 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          {CHANGELOG.map((release) => {
            const id = `v${release.version.replaceAll(".", "-")}`;
            const unreleased = release.status === "unreleased";
            return (
              <section
                key={release.version}
                id={id}
                aria-labelledby={`${id}-title`}
                className="max-w-2xl scroll-mt-6 pt-14 sm:pt-16"
              >
                <h2
                  id={`${id}-title`}
                  className="text-[clamp(1.6rem,1.35rem+1vw,2.1rem)] leading-[1.15] tracking-[-0.01em]"
                >
                  {release.version} (
                  {unreleased
                    ? CHANGELOG_PAGE.unreleased
                    : CHANGELOG_PAGE.formatDate(release.status)}
                  )
                </h2>
                <div className="mt-4 border-l-2 border-foreground pl-4">
                  <p>{CHANGELOG_PAGE.requires}</p>
                  {unreleased && (
                    <p className="mt-2">
                      <Inlines parts={CHANGELOG_PAGE.unreleasedNote} />
                    </p>
                  )}
                </div>
                {release.days.map((day) => (
                  <div key={day.date} className="mt-10">
                    <h3 className="font-sans text-[1.2rem] font-semibold">
                      <time dateTime={day.date}>
                        {CHANGELOG_PAGE.formatDate(day.date)}
                      </time>
                    </h3>
                    <ul className="mt-3 grid list-disc gap-2 pl-6">
                      {day.items.map((item) => {
                        // The first word says what kind of change it is (Added, Changed, Fixed), so it leads.
                        const space = item.indexOf(" ");
                        return (
                          <li key={item}>
                            <span className="font-semibold">
                              {item.slice(0, space)}
                            </span>
                            {item.slice(space)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </div>
      <JsonLdScript data={pageJsonLd("/changelog")} />
    </PageShell>
  );
}
