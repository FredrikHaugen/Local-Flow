#!/bin/bash
# Regenerate Packaging/THIRD_PARTY_NOTICES.txt from the pinned SPM packages
# (Package.resolved) plus the vendored whisper.cpp license.
# Re-run after changing dependencies or bumping WHISPER_VERSION.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -d .build/checkouts ] || swift package resolve
OUT=Packaging/THIRD_PARTY_NOTICES.txt

emit() { # $1 = heading, $2 = license file
    printf '%s\n%s\n%s\n\n' "================================================================" "$1" \
        "================================================================"
    cat "$2"
    printf '\n\n'
}

{
    echo "peluni includes the following third-party software. Each is"
    echo "distributed under the license reproduced below."
    echo
    emit "whisper.cpp $(sed -n 's/^WHISPER_VERSION := //p' Makefile)" Packaging/licenses/whisper.cpp.LICENSE
    count=$(plutil -extract pins raw Package.resolved)
    for ((i = 0; i < count; i++)); do
        id=$(plutil -extract "pins.$i.identity" raw Package.resolved)
        ver=$(plutil -extract "pins.$i.state.version" raw Package.resolved 2>/dev/null \
              || plutil -extract "pins.$i.state.revision" raw Package.resolved)
        # Checkout dirs use the repo's casing; APFS is case-insensitive so the identity path resolves.
        lic=$(find ".build/checkouts/$id/" -maxdepth 1 -type f -iname 'licen[cs]e*' | sort | head -1)
        [ -n "$lic" ] || { echo "ERROR: no license file for $id in .build/checkouts/$id" >&2; exit 1; }
        emit "$id $ver" "$lic"
        # Apache-2.0 §4(d): a package's NOTICE file must ship alongside its license.
        notice=$(find ".build/checkouts/$id/" -maxdepth 1 -type f -iname 'notice*' | sort | head -1)
        [ -z "$notice" ] || emit "$id $ver — NOTICE" "$notice"
    done
} > "$OUT"
echo "Wrote $OUT"
