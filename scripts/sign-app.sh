#!/bin/bash
# Sign peluni.app inside-out: loose nested Mach-O first, then frameworks,
# then the app (with entitlements), so each outer seal covers already-final
# inner code. Never uses --deep, which would stamp the app's flags and
# entitlements onto nested code.
# Usage: sign-app.sh <App.app> <identity|-> <release|dev|adhoc>
set -euo pipefail

APP="${1:?}"; IDENTITY="${2:?}"; MODE="${3:?}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENTITLEMENTS="$ROOT/Packaging/peluni.entitlements"

case "$MODE" in
    release) FLAGS=(--options runtime --timestamp) ;;
    dev)     FLAGS=(--options runtime --timestamp=none)
             # Self-signed cert has no Team ID; without this, library validation blocks whisper.framework.
             ENTITLEMENTS="$ROOT/Packaging/peluni.dev.entitlements" ;;
    adhoc)   FLAGS=(--timestamp=none) ;;  # unchanged from the previous ad-hoc fallback
    *) echo "sign-app.sh: unknown mode '$MODE'" >&2; exit 2 ;;
esac

sign() { codesign --force --sign "$IDENTITY" "${FLAGS[@]}" "$@"; }

# 1. Loose Mach-O (dylibs, helpers, plugins) outside framework bundles and the main executable.
while IFS= read -r -d '' f; do
    case "$f" in *.framework/*|"$APP/Contents/MacOS/"*) continue ;; esac
    if file -b "$f" | grep -q 'Mach-O'; then sign "$f"; fi
done < <(find "$APP/Contents" -type f -print0)

# 2. Frameworks: signing the bundle signs its current version's binary and resources.
for fw in "$APP/Contents/Frameworks/"*.framework; do
    [ -d "$fw" ] && sign "$fw"
done

# 3. The app last.
sign --entitlements "$ENTITLEMENTS" "$APP"
