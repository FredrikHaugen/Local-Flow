# Fonts

All three are built from the latin-subset variable files Google Fonts serves, committed here so the
site makes no third-party requests. Rebuild them with `sh scripts/fonts.sh` (needs network and uv).
The script:

1. fetches the three latin files from Google Fonts;
2. cuts Source Serif 4's weight axis to the 400–700 the site uses (Google serves `wght 200–900`);
3. subsets all three to `charset.txt`: printable ASCII plus every character in `lib/`, `components/`,
   `app/` and `../CHANGELOG.md` (`scripts/font-charset.mjs`).

The fonts set the h1 and the reading text, which are the mobile LCP element, so their size matters:
together they went from 135 KB to 85 KB. `__tests__/fonts.test.ts` fails when the copy or the
changelog gains a character that isn't in `charset.txt`; run the script again when it does.
`→`, `⌘` and `⌥` were never in Google's latin files and come from a system font.

- `source-serif-4-latin.woff2`: **Source Serif 4**, `opsz 8–60`, `wght 400–700`. Headings and reading
  text. Copyright 2014–2023 Adobe (https://github.com/adobe-fonts/source-serif). SIL Open Font License 1.1.
- `atkinson-hyperlegible-next-latin.woff2`: **Atkinson Hyperlegible Next**, `wght 400–700`. Interface
  text. Copyright 2020–2024 Braille Institute of America. SIL Open Font License 1.1.
- `atkinson-hyperlegible-mono-latin.woff2`: **Atkinson Hyperlegible Mono**, `wght 400–600`.
  Transcripts and commands. Copyright 2020–2024 Braille Institute of America. SIL Open Font License 1.1.
