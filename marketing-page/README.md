# peluni marketing site

Single-page, statically exported Next.js site for peluni. Page copy lives in `lib/content.ts`; product
identity, the demo's sample take and the analytics settings in `lib/site.ts`. Tests cross-check the
requirements and speed claim against the repo's root `README.md` and `docs/PROJECT.md`, and
`__tests__/copy-style.test.ts` fails on dashes, negation-then-reveal phrasing and copy that vouches
for its own honesty.

The voice and visual rules behind those tests (tone of voice, brand, claims and their sources) are
kept in a local `.claude/rules/` folder for Claude Code; the tests are the part everyone shares.

    pnpm install
    pnpm dev      # http://localhost:3000
    pnpm test     # vitest
    pnpm check    # next build (static export to out/) + fail on any third-party request

`out/` is plain HTML/CSS/JS and can be hosted anywhere.

**Privacy:** no cookies and no third-party requests unless a visitor opts in to
Microsoft Clarity analytics through the consent banner
(`components/AnalyticsConsent.tsx`); declining or ignoring it loads nothing.
Fonts are self-hosted from `app/fonts/`. `pnpm check` keeps third-party
scripts, fonts and images out of the shipped HTML.

**Look:** grey-green paper, charcoal in dark mode, Source Serif 4 for reading, Atkinson Hyperlegible
Next for the interface and Atkinson Hyperlegible Mono for transcripts (all self-hosted, see
`app/fonts/README.md`). The logo teal is the one accent: the record light, and the marker under
words peluni put there. The logomark is `components/Logomark.tsx`; favicons are `app/favicon.ico`,
`app/icon.svg` and `app/apple-icon.png`.

The share image is `app/opengraph-image.png` (1200×630, with its alt text in
`opengraph-image.alt.txt`); regenerate it if the hero or brand changes. The web manifest is
`app/manifest.ts`.

**Search:** `SITE.url` in `lib/site.ts` is the one canonical origin. From it come `metadataBase` and
the canonical link (`app/layout.tsx`), `app/robots.ts`, `app/sitemap.ts`, the `SoftwareApplication`
JSON-LD (`components/JsonLd.tsx`) and `/llms.txt` (`app/llms.txt/route.ts`), all built from the same
facts as the page and pinned by `__tests__/seo.test.ts`. The JSON-LD has no ratings, reviews or
FAQPage on purpose. `pnpm check` treats `<link rel="canonical">`/`"alternate"` as non-fetches.
Security headers are in `vercel.json` (`next.config` headers don't apply to a static export).
