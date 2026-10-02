# LocalFlow marketing site

Single-page, statically exported Next.js site for LocalFlow. Every product
fact and every line of copy lives in `lib/site.ts`; a test cross-checks the
requirements against the repo's root `README.md` (and the speed claims against
`docs/PROJECT.md`), so update them together.

    pnpm install
    pnpm dev      # http://localhost:3000
    pnpm test     # vitest
    pnpm check    # next build (static export to out/) + fail on any third-party request

`out/` is plain HTML/CSS/JS and can be hosted anywhere.

**Privacy:** the site makes the same promise as the app — no analytics, no
cookies, no third-party scripts, fonts or images. Fonts are self-hosted from
`app/fonts/`. `pnpm check` enforces it.

**Placeholders:** the logo (`components/Wordmark.tsx`, a ⌥ keycap for now),
favicon (`app/favicon.ico`, still the Next.js default) and social images are
temporary and will be replaced.
