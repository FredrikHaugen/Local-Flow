#!/bin/bash
# Fail if README's Requirements section disagrees with the project's real
# build settings, or if those settings disagree with each other.
set -euo pipefail
cd "$(dirname "$0")/.."

fail() { echo "check-requirements: $*" >&2; exit 1; }

pkg_macos=$(sed -n 's/.*\.macOS(\.v\([0-9][0-9]*\)).*/\1/p' Package.swift)
plist_macos=$(/usr/libexec/PlistBuddy -c 'Print LSMinimumSystemVersion' Packaging/Info.plist)
bundle_arch=$(sed -n 's/^ARCH=//p' scripts/bundle.sh)
tools=$(sed -n 's/^\/\/ swift-tools-version: *//p' Package.swift)
whisper=$(sed -n 's/^WHISPER_VERSION := //p' Makefile)

[ -n "$pkg_macos" ] || fail "couldn't read .macOS(.vNN) from Package.swift"
[ "${plist_macos%%.*}" = "$pkg_macos" ] \
    || fail "Package.swift says macOS $pkg_macos but Info.plist LSMinimumSystemVersion is $plist_macos"
grep -q -- "--arch $bundle_arch" Makefile \
    || fail "bundle.sh builds $bundle_arch but Makefile's swift build uses a different --arch"

section=$(awk '/^## Requirements/{f=1; next} /^## /{f=0} f' README.md)
[ -n "$section" ] || fail "README.md has no '## Requirements' section"

grep -q "macOS $pkg_macos " <<<"$section" || fail "README Requirements must say 'macOS $pkg_macos …'"
if [ "$bundle_arch" = "arm64" ]; then
    grep -q "Apple Silicon" <<<"$section" || fail "README Requirements must say Apple Silicon (build is arm64-only)"
fi
grep -q "Swift $tools" <<<"$section" || fail "README Requirements must mention Swift $tools (swift-tools-version)"
grep -q "whisper.cpp $whisper" <<<"$section" || fail "README Requirements must mention whisper.cpp $whisper"

# Speech-model disk sizes, formatted the way README states them (decimal units).
sizes=$(sed -n 's/.*id: "\([^"]*\)".*sizeBytes: \([0-9_]*\).*/\1 \2/p' Sources/PeluniCore/ModelCatalog.swift | tr -d _)
[ -n "$sizes" ] || fail "couldn't read model sizes from ModelCatalog.swift"
fmt() { awk -v b="$1" 'BEGIN { if (b < 1e9) printf "%d MB", b/1e6 + 0.5; else printf "%.1f GB", b/1e9 }'; }
smallest=$(fmt "$(sort -k2 -n <<<"$sizes" | head -1 | cut -d' ' -f2)")
largest=$(fmt "$(sort -k2 -n <<<"$sizes" | tail -1 | cut -d' ' -f2)")
base=$(fmt "$(awk '$1 == "base" { print $2 }' <<<"$sizes")")
for s in "$smallest" "$largest" "$base"; do
    grep -q "$s" <<<"$section" || fail "README Requirements must state speech model size '$s' (from ModelCatalog.swift)"
done

echo "README requirements match project settings (macOS $pkg_macos+, $bundle_arch, Swift $tools, whisper.cpp $whisper, models ${smallest}–${largest}, base ${base})"
