#!/bin/sh
# Rebuilds the three self-hosted fonts in app/fonts/ from the latin files Google Fonts serves:
# fetch, cut Source Serif 4's weight axis to the 400-700 the site uses, then subset all three to the
# characters in scripts/font-charset.mjs. Needs network (Google Fonts) and uv; the built site still
# fetches nothing from Google. Run from marketing-page/: `sh scripts/fonts.sh`.
set -eu

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
FONTTOOLS="uvx --from fonttools[woff]"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

fetch_latin() { # $1 = css2 family query, $2 = output file
  curl -fsS -A "$UA" "https://fonts.googleapis.com/css2?family=$1&display=swap" \
  | python3 -c '
import re, sys
css = sys.stdin.read()
block = re.search(r"/\* latin \*/\s*@font-face\s*\{(.*?)\}", css, re.S).group(1)
print(re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1))' \
  | xargs curl -fsS -o "$2"
}

fetch_latin 'Source+Serif+4:opsz,wght@8..60,400..700' "$TMP/source-serif-4-latin.woff2"
fetch_latin 'Atkinson+Hyperlegible+Next:wght@400..700' "$TMP/atkinson-hyperlegible-next-latin.woff2"
fetch_latin 'Atkinson+Hyperlegible+Mono:wght@400..600' "$TMP/atkinson-hyperlegible-mono-latin.woff2"

# Google serves Source Serif 4 with wght 200-900 whatever range is asked for.
$FONTTOOLS fonttools varLib.instancer "$TMP/source-serif-4-latin.woff2" wght=400:700 -o "$TMP/source-serif-4-latin.ttf"
mv "$TMP/source-serif-4-latin.ttf" "$TMP/source-serif-4-latin.woff2"

node scripts/font-charset.mjs > app/fonts/charset.txt
for name in source-serif-4-latin atkinson-hyperlegible-next-latin atkinson-hyperlegible-mono-latin; do
  $FONTTOOLS pyftsubset "$TMP/$name.woff2" --text-file=app/fonts/charset.txt --layout-features='*' \
    --flavor=woff2 --output-file="app/fonts/$name.woff2"
done
ls -l app/fonts/*.woff2
