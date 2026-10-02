.PHONY: build test bundle run cert clean vendor check-vendor check-requirements check-branding release

WHISPER_VERSION := v1.9.1
WHISPER_ZIP_URL := https://github.com/ggml-org/whisper.cpp/releases/download/$(WHISPER_VERSION)/whisper-$(WHISPER_VERSION)-xcframework.zip
WHISPER_SHA256  := 8c3ecbe73f48b0cb9318fc3058264f951ab336fd530e82c4ccdd2298d1311a4c

# Fetch the prebuilt whisper.cpp xcframework and vendor it locally (gitignored).
# Idempotent: no-ops if Vendor/whisper.xcframework already exists.
vendor:
	@if [ -d Vendor/whisper.xcframework ]; then \
		echo "Vendor/whisper.xcframework already present; skipping."; \
	else \
		set -e; \
		mkdir -p Vendor; \
		TMP=$$(mktemp -d); \
		echo "Downloading $(WHISPER_ZIP_URL)..."; \
		curl -L --fail -o "$$TMP/whisper.zip" "$(WHISPER_ZIP_URL)"; \
		echo "Verifying checksum..."; \
		ACTUAL=$$(shasum -a 256 "$$TMP/whisper.zip" | awk '{print $$1}'); \
		if [ "$$ACTUAL" != "$(WHISPER_SHA256)" ]; then \
			echo "ERROR: checksum mismatch for whisper.zip"; \
			echo "  expected: $(WHISPER_SHA256)"; \
			echo "  actual:   $$ACTUAL"; \
			rm -rf "$$TMP"; \
			exit 1; \
		fi; \
		echo "Checksum OK."; \
		unzip -q "$$TMP/whisper.zip" -d "$$TMP"; \
		rm -rf Vendor/whisper.xcframework; \
		mv "$$TMP/build-apple/whisper.xcframework" Vendor/whisper.xcframework; \
		rm -rf "$$TMP"; \
		echo "Vendored whisper.xcframework -> Vendor/whisper.xcframework"; \
	fi

# Fail loudly (with a hint) instead of letting swift build choke on a missing local binaryTarget path.
check-vendor:
	@if [ ! -d Vendor/whisper.xcframework ]; then \
		echo "ERROR: Vendor/whisper.xcframework is missing. Run 'make vendor' first."; \
		exit 1; \
	fi

# swift build remains the dev/test loop build; it cannot compile MLX's Metal
# shaders (see mlx-swift README), so it must never be used for the bundled app.
# `make bundle` uses xcodebuild instead — see scripts/bundle.sh.
build: check-vendor
	swift build --arch arm64

check-requirements:
	@bash scripts/check-requirements.sh

check-branding:
	@bash scripts/check-branding.sh

test: check-vendor check-requirements check-branding
	swift test

bundle: check-vendor
	bash scripts/bundle.sh

# One command from a fresh clone: vendor and cert are no-ops once done. Quits a
# running peluni first, otherwise `open` just re-activates the old build.
run: vendor cert bundle
	@if pgrep -x peluni >/dev/null; then \
		echo "Quitting running peluni..."; \
		pkill -x peluni; \
		while pgrep -x peluni >/dev/null; do sleep 0.2; done; \
	fi
	open dist/peluni.app

# Developer ID sign + notarize + staple + DMG. Needs a Developer ID Application
# identity and a notarytool keychain profile — see scripts/release.sh header.
release: check-vendor
	bash scripts/release.sh

cert:
	bash scripts/make-cert.sh

clean:
	rm -rf .build dist
