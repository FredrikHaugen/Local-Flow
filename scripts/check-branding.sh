#!/bin/bash
# The product is "peluni". Fail on any leftover old name. Pass pathspecs to check part of the
# repo (e.g. `scripts/check-branding.sh marketing-page`); no args checks everything.
# Allowed: historical plans, the migration that has to name the old folder and bundle ID,
# and lines that say "(formerly LocalFlow)" on purpose.
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -gt 0 ] || set -- .
hits=$(git grep --untracked -nIi -e 'localflow' -e 'local flow' -e 'local-flow' -- "$@" \
    ':!docs/superpowers/plans/' \
    ':!Sources/PeluniCore/LegacyRename.swift' \
    ':!Tests/PeluniCoreTests/LegacyRenameTests.swift' \
    | grep -v '(formerly LocalFlow)' || true)
if [ -n "$hits" ]; then
    echo "ERROR: old product name found (it's \"peluni\" now):"
    echo "$hits"
    exit 1
fi
echo "Branding OK: no LocalFlow references."
