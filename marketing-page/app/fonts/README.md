# Fonts

All three are the latin-subset variable files Google Fonts serves, committed here so the site makes no
third-party requests. Regenerate with the `fetch_latin` snippet in
`docs/superpowers/plans/2026-10-02-site-without-template.md` (Task 1, Step 5).

- `source-serif-4-latin.woff2`: **Source Serif 4**, `opsz 8–60`, `wght 400–700`. Headings and reading
  text. Copyright 2014–2023 Adobe (https://github.com/adobe-fonts/source-serif). SIL Open Font License 1.1.
  Google serves `wght 200–900`; the weight axis is cut to the 400–700 the site uses, which takes the
  file from 122 KB to 83 KB (it sets the h1, the mobile LCP element). After fetching, run
  `uvx --from 'fonttools[woff]' fonttools varLib.instancer <file> wght=400:700 -o serif.ttf`, then
  `uvx --from 'fonttools[woff]' pyftsubset serif.ttf --unicodes='*' --layout-features='*' --flavor=woff2 --output-file=<file>`.
- `atkinson-hyperlegible-next-latin.woff2`: **Atkinson Hyperlegible Next**, `wght 400–700`. Interface
  text. Copyright 2020–2024 Braille Institute of America. SIL Open Font License 1.1.
- `atkinson-hyperlegible-mono-latin.woff2`: **Atkinson Hyperlegible Mono**, `wght 400–600`.
  Transcripts and commands. Copyright 2020–2024 Braille Institute of America. SIL Open Font License 1.1.
