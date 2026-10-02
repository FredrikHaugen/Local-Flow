# peluni marketing site

Single-page, statically exported Next.js site for peluni. Every product
fact and every line of copy lives in `lib/site.ts`; a test cross-checks the
requirements against the repo's root `README.md` (and the speed claims against
`docs/PROJECT.md`), so update them together.

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

**Brand:** the logomark is `components/Logomark.tsx` (inlined from `../brand/logomark.svg` so it
follows the theme). Favicons are `app/favicon.ico`, `app/icon.svg` and `app/apple-icon.png`; the
web manifest is `app/manifest.ts`. The share image is `app/opengraph-image.png` (1200×630, with
its alt text in `opengraph-image.alt.txt`); regenerate it if the hero or brand changes.

**Search:** `SITE.url` in `lib/site.ts` is the one canonical origin. From it come `metadataBase` and
the canonical link (`app/layout.tsx`), `app/robots.ts`, `app/sitemap.ts`, the `SoftwareApplication`
JSON-LD (`components/JsonLd.tsx`) and `/llms.txt` (`app/llms.txt/route.ts`), all built from the same
facts as the page and pinned by `__tests__/seo.test.ts`. The JSON-LD has no ratings, reviews or
FAQPage on purpose. `pnpm check` treats `<link rel="canonical">`/`"alternate"` as non-fetches.
Security headers are in `vercel.json` (`next.config` headers don't apply to a static export).
