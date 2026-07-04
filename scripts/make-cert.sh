#!/bin/bash
# Best-effort: create a self-signed codesigning cert "LocalFlow Dev" in the login keychain.
# A stable signing identity keeps TCC (Accessibility/Microphone) grants across rebuilds.
set -euo pipefail

if security find-identity -v -p codesigning | grep -q "LocalFlow Dev"; then
    echo "Identity 'LocalFlow Dev' already exists."; exit 0
fi

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cat > "$TMP/ext.cnf" <<'CNF'
[req]
distinguished_name = dn
x509_extensions = v3
prompt = no
[dn]
CN = LocalFlow Dev
[v3]
keyUsage = critical,digitalSignature
extendedKeyUsage = critical,codeSigning
basicConstraints = critical,CA:false
CNF
openssl req -x509 -newkey rsa:2048 -days 3650 -nodes \
    -keyout "$TMP/key.pem" -out "$TMP/cert.pem" -config "$TMP/ext.cnf"
# Explicit legacy algorithms: OpenSSL 3.x defaults (AES + SHA-256 MAC) are
# rejected by macOS's keychain importer ("MAC verification failed").
openssl pkcs12 -export -inkey "$TMP/key.pem" -in "$TMP/cert.pem" \
    -name "LocalFlow Dev" -out "$TMP/dev.p12" -passout pass:localflow \
    -certpbe PBE-SHA1-3DES -keypbe PBE-SHA1-3DES -macalg sha1
security import "$TMP/dev.p12" -k "$HOME/Library/Keychains/login.keychain-db" \
    -P localflow -T /usr/bin/codesign
echo ""
echo "Imported. macOS will show a GUI prompt the first time codesign uses this key —"
echo "enter your login password and click 'Always Allow'."
echo "If codesign later reports 'unable to build chain', open Keychain Access,"
echo "double-click 'LocalFlow Dev' → Trust → Code Signing: Always Trust."
