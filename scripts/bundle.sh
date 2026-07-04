#!/bin/bash
# Assemble dist/LocalFlow.app from an xcodebuild Release build.
#
# NOTE: this must use `xcodebuild`, not `swift build`. mlx-swift's own README
# states that SwiftPM command-line builds cannot compile MLX's Metal shaders;
# only `xcodebuild` (which builds SPM packages directly) produces a working
# metallib. A `swift build`-produced binary fails LLM cleanup at runtime with
# "Failed to load the default metallib". `swift build` remains fine for the
# dev/test loop (see Makefile's `build` target) since that never runs MLX
# inference; only bundling for distribution needs xcodebuild.
set -euo pipefail
cd "$(dirname "$0")/.."

ARCH=arm64
APP="dist/LocalFlow.app"
IDENTITY="${CODESIGN_IDENTITY:-}"

xcodebuild build -scheme LocalFlowApp -configuration Release \
    -destination 'platform=macOS,arch='"$ARCH" -derivedDataPath .build/xc \
    -skipPackagePluginValidation -skipMacroValidation \
    -quiet
PRODUCTS=".build/xc/Build/Products/Release"

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources" "$APP/Contents/Frameworks"
cp "$PRODUCTS/LocalFlowApp" "$APP/Contents/MacOS/LocalFlow"
cp Packaging/Info.plist "$APP/Contents/Info.plist"

# Embed the dynamic whisper framework (binaryTarget) and make sure the rpath exists.
if [ -d "$PRODUCTS/PackageFrameworks/whisper.framework" ]; then
    FW="$PRODUCTS/PackageFrameworks/whisper.framework"
elif [ -d "$PRODUCTS/whisper.framework" ]; then
    FW="$PRODUCTS/whisper.framework"
else
    FW=$(find .build/xc/Build/Products -name "whisper.framework" -not -path "*dSYM*" | head -1)
    if [ -z "$FW" ]; then
        # SPM sometimes materializes artifact frameworks under artifacts/; find it.
        FW=$(find .build/artifacts -type d -name "whisper.framework" -path "*macos*" 2>/dev/null | head -1)
    fi
    if [ -z "$FW" ] && [ -d "Vendor/whisper.xcframework/macos-arm64_x86_64/whisper.framework" ]; then
        # Path-based binaryTarget: build may not copy the artifact at all;
        # fall back to the vendored xcframework slice directly.
        FW="Vendor/whisper.xcframework/macos-arm64_x86_64/whisper.framework"
    fi
fi
[ -n "$FW" ] || { echo "ERROR: whisper.framework not found"; exit 1; }
cp -R "$FW" "$APP/Contents/Frameworks/"

# Copy every SPM resource bundle (MLX's Metal shader bundle, swift-transformers,
# swift-crypto, etc.) into Resources so runtime Bundle lookup works from the .app.
for b in "$PRODUCTS"/*.bundle; do
    [ -d "$b" ] && cp -R "$b" "$APP/Contents/Resources/"
done

install_name_tool -add_rpath "@executable_path/../Frameworks" "$APP/Contents/MacOS/LocalFlow" 2>/dev/null || true

# Prefer a stable identity so TCC grants survive rebuilds; fall back to ad-hoc.
if [ -z "$IDENTITY" ] && security find-identity -v -p codesigning 2>/dev/null | grep -q "LocalFlow Dev"; then
    IDENTITY="LocalFlow Dev"
fi
if [ -n "$IDENTITY" ]; then
    codesign --force --options runtime --sign "$IDENTITY" "$APP/Contents/Frameworks/whisper.framework"
    for b in "$APP/Contents/Resources/"*.bundle; do
        [ -d "$b" ] && codesign --force --options runtime --sign "$IDENTITY" "$b"
    done
    codesign --force --options runtime --sign "$IDENTITY" "$APP"
    echo "Signed with: $IDENTITY"
else
    codesign --force --sign - "$APP/Contents/Frameworks/whisper.framework"
    for b in "$APP/Contents/Resources/"*.bundle; do
        [ -d "$b" ] && codesign --force --sign - "$b"
    done
    codesign --force --sign - "$APP"
    echo "WARNING: ad-hoc signed. Accessibility grants will reset on every rebuild," \
         "and macOS 26 may drop synthesized events. Run 'make cert' once to fix."
fi
echo "Built $APP"
