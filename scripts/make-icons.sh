#!/bin/bash
# Regenerate the macOS app icon and menu bar icon from brand/*.svg. Uses only macOS tools
# (AppKit via scripts/render-svg.swift, sips, iconutil). Outputs are committed, so builds never run it.
set -euo pipefail
cd "$(dirname "$0")/.."
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
SET="$TMP/AppIcon.iconset"
mkdir "$SET"

# App icon: the dark logomark (ink tile, light stroke), as on the favicon and touch icon.
# macOS icon grid: the tile is 824 of 1024 px, centred on a transparent canvas.
swift scripts/render-svg.swift brand/logomarkDark.svg "$TMP/1024.png" 1024 1024 100
for s in 16 32 128 256 512; do
    sips -z "$s" "$s" "$TMP/1024.png" --out "$SET/icon_${s}x${s}.png" >/dev/null
    sips -z "$((s * 2))" "$((s * 2))" "$TMP/1024.png" --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o Packaging/AppIcon.icns

# Menu bar: a template image 16 pt tall (@1x and @2x), keeping the art's 84:63 proportions.
swift scripts/render-svg.swift brand/menubar.svg Packaging/MenuBarIcon.png 21 16
swift scripts/render-svg.swift brand/menubar.svg Packaging/MenuBarIcon@2x.png 43 32
echo "Wrote Packaging/AppIcon.icns and Packaging/MenuBarIcon{,@2x}.png"
