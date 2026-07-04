#!/bin/bash
# Assemble dist/LocalFlow.app from the SPM release build.
set -euo pipefail
cd "$(dirname "$0")/.."

ARCH=arm64
BUILD_DIR=".build/${ARCH}-apple-macosx/release"
APP="dist/LocalFlow.app"
IDENTITY="${CODESIGN_IDENTITY:-}"

swift build -c release --arch $ARCH

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$APP/Contents/Frameworks"
cp "$BUILD_DIR/LocalFlowApp" "$APP/Contents/MacOS/LocalFlow"
cp Packaging/Info.plist "$APP/Contents/Info.plist"

# Embed the dynamic whisper framework (binaryTarget) and make sure the rpath exists.
if [ -d "$BUILD_DIR/whisper.framework" ]; then
    cp -R "$BUILD_DIR/whisper.framework" "$APP/Contents/Frameworks/"
else
    # SPM sometimes materializes artifact frameworks under artifacts/; find it.
    FW=$(find .build/artifacts -type d -name "whisper.framework" -path "*macos*" | head -1)
    if [ -z "$FW" ] && [ -d "Vendor/whisper.xcframework/macos-arm64_x86_64/whisper.framework" ]; then
        # Path-based binaryTarget: swift build may not copy the artifact at all;
        # fall back to the vendored xcframework slice directly.
        FW="Vendor/whisper.xcframework/macos-arm64_x86_64/whisper.framework"
    fi
    [ -n "$FW" ] || { echo "ERROR: whisper.framework not found"; exit 1; }
    cp -R "$FW" "$APP/Contents/Frameworks/"
fi
install_name_tool -add_rpath "@executable_path/../Frameworks" "$APP/Contents/MacOS/LocalFlow" 2>/dev/null || true

# Prefer a stable identity so TCC grants survive rebuilds; fall back to ad-hoc.
if [ -z "$IDENTITY" ] && security find-identity -v -p codesigning 2>/dev/null | grep -q "LocalFlow Dev"; then
    IDENTITY="LocalFlow Dev"
fi
if [ -n "$IDENTITY" ]; then
    codesign --force --options runtime --sign "$IDENTITY" "$APP/Contents/Frameworks/whisper.framework"
    codesign --force --options runtime --sign "$IDENTITY" "$APP"
    echo "Signed with: $IDENTITY"
else
    codesign --force --sign - "$APP/Contents/Frameworks/whisper.framework"
    codesign --force --sign - "$APP"
    echo "WARNING: ad-hoc signed. Accessibility grants will reset on every rebuild," \
         "and macOS 26 may drop synthesized events. Run 'make cert' once to fix."
fi
echo "Built $APP"
