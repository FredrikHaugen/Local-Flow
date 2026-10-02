import { Chapter } from "@/components/Chapter";
import { JsonLdScript, pageJsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageIntro";
import { PageShell } from "@/components/PageShell";
import { CHANGELOG } from "@/lib/changelog";
import { CHANGELOG_PAGE } from "@/lib/pages/changelog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/changelog");

// One section per version, one dated list per day, all from the repo's CHANGELOG.md.
export default function ChangelogPage() {
  return (
    <PageShell path="/changelog">
      <PageIntro path="/changelog" lead={CHANGELOG_PAGE.lead} />
      {CHANGELOG.map((release) => (
        <Chapter
          key={release.version}
          id={`v${release.version.replaceAll(".", "-")}`}
          title={`${release.version} (${release.status === "unreleased" ? CHANGELOG_PAGE.unreleased : CHANGELOG_PAGE.formatDate(release.status)})`}
          className="pt-14 sm:pt-16"
        >
          <p className="mt-3 font-sans text-[0.95rem] text-muted">
            {CHANGELOG_PAGE.requires}
            {release.status === "unreleased" && ` ${CHANGELOG_PAGE.unreleasedNote}`}
          </p>
          {release.days.map((day) => (
            <div key={day.date} className="mt-8">
              <h3 className="font-sans text-[1.05rem] font-semibold">
                <time dateTime={day.date}>{CHANGELOG_PAGE.formatDate(day.date)}</time>
              </h3>
              <ul className="mt-3 grid list-disc gap-3 pl-6">
                {day.items.map((item) => {
                  // The first word says what kind of change it is (Added, Changed, Fixed), so it leads in bold.
                  const space = item.indexOf(" ");
                  return (
                    <li key={item}>
                      <span className="font-semibold">{item.slice(0, space)}</span>
                      {item.slice(space)}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </Chapter>
      ))}
      <div className="pb-20 sm:pb-24" />
      <JsonLdScript data={pageJsonLd("/changelog")} />
    </PageShell>
  );
}
