# peluni marketing site

Single-page, statically exported Next.js site for peluni. Page copy lives in `lib/content.ts`; product
identity, the demo's sample take and the analytics settings in `lib/site.ts`. Tests cross-check the
requirements and speed claim against the repo's root `README.md` and `docs/PROJECT.md`, and
`__tests__/copy-style.test.ts` fails on dashes, negation-then-reveal phrasing and copy that vouches
for its own honesty.

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
`app/fonts/README.md`). The only colors are macOS's selection blue on pasted text and the logo teal
as the record light. The logomark is `components/Logomark.tsx`; favicons are `app/favicon.ico`,
`app/icon.svg` and `app/apple-icon.png`.
