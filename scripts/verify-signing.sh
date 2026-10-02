#!/bin/bash
# Check that every piece of code in the app is signed the way notarization
# requires, so signing mistakes show up in seconds instead of after a notary
# round-trip.
# Usage: verify-signing.sh <App.app> [--release]
#   default:   structure + hardened runtime + entitlements (dev builds)
#   --release: additionally Developer ID authority, secure timestamp, same Team ID everywhere
set -uo pipefail

APP="${1:?usage: verify-signing.sh <App.app> [--release]}"
MODE="${2:-}"
fail=0
err() { echo "FAIL: $*" >&2; fail=1; }

codesign --verify --deep --strict --verbose=2 "$APP" 2>&1 | sed 's/^/  /'
[ "${PIPESTATUS[0]}" -eq 0 ] || err "$APP: codesign --verify --deep --strict failed (see output above)"

APP_TEAM=$(codesign -dv "$APP" 2>&1 | sed -n 's/^TeamIdentifier=//p')

check_code() { # $1 = Mach-O file
    local info team
    info=$(codesign -dv --verbose=4 "$1" 2>&1) || { err "$1: not signed"; return; }
    grep -q 'flags=.*runtime' <<<"$info" || err "$1: hardened runtime not enabled"
    if [ "$MODE" = "--release" ]; then
        grep -q '^Authority=Developer ID Application:' <<<"$info" \
            || err "$1: not signed with a Developer ID Application certificate"
        grep -q '^Timestamp=' <<<"$info" || err "$1: no secure timestamp"
        team=$(sed -n 's/^TeamIdentifier=//p' <<<"$info")
        [ "$team" = "$APP_TEAM" ] \
            || err "$1: TeamIdentifier '$team' != app's '$APP_TEAM' (library validation will refuse to load it)"
    fi
}

while IFS= read -r -d '' f; do
    if file -b "$f" | grep -q 'Mach-O'; then check_code "$f"; fi
done < <(find "$APP/Contents" -type f -print0)

ents=$(codesign -d --entitlements - --xml "$APP" 2>/dev/null)
grep -q 'com.apple.security.device.audio-input' <<<"$ents" \
    || err "$APP: missing com.apple.security.device.audio-input (mic is silently denied under hardened runtime)"
if grep -q 'com.apple.security.get-task-allow' <<<"$ents"; then
    err "$APP: has com.apple.security.get-task-allow (notarization rejects debug entitlements)"
fi

[ "$fail" -eq 0 ] && echo "Signing OK: $APP${MODE:+ ($MODE)}"
exit "$fail"
