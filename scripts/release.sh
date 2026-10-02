#!/bin/bash
# Build, sign (Developer ID + hardened runtime), notarize and staple peluni,
# then package a signed, notarized, stapled DMG and re-verify it as a user
# would receive it.
#
# Credentials come only from a notarytool keychain profile (never from this
# file). One-time setup:
#   xcrun notarytool store-credentials peluni-notary --apple-id <email> --team-id <TEAMID>
# Env overrides: NOTARY_PROFILE (default peluni-notary), DEVELOPER_ID (identity name).
set -euo pipefail
cd "$(dirname "$0")/.."

die() { echo "ERROR: $*" >&2; exit 1; }

NOTARY_PROFILE="${NOTARY_PROFILE:-peluni-notary}"
PLIST=Packaging/Info.plist
VERSION=$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$PLIST" 2>/dev/null || true)
BUILD=$(/usr/libexec/PlistBuddy -c 'Print CFBundleVersion' "$PLIST" 2>/dev/null || true)
APP="dist/peluni.app"
DMG="dist/peluni-$VERSION.dmg"

# --- Fail fast: everything checkable before the multi-minute build. ---
# Collect every problem so one run tells you everything to fix.
problems=()
for tool in codesign ditto hdiutil plutil shasum spctl syspolicy_check; do
    command -v "$tool" >/dev/null || problems+=("required tool '$tool' not found")
done
xcrun --find notarytool >/dev/null 2>&1 || problems+=("xcrun notarytool not found (install Xcode 13+)")
xcrun --find stapler >/dev/null 2>&1 || problems+=("xcrun stapler not found")
[ -n "$VERSION" ] || problems+=("couldn't read CFBundleShortVersionString from $PLIST")
[[ "$BUILD" =~ ^[0-9]+$ ]] || problems+=("CFBundleVersion in $PLIST must be numeric, got '$BUILD'")

# Untracked files count: bundle.sh compiles the whole working tree, so a stray
# new source file would ship in a release no commit can reproduce.
if [ -n "$(git status --porcelain --untracked-files=normal)" ]; then
    problems+=("working tree not clean (including untracked files) — release builds must come from a committed tree")
fi

IDENTITY="${DEVELOPER_ID:-$(security find-identity -v -p codesigning \
    | sed -n 's/.*"\(Developer ID Application: [^"]*\)".*/\1/p' | head -1)}"
if [ -z "$IDENTITY" ]; then
    problems+=("no 'Developer ID Application' signing identity in the keychain.
    Create one at developer.apple.com → Certificates → Developer ID Application
    (Account Holder role), or set DEVELOPER_ID to its exact name.")
elif ! security find-identity -v -p codesigning | grep -qF "\"$IDENTITY\""; then
    problems+=("signing identity '$IDENTITY' is not a valid identity in the keychain")
fi

if ! xcrun notarytool history --keychain-profile "$NOTARY_PROFILE" >/dev/null 2>&1; then
    problems+=("notarytool keychain profile '$NOTARY_PROFILE' is missing or its credentials are invalid
    (an expired or revoked app-specific password looks the same). Create or refresh it with:
      xcrun notarytool store-credentials $NOTARY_PROFILE --apple-id <email> --team-id <TEAMID>")
fi

if [ "${#problems[@]}" -gt 0 ]; then
    for p in "${problems[@]}"; do echo "ERROR: $p" >&2; done
    exit 1
fi

echo "==> Releasing peluni $VERSION ($BUILD)"
echo "    identity: $IDENTITY"
echo "    profile:  $NOTARY_PROFILE"

# Submit $1, wait, and on anything but Accepted save + print the raw rejection log.
notarize() {
    local file="$1" out id status log
    echo "==> Notarizing $(basename "$file") (this usually takes a few minutes)"
    out=$(xcrun notarytool submit "$file" --keychain-profile "$NOTARY_PROFILE" \
            --wait --output-format json) || true
    id=$(plutil -extract id raw -o - - <<<"$out" 2>/dev/null || true)
    status=$(plutil -extract status raw -o - - <<<"$out" 2>/dev/null || true)
    log="dist/notary-log-${id:-unknown}.json"
    if [ "$status" != "Accepted" ]; then
        echo "$out" >&2
        if [ -n "$id" ]; then
            xcrun notarytool log "$id" "$log" --keychain-profile "$NOTARY_PROFILE" || true
            echo "---- notarytool log $id ----" >&2
            cat "$log" >&2 || true
            echo "----" >&2
            echo "Rejection log saved to $log — hand this file over verbatim when debugging." >&2
        fi
        die "notarization of $(basename "$file") ended with status '${status:-unknown}'"
    fi
    # Keep the log for accepted submissions too: Apple can accept with warnings.
    xcrun notarytool log "$id" "$log" --keychain-profile "$NOTARY_PROFILE" >/dev/null 2>&1 || true
    echo "    accepted (submission $id, log: $log)"
}

# --- 1. Build + sign the app in release mode, verify locally ---
CODESIGN_IDENTITY="$IDENTITY" SIGN_MODE=release bash scripts/bundle.sh
bash scripts/verify-signing.sh "$APP" --release
# Apple's own pre-submission check (macOS 14+) catches what our verifier doesn't know about.
syspolicy_check notary-submission "$APP"

# --- 2. Notarize + staple the app ---
ZIP="dist/peluni-$VERSION-notarize.zip"
rm -f "$ZIP"
ditto -c -k --keepParent "$APP" "$ZIP"
notarize "$ZIP"
rm -f "$ZIP"
xcrun stapler staple "$APP"

# --- 3. DMG from the stapled app ---
STAGE=$(mktemp -d)
MOUNT=""
cleanup() {
    if [ -n "$MOUNT" ]; then
        hdiutil detach "$MOUNT" -quiet >/dev/null 2>&1 || true
        rmdir "$MOUNT" 2>/dev/null || true
    fi
    rm -rf "$STAGE"
}
trap cleanup EXIT

ditto "$APP" "$STAGE/peluni.app"
ln -s /Applications "$STAGE/Applications"
cp LICENSE "$STAGE/LICENSE.txt"
rm -f "$DMG" "$DMG.sha256"
hdiutil create -volname "peluni $VERSION" -srcfolder "$STAGE" -fs HFS+ -format UDZO -ov "$DMG"
codesign --force --timestamp --sign "$IDENTITY" "$DMG"

# --- 4. Notarize + staple the DMG ---
notarize "$DMG"
xcrun stapler staple "$DMG"

# --- 5. Verify the DMG as a downloading user receives it ---
hdiutil verify "$DMG"
xcrun stapler validate "$DMG"
spctl -a -vvv -t open --context context:primary-signature "$DMG"

MOUNT=$(mktemp -d)
hdiutil attach "$DMG" -readonly -nobrowse -noautoopen -mountpoint "$MOUNT" -quiet
M_APP="$MOUNT/peluni.app"
[ -d "$M_APP" ] || die "DMG has no peluni.app at its root"
[ "$(readlink "$MOUNT/Applications")" = "/Applications" ] || die "DMG Applications symlink is missing or wrong"
m_ver=$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$M_APP/Contents/Info.plist")
m_build=$(/usr/libexec/PlistBuddy -c 'Print CFBundleVersion' "$M_APP/Contents/Info.plist")
[ "$m_ver" = "$VERSION" ] && [ "$m_build" = "$BUILD" ] \
    || die "DMG app is $m_ver ($m_build), expected $VERSION ($BUILD)"
bash scripts/verify-signing.sh "$M_APP" --release
xcrun stapler validate "$M_APP"
spctl -a -vvv -t exec "$M_APP"
# Gatekeeper's view of a downloaded copy, not just the build machine's.
syspolicy_check distribution "$M_APP"
hdiutil detach "$MOUNT" -quiet && rmdir "$MOUNT" && MOUNT=""

(cd dist && shasum -a 256 "$(basename "$DMG")" > "$(basename "$DMG").sha256")
echo "==> Done: $DMG"
cat "$DMG.sha256"
