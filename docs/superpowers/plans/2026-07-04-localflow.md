# LocalFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fully-local macOS menu-bar dictation app: hold Right Option anywhere → speak → whisper.cpp transcribes on-device → local MLX LLM cleans the text → result is pasted into the focused app. Zero network calls except user-initiated model downloads.

**Architecture:** SPM executable package (no .xcodeproj) with a pure-logic `LocalFlowCore` library (TDD) and a `LocalFlowApp` executable (SwiftUI MenuBarExtra + services). whisper.cpp is consumed as the official prebuilt xcframework via SPM binaryTarget; the LLM runs via mlx-swift-lm. A script assembles and signs `LocalFlow.app`.

**Tech Stack:** Swift 6.3 toolchain (package tools-version 6.1), SwiftUI + AppKit, whisper.cpp v1.9.1 xcframework (Metal embedded), mlx-swift-lm 3.31.4 + swift-huggingface, AVAudioEngine, CGEvent/AX APIs, XCTest.

## Global Constraints

- Repo root: `/Users/figge/Dev/whispr-local`. All paths below are relative to it.
- App name **LocalFlow**, bundle ID **com.figge.LocalFlow**, version 0.1.0.
- Platform: **macOS 14.0+**, **arm64 only** (MLX requires Apple Silicon). Dev machine: macOS 26.5, M-series, Xcode 26.6.
- whisper.cpp binaryTarget URL: `https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.1/whisper-v1.9.1-xcframework.zip`, checksum `8c3ecbe73f48b0cb9318fc3058264f951ab336fd530e82c4ccdd2298d1311a4c`.
- MLX deps: `ml-explore/mlx-swift-lm` `.upToNextMinor(from: "3.31.4")` (products MLXLLM, MLXLMCommon, MLXHuggingFace); `huggingface/swift-huggingface` `.upToNextMinor(from: "0.9.0")` (product HuggingFace). Added only in Task 12, not before.
- `KeyboardShortcuts` `from: "3.0.1"` added only in Task 14.
- Data dirs: `~/Library/Application Support/LocalFlow/Models/whisper/` (ggml .bin files), `.../Models/llm/` (HF hub cache), `.../vocabulary.json`. Settings via `UserDefaults` (`@AppStorage`).
- Whisper model URLs: `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-<name>.bin`. Sizes: tiny 77,691,713 B; base 147,951,465 B; small 487,601,967 B; medium 1,533,763,059 B; large-v3-turbo 1,624,555,275 B. Default model: **base** (multilingual; user may dictate Norwegian). Language setting default **auto**.
- LLM default model ID: `mlx-community/Qwen3-4B-Instruct-2507-4bit` (2.28 GB). Light option: `mlx-community/Llama-3.2-1B-Instruct-4bit` (0.71 GB). Dense models only (mlx-swift-lm MoE is ~7× slow).
- `LocalFlowCore` MUST NOT import AppKit/SwiftUI/AVFoundation/whisper/MLX — Foundation only. All Core logic gets XCTest coverage BEFORE implementation (TDD).
- `LocalFlowApp` target uses `.swiftLanguageMode(.v5)` (C interop + AppKit callback friction); Core uses default v6.
- NO network I/O anywhere except: whisper model download, LLM hub download (both user-initiated in Models UI).
- A transcript is NEVER silently lost: every failure path ends in delivered text, clipboard + notification, or a visible error state.
- Commit after every green test cycle. Trailer on every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Run tests with `swift test` from repo root. Build app with `make bundle`; run with `make run`.
- Known context: this Mac has **zero codesigning identities**; macOS 26 (Tahoe) drops synthesized CGEvents from unsigned/ad-hoc *background daemons*. Our injector lives inside the bundled, signed (self-signed or ad-hoc) GUI app with Accessibility granted — Task 10 is the explicit spike verifying this works; if it fails, the documented fallback is a free Apple Development identity via Xcode.

## File Structure

```
Package.swift
Makefile
scripts/bundle.sh              # assemble + sign dist/LocalFlow.app
scripts/make-cert.sh           # best-effort self-signed "LocalFlow Dev" cert
Packaging/Info.plist           # bundle plist template
Sources/LocalFlowCore/
  DictationState.swift         # DictationPhase + DictationStateMachine
  HotKeyProcessor.swift        # ProcessorEvent/ProcessorAction/HotKeyProcessor
  VADTrimmer.swift
  HallucinationFilter.swift
  VocabularyEngine.swift       # VocabularyEntry + prompt builder + replacements
  CleanupPromptBuilder.swift   # CleanupLevel + prompts + output sanity guard
  ModelCatalog.swift           # WhisperModel + LLMModel catalogs (pure data)
Sources/LocalFlowApp/
  App/LocalFlowApp.swift       # @main, MenuBarExtra, Settings scene
  App/AppState.swift           # @MainActor observable: phase, history, wiring
  App/DictationController.swift
  Services/PermissionsService.swift
  Services/HotkeyMonitor.swift
  Services/AudioCaptureService.swift
  Services/TranscriptionEngine.swift
  Services/CleanupEngine.swift
  Services/TextInjector.swift
  Services/ModelManager.swift
  UI/OnboardingWindow.swift
  UI/OverlayPanel.swift        # NSPanel host
  UI/OverlayView.swift         # waveform pill
  UI/SettingsView.swift        # TabView shell
  UI/GeneralTab.swift  UI/ModelsTab.swift  UI/VocabularyTab.swift
  UI/PermissionsTab.swift  UI/AdvancedTab.swift
Tests/LocalFlowCoreTests/
  HotKeyProcessorTests.swift  DictationStateMachineTests.swift
  VADTrimmerTests.swift  HallucinationFilterTests.swift
  VocabularyEngineTests.swift  CleanupPromptBuilderTests.swift
  ModelCatalogTests.swift
Tests/LocalFlowIntegrationTests/
  TranscriptionSmokeTests.swift   # gated on model file presence
docs/TESTING.md                # manual TCC/injection checklist
README.md
```

---

### Task 1: Package skeleton, Core target, whisper binaryTarget resolves (P0)

**Files:**
- Create: `Package.swift`
- Create: `Sources/LocalFlowCore/ModelCatalog.swift`
- Create: `Sources/LocalFlowApp/App/LocalFlowApp.swift` (minimal stub, replaced in Task 2)
- Test: `Tests/LocalFlowCoreTests/ModelCatalogTests.swift`

**Interfaces:**
- Produces: `WhisperModel` struct (`id: String`, `displayName: String`, `fileName: String`, `url: URL`, `sizeBytes: Int64`, `isEnglishOnly: Bool`), `WhisperModel.catalog: [WhisperModel]`, `WhisperModel.default: WhisperModel` (base). Later tasks (8, 9) rely on these exact names.

- [ ] **Step 1: Write `Package.swift`**

```swift
// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "LocalFlow",
    platforms: [.macOS(.v14)],
    products: [
        .library(name: "LocalFlowCore", targets: ["LocalFlowCore"])
    ],
    targets: [
        .target(name: "LocalFlowCore"),
        .binaryTarget(
            name: "whisper",
            url: "https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.1/whisper-v1.9.1-xcframework.zip",
            checksum: "8c3ecbe73f48b0cb9318fc3058264f951ab336fd530e82c4ccdd2298d1311a4c"
        ),
        .executableTarget(
            name: "LocalFlowApp",
            dependencies: ["LocalFlowCore", "whisper"],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
        .testTarget(name: "LocalFlowCoreTests", dependencies: ["LocalFlowCore"]),
    ]
)
```

- [ ] **Step 2: Write the failing test**

`Tests/LocalFlowCoreTests/ModelCatalogTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class ModelCatalogTests: XCTestCase {
    func testCatalogContainsExpectedModels() {
        let ids = WhisperModel.catalog.map(\.id)
        XCTAssertEqual(ids, ["tiny", "base", "small", "medium", "large-v3-turbo"])
    }

    func testDefaultIsBase() {
        XCTAssertEqual(WhisperModel.default.id, "base")
    }

    func testURLAndFileNamePattern() {
        let base = WhisperModel.catalog.first { $0.id == "base" }!
        XCTAssertEqual(base.fileName, "ggml-base.bin")
        XCTAssertEqual(
            base.url.absoluteString,
            "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin")
        XCTAssertEqual(base.sizeBytes, 147_951_465)
        XCTAssertFalse(base.isEnglishOnly)
    }
}
```

- [ ] **Step 3: Write the minimal app stub** (so the package builds; real app in Task 2)

`Sources/LocalFlowApp/App/LocalFlowApp.swift`:

```swift
import SwiftUI

@main
struct LocalFlowApp: App {
    var body: some Scene {
        MenuBarExtra("LocalFlow", systemImage: "mic") {
            Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }
        }
    }
}
```

- [ ] **Step 4: Run test to verify it fails**

Run: `swift test 2>&1 | tail -5`
Expected: compile FAILURE — `cannot find 'WhisperModel' in scope`. (First run also downloads the 50 MB whisper xcframework — needs network.)

**Contingency:** if `swift build` fails with an error like *artifact ... does not contain a binary artifact / expected .xcframework* (the release zip nests the xcframework under `build-apple/`), vendor it locally instead: `mkdir -p Vendor && cd Vendor && curl -LO <the release URL> && unzip -q whisper-v1.9.1-xcframework.zip && mv build-apple/whisper.xcframework . && rm -rf build-apple whisper-v1.9.1-xcframework.zip` then change the binaryTarget to `.binaryTarget(name: "whisper", path: "Vendor/whisper.xcframework")` and add `Vendor/*.zip` to `.gitignore`. Commit the xcframework? No — add `Vendor/` to `.gitignore` and document the fetch in the Makefile (`make vendor`).

- [ ] **Step 5: Implement `ModelCatalog.swift`**

`Sources/LocalFlowCore/ModelCatalog.swift`:

```swift
import Foundation

public struct WhisperModel: Identifiable, Hashable, Sendable {
    public let id: String
    public let displayName: String
    public let sizeBytes: Int64
    public let isEnglishOnly: Bool

    public var fileName: String { "ggml-\(id).bin" }
    public var url: URL {
        URL(string: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/\(fileName)")!
    }

    public static let catalog: [WhisperModel] = [
        WhisperModel(id: "tiny", displayName: "Tiny (fast, rough)", sizeBytes: 77_691_713, isEnglishOnly: false),
        WhisperModel(id: "base", displayName: "Base (recommended start)", sizeBytes: 147_951_465, isEnglishOnly: false),
        WhisperModel(id: "small", displayName: "Small (best balance)", sizeBytes: 487_601_967, isEnglishOnly: false),
        WhisperModel(id: "medium", displayName: "Medium (high accuracy, slower)", sizeBytes: 1_533_763_059, isEnglishOnly: false),
        WhisperModel(id: "large-v3-turbo", displayName: "Large v3 Turbo (max accuracy)", sizeBytes: 1_624_555_275, isEnglishOnly: false),
    ]

    public static let `default` = catalog[1]
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `swift test 2>&1 | tail -5`
Expected: `Test Suite 'All tests' passed` (3 tests).

- [ ] **Step 7: Commit**

```bash
git add Package.swift Sources Tests
git commit -m "feat: SPM skeleton with whisper.cpp binaryTarget and model catalog"
```

---

### Task 2: Menu-bar app, bundle + signing scripts, Makefile (P0)

**Files:**
- Modify: `Sources/LocalFlowApp/App/LocalFlowApp.swift`
- Create: `Sources/LocalFlowApp/App/AppState.swift`
- Create: `Packaging/Info.plist`, `scripts/bundle.sh`, `scripts/make-cert.sh`, `Makefile`

**Interfaces:**
- Produces: `AppState` (`@MainActor final class AppState: ObservableObject`) with `@Published var phase: DictationPhase = .idle` placeholder as `String` until Task 5 (use `@Published var statusText: String = "Idle"`), and `static let shared = AppState()`. Task 3+ extend this class.
- Produces: `make bundle` → `dist/LocalFlow.app`; `make run` → launches it; `make test` → `swift test`; `make cert` → creates "LocalFlow Dev" identity (best-effort).

- [ ] **Step 1: Write `AppState.swift`**

```swift
import SwiftUI

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    @Published var statusText: String = "Idle"
}
```

- [ ] **Step 2: Replace the app stub**

`Sources/LocalFlowApp/App/LocalFlowApp.swift`:

```swift
import SwiftUI

@main
struct LocalFlowApp: App {
    @StateObject private var appState = AppState.shared

    var body: some Scene {
        MenuBarExtra {
            Text(appState.statusText)
            Divider()
            SettingsLink { Text("Settings…") }
                .keyboardShortcut(",")
            Divider()
            Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }
                .keyboardShortcut("q")
        } label: {
            Image(systemName: "mic")
        }

        Settings {
            Text("Settings placeholder") // replaced in Task 3
                .frame(width: 480, height: 320)
        }
    }
}
```

- [ ] **Step 3: Write `Packaging/Info.plist`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key><string>en</string>
    <key>CFBundleExecutable</key><string>LocalFlow</string>
    <key>CFBundleIdentifier</key><string>com.figge.LocalFlow</string>
    <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
    <key>CFBundleName</key><string>LocalFlow</string>
    <key>CFBundlePackageType</key><string>APPL</string>
    <key>CFBundleShortVersionString</key><string>0.1.0</string>
    <key>CFBundleVersion</key><string>1</string>
    <key>LSMinimumSystemVersion</key><string>14.0</string>
    <key>LSUIElement</key><true/>
    <key>NSMicrophoneUsageDescription</key>
    <string>LocalFlow records your voice while you hold the dictation hotkey, and transcribes it entirely on this Mac.</string>
    <key>NSHumanReadableCopyright</key><string>Local-only dictation. No data leaves this Mac.</string>
</dict>
</plist>
```

- [ ] **Step 4: Write `scripts/bundle.sh`**

```bash
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
```

- [ ] **Step 5: Write `scripts/make-cert.sh`**

```bash
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
openssl pkcs12 -export -inkey "$TMP/key.pem" -in "$TMP/cert.pem" \
    -name "LocalFlow Dev" -out "$TMP/dev.p12" -passout pass:localflow
security import "$TMP/dev.p12" -k "$HOME/Library/Keychains/login.keychain-db" \
    -P localflow -T /usr/bin/codesign
echo ""
echo "Imported. macOS will show a GUI prompt the first time codesign uses this key —"
echo "enter your login password and click 'Always Allow'."
echo "If codesign later reports 'unable to build chain', open Keychain Access,"
echo "double-click 'LocalFlow Dev' → Trust → Code Signing: Always Trust."
```

- [ ] **Step 6: Write `Makefile`**

```make
.PHONY: build test bundle run cert clean

build:
	swift build --arch arm64

test:
	swift test

bundle:
	bash scripts/bundle.sh

run: bundle
	open dist/LocalFlow.app

cert:
	bash scripts/make-cert.sh

clean:
	rm -rf .build dist
```

- [ ] **Step 7: Build, bundle, and verify manually**

Run: `chmod +x scripts/*.sh && make bundle`
Expected: `Built dist/LocalFlow.app` (ad-hoc warning is OK for now).

Run: `make run`
Expected: a mic icon appears in the menu bar; the menu shows "Idle", "Settings…", "Quit LocalFlow". No Dock icon (LSUIElement). Settings… opens a placeholder window. Quit works.

Run: `plutil -lint dist/LocalFlow.app/Contents/Info.plist && codesign -dv dist/LocalFlow.app 2>&1 | head -3`
Expected: plist OK; codesign shows the bundle is signed.

- [ ] **Step 8: Commit**

```bash
git add Sources Packaging scripts Makefile
git commit -m "feat: menu-bar app shell with bundle/sign scripts"
```

---

### Task 3: PermissionsService, onboarding window, Settings shell (P0)

**Files:**
- Create: `Sources/LocalFlowApp/Services/PermissionsService.swift`
- Create: `Sources/LocalFlowApp/UI/OnboardingWindow.swift`
- Create: `Sources/LocalFlowApp/UI/SettingsView.swift`, `UI/GeneralTab.swift`, `UI/ModelsTab.swift`, `UI/VocabularyTab.swift`, `UI/PermissionsTab.swift`, `UI/AdvancedTab.swift`
- Modify: `Sources/LocalFlowApp/App/LocalFlowApp.swift`, `App/AppState.swift`

**Interfaces:**
- Produces: `PermissionsService` (`@MainActor final class, ObservableObject`):
  - `@Published var micGranted: Bool`, `@Published var accessibilityGranted: Bool`
  - `var allGranted: Bool { micGranted && accessibilityGranted }`
  - `func refresh()`, `func requestMic() async`, `func promptAccessibility()` (uses `AXIsProcessTrustedWithOptions` with prompt), `func openSystemSettings(pane: PermissionPane)` (`enum PermissionPane { case microphone, accessibility }`), `func startPolling()` / `func stopPolling()` (1 s timer calling `refresh()`).
- Produces: `OnboardingWindowController` — `@MainActor final class`; `static func showIfNeeded(permissions: PermissionsService)` creates an `NSWindow` with `NSHostingView(rootView: OnboardingView(permissions:))`, activates app.
- Produces: `SettingsView` — `TabView` with the five tabs; each tab is a placeholder `Form` its own task fills in later. Tabs must exist with these exact type names: `GeneralTab`, `ModelsTab`, `VocabularyTab`, `PermissionsTab`, `AdvancedTab`.

- [ ] **Step 1: Write `PermissionsService.swift`**

```swift
import AVFoundation
import ApplicationServices
import AppKit

enum PermissionPane {
    case microphone, accessibility

    var url: URL {
        switch self {
        case .microphone:
            URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone")!
        case .accessibility:
            URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!
        }
    }
}

@MainActor
final class PermissionsService: ObservableObject {
    @Published var micGranted = false
    @Published var accessibilityGranted = false
    private var timer: Timer?

    var allGranted: Bool { micGranted && accessibilityGranted }

    init() { refresh() }

    func refresh() {
        micGranted = AVCaptureDevice.authorizationStatus(for: .audio) == .authorized
        accessibilityGranted = AXIsProcessTrusted()
    }

    func requestMic() async {
        _ = await AVCaptureDevice.requestAccess(for: .audio)
        refresh()
    }

    func promptAccessibility() {
        let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
        _ = AXIsProcessTrustedWithOptions(opts)
    }

    func openSystemSettings(pane: PermissionPane) {
        NSWorkspace.shared.open(pane.url)
    }

    func startPolling() {
        stopPolling()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.refresh() }
        }
    }

    func stopPolling() {
        timer?.invalidate()
        timer = nil
    }
}
```

- [ ] **Step 2: Write `OnboardingWindow.swift`**

```swift
import SwiftUI
import AppKit

struct OnboardingView: View {
    @ObservedObject var permissions: PermissionsService

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Welcome to LocalFlow").font(.title.bold())
            Text("Everything runs on this Mac. Two permissions are needed:")

            permissionRow(
                granted: permissions.micGranted,
                title: "Microphone",
                detail: "To hear you while you hold the hotkey."
            ) {
                Task { await permissions.requestMic() }
                permissions.openSystemSettings(pane: .microphone)
            }

            permissionRow(
                granted: permissions.accessibilityGranted,
                title: "Accessibility",
                detail: "To type the transcript into the app you're using."
            ) {
                permissions.promptAccessibility()
                permissions.openSystemSettings(pane: .accessibility)
            }

            if permissions.allGranted {
                Label("All set — hold Right Option (⌥) anywhere and speak.", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
            }
        }
        .padding(24)
        .frame(width: 460)
        .onAppear { permissions.startPolling() }
        .onDisappear { permissions.stopPolling() }
    }

    @ViewBuilder
    private func permissionRow(granted: Bool, title: String, detail: String,
                               action: @escaping () -> Void) -> some View {
        HStack(alignment: .top) {
            Image(systemName: granted ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(granted ? .green : .secondary)
                .font(.title2)
            VStack(alignment: .leading) {
                Text(title).font(.headline)
                Text(detail).font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if !granted { Button("Grant…", action: action) }
        }
    }
}

@MainActor
final class OnboardingWindowController {
    private static var window: NSWindow?

    static func showIfNeeded(permissions: PermissionsService) {
        permissions.refresh()
        guard !permissions.allGranted, window == nil else { return }
        let win = NSWindow(
            contentRect: .zero,
            styleMask: [.titled, .closable],
            backing: .buffered, defer: false)
        win.title = "LocalFlow Setup"
        win.contentView = NSHostingView(rootView: OnboardingView(permissions: permissions))
        win.center()
        win.isReleasedWhenClosed = false
        window = win
        win.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }
}
```

- [ ] **Step 3: Write the Settings shell**

`Sources/LocalFlowApp/UI/SettingsView.swift`:

```swift
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        TabView {
            GeneralTab().tabItem { Label("General", systemImage: "gear") }
            ModelsTab().tabItem { Label("Models", systemImage: "square.and.arrow.down") }
            VocabularyTab().tabItem { Label("Vocabulary", systemImage: "character.book.closed") }
            PermissionsTab().tabItem { Label("Permissions", systemImage: "lock.shield") }
            AdvancedTab().tabItem { Label("Advanced", systemImage: "wrench.and.screwdriver") }
        }
        .frame(width: 560, height: 420)
    }
}
```

Each tab file starts as a placeholder with its real name, e.g. `UI/GeneralTab.swift`:

```swift
import SwiftUI

struct GeneralTab: View {
    var body: some View {
        Form { Text("General settings arrive with the hotkey task.") }
            .formStyle(.grouped)
    }
}
```

(Same pattern for `ModelsTab`, `VocabularyTab`, `AdvancedTab` with one-line placeholders.)

`UI/PermissionsTab.swift` is real immediately:

```swift
import SwiftUI

struct PermissionsTab: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        Form {
            Section("Required permissions") {
                row(granted: appState.permissions.micGranted, name: "Microphone",
                    pane: .microphone)
                row(granted: appState.permissions.accessibilityGranted, name: "Accessibility",
                    pane: .accessibility)
            }
        }
        .formStyle(.grouped)
        .onAppear { appState.permissions.startPolling() }
        .onDisappear { appState.permissions.stopPolling() }
    }

    @ViewBuilder
    private func row(granted: Bool, name: String, pane: PermissionPane) -> some View {
        HStack {
            Image(systemName: granted ? "checkmark.circle.fill" : "xmark.circle")
                .foregroundStyle(granted ? .green : .red)
            Text(name)
            Spacer()
            Button("Open System Settings") {
                appState.permissions.openSystemSettings(pane: pane)
            }
        }
    }
}
```

- [ ] **Step 4: Wire into `AppState` and the app**

`AppState.swift` becomes:

```swift
import SwiftUI

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    @Published var statusText: String = "Idle"
    let permissions = PermissionsService()
}
```

`LocalFlowApp.swift` — add onboarding trigger and environment object; `MenuBarExtra` label closure gains `.onAppear`:

```swift
        } label: {
            Image(systemName: "mic")
                .onAppear {
                    OnboardingWindowController.showIfNeeded(permissions: appState.permissions)
                }
        }

        Settings {
            SettingsView().environmentObject(appState)
        }
```

- [ ] **Step 5: Build and verify manually**

Run: `make run`
Expected: on first launch (no permissions yet) the Setup window appears listing both permissions with red/empty markers. Clicking "Grant…" for Microphone triggers the system mic prompt (after next task actually uses the mic, the prompt may defer — opening the Settings pane is the reliable path). The Accessibility "Grant…" opens the system prompt/pane. Once both are granted in System Settings, the rows flip to green checkmarks within ~1 s (polling). Settings… shows all five tabs; Permissions tab mirrors live status.

Note: with ad-hoc signing, granting Accessibility now is fine for testing but WILL reset after the next rebuild — this is expected until `make cert` + re-grant, and is part of why Task 10 is a spike.

- [ ] **Step 6: Commit**

```bash
git add Sources
git commit -m "feat: permissions service, onboarding window, settings shell"
```

---

### Task 4: Core — HotKeyProcessor state machine (P1, TDD)

**Files:**
- Create: `Sources/LocalFlowCore/HotKeyProcessor.swift`
- Test: `Tests/LocalFlowCoreTests/HotKeyProcessorTests.swift`

**Interfaces:**
- Produces (Task 6 consumes these exact types):

```swift
public enum ProcessorEvent: Equatable, Sendable {
    case targetDown(at: TimeInterval)   // Right Option pressed
    case targetUp(at: TimeInterval)     // Right Option released
    case escape
    case otherKeyDown(at: TimeInterval)
    case mouseDown(at: TimeInterval)
    case tapWindowExpired(at: TimeInterval)
}
public enum ProcessorAction: Equatable, Sendable {
    case startRecording, stopAndTranscribe, cancelRecording, none
}
public struct HotKeyProcessor: Sendable {
    public enum State: Equatable, Sendable {
        case idle
        case pressAndHold(startedAt: TimeInterval)
        case tapPending(releasedAt: TimeInterval)  // quick tap; recording continues awaiting 2nd tap
        case locked
    }
    public private(set) var state: State
    public var doubleTapWindow: TimeInterval   // default 0.3
    public var minHoldDuration: TimeInterval   // default 0.35
    public init()
    public mutating func handle(_ event: ProcessorEvent) -> ProcessorAction
}
```

**Semantics (the test suite IS this table):**

| State | Event | New state | Action |
|---|---|---|---|
| idle | targetDown(t) | pressAndHold(t) | startRecording |
| idle | anything else | idle | none |
| pressAndHold(s) | targetUp(t), t−s ≥ minHold | idle | stopAndTranscribe |
| pressAndHold(s) | targetUp(t), t−s < minHold | tapPending(t) | none (recording continues) |
| pressAndHold(s) | escape | idle | cancelRecording |
| pressAndHold(s) | mouseDown(t) or otherKeyDown(t), t−s < minHold | idle | cancelRecording (⌥-click / ⌥-shortcut protection) |
| pressAndHold(s) | mouseDown/otherKeyDown, t−s ≥ minHold | pressAndHold(s) | none |
| tapPending(r) | targetDown(t), t−r ≤ window | locked | none (seamless lock) |
| tapPending(r) | targetDown(t), t−r > window | pressAndHold(t) | none (defensive; expiry missed) |
| tapPending(r) | tapWindowExpired(t), t−r ≥ window | idle | cancelRecording (accidental tap) |
| tapPending(r) | tapWindowExpired(t), t−r < window | tapPending(r) | none (stale timer) |
| tapPending(r) | escape / mouseDown / otherKeyDown | idle | cancelRecording |
| locked | targetDown(t) | idle | stopAndTranscribe |
| locked | escape | idle | cancelRecording |
| locked | targetUp / mouse / other keys | locked | none |

- [ ] **Step 1: Write the failing tests**

`Tests/LocalFlowCoreTests/HotKeyProcessorTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class HotKeyProcessorTests: XCTestCase {
    var p = HotKeyProcessor()

    override func setUp() { p = HotKeyProcessor() }

    func testNormalPushToTalk() {
        XCTAssertEqual(p.handle(.targetDown(at: 0)), .startRecording)
        XCTAssertEqual(p.handle(.targetUp(at: 1.0)), .stopAndTranscribe)
        XCTAssertEqual(p.state, .idle)
    }

    func testShortTapThenExpiryDiscards() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.targetUp(at: 0.1)), ProcessorAction.none)
        XCTAssertEqual(p.state, .tapPending(releasedAt: 0.1))
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 0.45)), .cancelRecording)
        XCTAssertEqual(p.state, .idle)
    }

    func testStaleExpiryIgnored() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 0.2)), ProcessorAction.none)
        XCTAssertEqual(p.state, .tapPending(releasedAt: 0.1))
    }

    func testDoubleTapLocksThenStops() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.targetDown(at: 0.3)), ProcessorAction.none)
        XCTAssertEqual(p.state, .locked)
        _ = p.handle(.targetUp(at: 0.4)) // release of the locking tap: ignored
        XCTAssertEqual(p.state, .locked)
        XCTAssertEqual(p.handle(.targetDown(at: 5.0)), .stopAndTranscribe)
        XCTAssertEqual(p.state, .idle)
    }

    func testLateSecondPressBecomesNewHold() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.targetDown(at: 1.0)), ProcessorAction.none)
        XCTAssertEqual(p.state, .pressAndHold(startedAt: 1.0))
    }

    func testEscapeCancelsEveryActiveState() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.escape), .cancelRecording)

        _ = p.handle(.targetDown(at: 1)); _ = p.handle(.targetUp(at: 1.1))
        XCTAssertEqual(p.handle(.escape), .cancelRecording)

        _ = p.handle(.targetDown(at: 2)); _ = p.handle(.targetUp(at: 2.1))
        _ = p.handle(.targetDown(at: 2.3))
        XCTAssertEqual(p.state, .locked)
        XCTAssertEqual(p.handle(.escape), .cancelRecording)
    }

    func testOptionClickWithinThresholdCancels() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.mouseDown(at: 0.2)), .cancelRecording)
        XCTAssertEqual(p.state, .idle)
    }

    func testMouseAfterThresholdIgnored() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.mouseDown(at: 1.0)), ProcessorAction.none)
        XCTAssertEqual(p.state, .pressAndHold(startedAt: 0))
    }

    func testOtherKeyWithinThresholdCancels() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.otherKeyDown(at: 0.1)), .cancelRecording)
    }

    func testIdleIgnoresStrayEvents() {
        XCTAssertEqual(p.handle(.targetUp(at: 0)), ProcessorAction.none)
        XCTAssertEqual(p.handle(.escape), ProcessorAction.none)
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 1)), ProcessorAction.none)
        XCTAssertEqual(p.state, .idle)
    }

    func testHotkeyIgnoredNoRestartWhileLocked() {
        _ = p.handle(.targetDown(at: 0)); _ = p.handle(.targetUp(at: 0.1))
        _ = p.handle(.targetDown(at: 0.2))
        XCTAssertEqual(p.handle(.otherKeyDown(at: 3)), ProcessorAction.none)
        XCTAssertEqual(p.state, .locked)
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter HotKeyProcessorTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'HotKeyProcessor' in scope`.

- [ ] **Step 3: Implement `HotKeyProcessor.swift`**

```swift
import Foundation

public enum ProcessorEvent: Equatable, Sendable {
    case targetDown(at: TimeInterval)
    case targetUp(at: TimeInterval)
    case escape
    case otherKeyDown(at: TimeInterval)
    case mouseDown(at: TimeInterval)
    case tapWindowExpired(at: TimeInterval)
}

public enum ProcessorAction: Equatable, Sendable {
    case startRecording
    case stopAndTranscribe
    case cancelRecording
    case none
}

public struct HotKeyProcessor: Sendable {
    public enum State: Equatable, Sendable {
        case idle
        case pressAndHold(startedAt: TimeInterval)
        case tapPending(releasedAt: TimeInterval)
        case locked
    }

    public private(set) var state: State = .idle
    public var doubleTapWindow: TimeInterval = 0.3
    public var minHoldDuration: TimeInterval = 0.35

    public init() {}

    public mutating func handle(_ event: ProcessorEvent) -> ProcessorAction {
        switch (state, event) {
        case (.idle, .targetDown(let t)):
            state = .pressAndHold(startedAt: t)
            return .startRecording
        case (.idle, _):
            return .none

        case (.pressAndHold(let s), .targetUp(let t)):
            if t - s >= minHoldDuration {
                state = .idle
                return .stopAndTranscribe
            }
            state = .tapPending(releasedAt: t)
            return .none
        case (.pressAndHold, .escape):
            state = .idle
            return .cancelRecording
        case (.pressAndHold(let s), .mouseDown(let t)),
             (.pressAndHold(let s), .otherKeyDown(let t)):
            if t - s < minHoldDuration {
                state = .idle
                return .cancelRecording
            }
            return .none
        case (.pressAndHold, _):
            return .none

        case (.tapPending(let r), .targetDown(let t)):
            state = t - r <= doubleTapWindow ? .locked : .pressAndHold(startedAt: t)
            return .none
        case (.tapPending(let r), .tapWindowExpired(let t)):
            if t - r >= doubleTapWindow {
                state = .idle
                return .cancelRecording
            }
            return .none
        case (.tapPending, .escape), (.tapPending, .mouseDown), (.tapPending, .otherKeyDown):
            state = .idle
            return .cancelRecording
        case (.tapPending, _):
            return .none

        case (.locked, .targetDown):
            state = .idle
            return .stopAndTranscribe
        case (.locked, .escape):
            state = .idle
            return .cancelRecording
        case (.locked, _):
            return .none
        }
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter HotKeyProcessorTests 2>&1 | tail -3`
Expected: `Executed 11 tests, with 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add Sources/LocalFlowCore/HotKeyProcessor.swift Tests/LocalFlowCoreTests/HotKeyProcessorTests.swift
git commit -m "feat: hotkey processor state machine with double-tap lock"
```

---

### Task 5: Core — DictationStateMachine (P1, TDD)

**Files:**
- Create: `Sources/LocalFlowCore/DictationState.swift`
- Test: `Tests/LocalFlowCoreTests/DictationStateMachineTests.swift`

**Interfaces:**
- Produces (Tasks 7, 9, 11, 12 consume):

```swift
public enum DictationPhase: String, Equatable, Sendable {
    case idle, recording, transcribing, cleaning, injecting
}
public enum DictationEvent: Equatable, Sendable {
    case startRecording, stopRecording, cancel, transcriptReady, cleanupDone, injectionDone, failed
}
public struct DictationStateMachine: Sendable {
    public private(set) var phase: DictationPhase
    public init()
    @discardableResult public mutating func handle(_ event: DictationEvent) -> Bool // false = illegal, ignored
}
```

- [ ] **Step 1: Write the failing tests**

`Tests/LocalFlowCoreTests/DictationStateMachineTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class DictationStateMachineTests: XCTestCase {
    var m = DictationStateMachine()
    override func setUp() { m = DictationStateMachine() }

    func testHappyPath() {
        XCTAssertTrue(m.handle(.startRecording)); XCTAssertEqual(m.phase, .recording)
        XCTAssertTrue(m.handle(.stopRecording)); XCTAssertEqual(m.phase, .transcribing)
        XCTAssertTrue(m.handle(.transcriptReady)); XCTAssertEqual(m.phase, .cleaning)
        XCTAssertTrue(m.handle(.cleanupDone)); XCTAssertEqual(m.phase, .injecting)
        XCTAssertTrue(m.handle(.injectionDone)); XCTAssertEqual(m.phase, .idle)
    }

    func testHotkeyIgnoredWhileProcessing() {
        _ = m.handle(.startRecording); _ = m.handle(.stopRecording)
        XCTAssertFalse(m.handle(.startRecording))
        XCTAssertEqual(m.phase, .transcribing)
    }

    func testCancelFromEachActiveState() {
        for events in [[DictationEvent.startRecording],
                       [.startRecording, .stopRecording],
                       [.startRecording, .stopRecording, .transcriptReady]] {
            m = DictationStateMachine()
            events.forEach { _ = m.handle($0) }
            XCTAssertTrue(m.handle(.cancel))
            XCTAssertEqual(m.phase, .idle)
        }
    }

    func testFailureReturnsToIdle() {
        _ = m.handle(.startRecording); _ = m.handle(.stopRecording)
        XCTAssertTrue(m.handle(.failed))
        XCTAssertEqual(m.phase, .idle)
    }

    func testIllegalEventsIgnored() {
        XCTAssertFalse(m.handle(.transcriptReady))
        XCTAssertFalse(m.handle(.injectionDone))
        XCTAssertEqual(m.phase, .idle)
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter DictationStateMachineTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'DictationStateMachine' in scope`.

- [ ] **Step 3: Implement `DictationState.swift`**

```swift
import Foundation

public enum DictationPhase: String, Equatable, Sendable {
    case idle, recording, transcribing, cleaning, injecting
}

public enum DictationEvent: Equatable, Sendable {
    case startRecording, stopRecording, cancel, transcriptReady, cleanupDone, injectionDone, failed
}

public struct DictationStateMachine: Sendable {
    public private(set) var phase: DictationPhase = .idle

    public init() {}

    @discardableResult
    public mutating func handle(_ event: DictationEvent) -> Bool {
        switch (phase, event) {
        case (.idle, .startRecording): phase = .recording
        case (.recording, .stopRecording): phase = .transcribing
        case (.transcribing, .transcriptReady): phase = .cleaning
        case (.cleaning, .cleanupDone): phase = .injecting
        case (.injecting, .injectionDone): phase = .idle
        case (.recording, .cancel), (.transcribing, .cancel), (.cleaning, .cancel), (.injecting, .cancel):
            phase = .idle
        case (.recording, .failed), (.transcribing, .failed), (.cleaning, .failed), (.injecting, .failed):
            phase = .idle
        default:
            return false
        }
        return true
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter DictationStateMachineTests 2>&1 | tail -3`
Expected: `Executed 5 tests, with 0 failures`.

- [ ] **Step 5: Commit**

```bash
git add Sources/LocalFlowCore/DictationState.swift Tests/LocalFlowCoreTests/DictationStateMachineTests.swift
git commit -m "feat: dictation phase state machine"
```

---

### Task 6: App — HotkeyMonitor (NSEvent → ProcessorEvent) (P1)

**Files:**
- Create: `Sources/LocalFlowApp/Services/HotkeyMonitor.swift`
- Modify: `Sources/LocalFlowApp/App/AppState.swift` (wire monitor, log intents)

**Interfaces:**
- Consumes: `HotKeyProcessor`, `ProcessorEvent`, `ProcessorAction` (Task 4).
- Produces (Task 7 consumes): `HotkeyMonitor` `@MainActor final class` with:
  - `enum HotkeyIntent { case begin, end, cancel }`
  - `var onIntent: ((HotkeyIntent) -> Void)?`
  - `func start()`, `func stop()`

- [ ] **Step 1: Implement `HotkeyMonitor.swift`**

Key facts: Right Option is `keyCode == 61` in `.flagsChanged` events — pressed iff `modifierFlags.contains(.option)`. Escape is `keyCode == 53`. Global monitors need Accessibility and never see our own app's events, so a parallel local monitor is required. `NSEvent.timestamp` and `ProcessInfo.processInfo.systemUptime` share the same clock, which the scheduled tap-window expiry relies on.

```swift
import AppKit
import LocalFlowCore

enum HotkeyIntent { case begin, end, cancel }

@MainActor
final class HotkeyMonitor {
    var onIntent: ((HotkeyIntent) -> Void)?

    private var processor = HotKeyProcessor()
    private var monitors: [Any] = []
    private var expiryWork: DispatchWorkItem?
    private let mask: NSEvent.EventTypeMask = [.flagsChanged, .keyDown, .leftMouseDown]

    func start() {
        stop()
        if let global = NSEvent.addGlobalMonitorForEvents(matching: mask, handler: { [weak self] event in
            Task { @MainActor in self?.handle(event) }
        }) {
            monitors.append(global)
        }
        let local = NSEvent.addLocalMonitorForEvents(matching: mask) { [weak self] event in
            self?.handle(event)
            return event
        }
        if let local { monitors.append(local) }
    }

    func stop() {
        monitors.forEach { NSEvent.removeMonitor($0) }
        monitors.removeAll()
        expiryWork?.cancel()
    }

    private func handle(_ event: NSEvent) {
        let t = event.timestamp
        let processorEvent: ProcessorEvent
        switch event.type {
        case .flagsChanged where event.keyCode == 61:
            processorEvent = event.modifierFlags.contains(.option) ? .targetDown(at: t) : .targetUp(at: t)
        case .flagsChanged:
            return
        case .keyDown where event.keyCode == 53:
            processorEvent = .escape
        case .keyDown:
            processorEvent = .otherKeyDown(at: t)
        case .leftMouseDown:
            processorEvent = .mouseDown(at: t)
        default:
            return
        }
        feed(processorEvent)
    }

    private func feed(_ processorEvent: ProcessorEvent) {
        expiryWork?.cancel()
        let action = processor.handle(processorEvent)
        switch action {
        case .startRecording: onIntent?(.begin)
        case .stopAndTranscribe: onIntent?(.end)
        case .cancelRecording: onIntent?(.cancel)
        case .none: break
        }
        if case .tapPending = processor.state {
            let work = DispatchWorkItem { [weak self] in
                self?.feed(.tapWindowExpired(at: ProcessInfo.processInfo.systemUptime))
            }
            expiryWork = work
            DispatchQueue.main.asyncAfter(
                deadline: .now() + processor.doubleTapWindow + 0.02, execute: work)
        }
    }
}
```

- [ ] **Step 2: Wire a temporary log in `AppState`**

Add to `AppState`:

```swift
    let hotkey = HotkeyMonitor()

    func startServices() {
        hotkey.onIntent = { [weak self] intent in
            self?.statusText = "Hotkey: \(intent)"
            NSLog("LocalFlow hotkey intent: \(intent)")
        }
        hotkey.start()
    }
```

And call it from the app — in `LocalFlowApp.swift`, extend the label's `.onAppear`:

```swift
                .onAppear {
                    OnboardingWindowController.showIfNeeded(permissions: appState.permissions)
                    appState.startServices()
                }
```

- [ ] **Step 3: Build and verify manually**

Run: `make run` (grant Accessibility if prompted/reset), then while ANY other app is focused:
- Hold Right ⌥ ≥ 0.5 s, release → menu bar status reads `Hotkey: begin` then `Hotkey: end`.
- Quick-tap Right ⌥ once, wait → `begin` then `cancel` (~0.3 s later).
- Quick-tap then immediately press again (double-tap) → `begin`, stays recording; press Right ⌥ once more → `end`.
- Hold Right ⌥, press Esc → `cancel`.

Check log stream if the menu is hard to watch: `log stream --predicate 'processImagePath CONTAINS "LocalFlow"' --style compact | grep hotkey`

- [ ] **Step 4: Commit**

```bash
git add Sources
git commit -m "feat: global Right-Option hotkey monitor driving processor intents"
```

---

### Task 7: Audio capture + VAD trim + DictationController skeleton (P1)

**Files:**
- Create: `Sources/LocalFlowCore/VADTrimmer.swift`
- Create: `Sources/LocalFlowApp/Services/AudioCaptureService.swift`
- Create: `Sources/LocalFlowApp/App/DictationController.swift`
- Modify: `Sources/LocalFlowApp/App/AppState.swift` (replace temp wiring)
- Test: `Tests/LocalFlowCoreTests/VADTrimmerTests.swift`

**Interfaces:**
- Consumes: `DictationStateMachine`/`DictationPhase` (Task 5), `HotkeyMonitor` (Task 6).
- Produces:
  - `VADTrimmer` (Core): `init(threshold: Float = 0.01, windowSize: Int = 1600, padding: Int = 3200)`, `func trim(_ samples: [Float]) -> [Float]`.
  - `AudioCaptureService` (final class): `var onLevel: ((Float) -> Void)?` (RMS 0…~1 per tap buffer, delivered on main queue), `func start() throws`, `func stop() -> [Float]` (16 kHz mono Float32).
  - `DictationController` (`@MainActor final class, ObservableObject`): `@Published private(set) var phase: DictationPhase`, `@Published private(set) var lastTranscript: String`, `var onLevel: ((Float) -> Void)?` (forwarded), `func start()`. Tasks 9/11/12 extend its pipeline.

- [ ] **Step 1: Write the failing VADTrimmer tests**

`Tests/LocalFlowCoreTests/VADTrimmerTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class VADTrimmerTests: XCTestCase {
    let trimmer = VADTrimmer(threshold: 0.05, windowSize: 4, padding: 8)

    func testAllSilenceReturnsEmpty() {
        XCTAssertEqual(trimmer.trim([Float](repeating: 0.001, count: 100)), [])
    }

    func testEmptyInput() {
        XCTAssertEqual(trimmer.trim([]), [])
    }

    func testSpeechInMiddleTrimmedWithPadding() {
        var s = [Float](repeating: 0.0, count: 100)
        for i in 40..<60 { s[i] = 0.5 }   // loud region
        let out = trimmer.trim(s)
        // window-aligned start = 40, minus padding 8 → 32; end = 60 + 8 → 68
        XCTAssertEqual(out.count, 68 - 32)
        XCTAssertEqual(out.first, 0.0)     // padding retained
        XCTAssertTrue(out.contains(0.5))
    }

    func testPaddingClampedAtEdges() {
        var s = [Float](repeating: 0.5, count: 10)
        s[9] = 0.5
        let out = trimmer.trim(s)
        XCTAssertEqual(out.count, 10)      // padding can't exceed bounds
    }

    func testShorterThanWindowKeptIfLoud() {
        let out = trimmer.trim([0.5, 0.5])
        XCTAssertEqual(out, [0.5, 0.5])
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter VADTrimmerTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'VADTrimmer' in scope`.

- [ ] **Step 3: Implement `VADTrimmer.swift`**

```swift
import Foundation

/// Trims leading/trailing silence using per-window RMS energy.
public struct VADTrimmer: Sendable {
    public var threshold: Float
    public var windowSize: Int
    public var padding: Int

    public init(threshold: Float = 0.01, windowSize: Int = 1600, padding: Int = 3200) {
        self.threshold = threshold
        self.windowSize = windowSize
        self.padding = padding
    }

    public func trim(_ samples: [Float]) -> [Float] {
        guard !samples.isEmpty else { return [] }
        var firstLoud: Int? = nil
        var lastLoud: Int? = nil
        var i = 0
        while i < samples.count {
            let end = min(i + windowSize, samples.count)
            var sum: Float = 0
            for j in i..<end { sum += samples[j] * samples[j] }
            let rms = (sum / Float(end - i)).squareRoot()
            if rms >= threshold {
                if firstLoud == nil { firstLoud = i }
                lastLoud = end
            }
            i = end
        }
        guard let start = firstLoud, let stop = lastLoud else { return [] }
        let from = max(0, start - padding)
        let to = min(samples.count, stop + padding)
        return Array(samples[from..<to])
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter VADTrimmerTests 2>&1 | tail -3`
Expected: `Executed 5 tests, with 0 failures`.

- [ ] **Step 5: Implement `AudioCaptureService.swift`**

CRITICAL: never enable `setVoiceProcessingEnabled` on the input node (undocumented 9-channel output breaks conversion). Recreate the converter on every `start()` — the input device/sample-rate can change between runs.

```swift
import AVFoundation

final class AudioCaptureService {
    var onLevel: ((Float) -> Void)?

    private let engine = AVAudioEngine()
    private var samples: [Float] = []
    private let lock = NSLock()

    private static let targetFormat = AVAudioFormat(
        commonFormat: .pcmFormatFloat32, sampleRate: 16_000, channels: 1, interleaved: false)!

    func start() throws {
        lock.lock(); samples.removeAll(); lock.unlock()

        let input = engine.inputNode
        let inputFormat = input.outputFormat(forBus: 0)
        guard inputFormat.sampleRate > 0 else {
            throw NSError(domain: "LocalFlow.audio", code: 1,
                          userInfo: [NSLocalizedDescriptionKey: "No audio input device"])
        }
        guard let converter = AVAudioConverter(from: inputFormat, to: Self.targetFormat) else {
            throw NSError(domain: "LocalFlow.audio", code: 2,
                          userInfo: [NSLocalizedDescriptionKey: "Cannot convert mic format"])
        }

        input.installTap(onBus: 0, bufferSize: 4096, format: inputFormat) { [weak self] buffer, _ in
            guard let self else { return }
            let ratio = Self.targetFormat.sampleRate / inputFormat.sampleRate
            let capacity = AVAudioFrameCount(Double(buffer.frameLength) * ratio) + 64
            guard let out = AVAudioPCMBuffer(pcmFormat: Self.targetFormat, frameCapacity: capacity) else { return }
            var fed = false
            var err: NSError?
            converter.convert(to: out, error: &err) { _, status in
                if fed { status.pointee = .noDataNow; return nil }
                fed = true
                status.pointee = .haveData
                return buffer
            }
            guard err == nil, out.frameLength > 0, let data = out.floatChannelData else { return }
            let chunk = Array(UnsafeBufferPointer(start: data[0], count: Int(out.frameLength)))
            self.lock.lock(); self.samples.append(contentsOf: chunk); self.lock.unlock()

            var sum: Float = 0
            for v in chunk { sum += v * v }
            let rms = (sum / Float(chunk.count)).squareRoot()
            DispatchQueue.main.async { self.onLevel?(rms) }
        }

        engine.prepare()
        try engine.start()
    }

    func stop() -> [Float] {
        engine.inputNode.removeTap(onBus: 0)
        engine.stop()
        lock.lock(); defer { lock.unlock() }
        return samples
    }
}
```

- [ ] **Step 6: Implement `DictationController.swift`** (transcription arrives in Task 9)

```swift
import SwiftUI
import LocalFlowCore

@MainActor
final class DictationController: ObservableObject {
    @Published private(set) var phase: DictationPhase = .idle
    @Published private(set) var lastTranscript: String = ""
    var onLevel: ((Float) -> Void)?

    private var machine = DictationStateMachine()
    private let hotkey = HotkeyMonitor()
    private let audio = AudioCaptureService()
    private let trimmer = VADTrimmer()
    /// Anything shorter than 0.3 s of trimmed audio is an accidental tap.
    private let minSamples = 4_800

    func start() {
        audio.onLevel = { [weak self] level in self?.onLevel?(level) }
        hotkey.onIntent = { [weak self] intent in
            guard let self else { return }
            switch intent {
            case .begin: self.beginRecording()
            case .end: self.endRecording()
            case .cancel: self.cancelDictation()
            }
        }
        hotkey.start()
    }

    private func beginRecording() {
        guard machine.handle(.startRecording) else { return }
        do {
            try audio.start()
            phase = machine.phase
        } catch {
            machine.handle(.failed)
            phase = machine.phase
            NSLog("LocalFlow audio start failed: \(error.localizedDescription)")
        }
    }

    private func endRecording() {
        guard machine.handle(.stopRecording) else { return }
        phase = machine.phase
        let raw = audio.stop()
        let trimmed = trimmer.trim(raw)
        guard trimmed.count >= minSamples else {
            machine.handle(.failed)
            phase = machine.phase
            return
        }
        process(samples: trimmed)
    }

    private func cancelDictation() {
        guard machine.handle(.cancel) else { return }
        _ = audio.stop()
        phase = machine.phase
    }

    /// Task 9 replaces this stub with the real transcribe→clean→inject pipeline.
    private func process(samples: [Float]) {
        let seconds = Double(samples.count) / 16_000.0
        lastTranscript = String(format: "Captured %.1fs (%d samples)", seconds, samples.count)
        NSLog("LocalFlow: \(lastTranscript)")
        machine.handle(.failed) // no pipeline yet; return to idle
        phase = machine.phase
    }
}
```

- [ ] **Step 7: Rewire `AppState`**

Replace the Task 6 temp wiring — `AppState` becomes:

```swift
import SwiftUI
import LocalFlowCore

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    let permissions = PermissionsService()
    let dictation = DictationController()

    var statusText: String {
        switch dictation.phase {
        case .idle: dictation.lastTranscript.isEmpty ? "Idle" : dictation.lastTranscript
        case .recording: "● Recording…"
        case .transcribing: "Transcribing…"
        case .cleaning: "Cleaning…"
        case .injecting: "Inserting…"
        }
    }

    func startServices() {
        dictation.start()
    }
}
```

In `LocalFlowApp.swift`, the menu's `Text(appState.statusText)` still works, but `statusText` is now computed — add `@ObservedObject` pass-through so the menu refreshes: change the first menu line to observe the controller directly:

```swift
        MenuBarExtra {
            MenuContent()
                .environmentObject(appState)
        } label: { ... }
```

with a small view in the same file:

```swift
private struct MenuContent: View {
    @EnvironmentObject var appState: AppState
    @ObservedObject private var dictation: DictationController

    init() { _dictation = ObservedObject(wrappedValue: AppState.shared.dictation) }

    var body: some View {
        Text(appState.statusText)
        Divider()
        SettingsLink { Text("Settings…") }.keyboardShortcut(",")
        Divider()
        Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }.keyboardShortcut("q")
    }
}
```

- [ ] **Step 8: Full test run, build, verify manually**

Run: `swift test 2>&1 | tail -3` — Expected: all Core tests pass.
Run: `make run`, grant Microphone when prompted (first real capture), then hold Right ⌥ and speak a sentence, release.
Expected: menu status shows `● Recording…` while held, then `Captured 2.3s (36800 samples)` (numbers vary). Quick-tap → no capture message (discarded). Esc during hold → back to Idle.

- [ ] **Step 9: Commit**

```bash
git add Sources Tests
git commit -m "feat: audio capture with VAD trim and dictation controller skeleton"
```

---

### Task 8: ModelManager + Models tab (whisper models) (P2)

**Files:**
- Create: `Sources/LocalFlowApp/Services/ModelManager.swift`
- Modify: `Sources/LocalFlowApp/UI/ModelsTab.swift` (replace placeholder)

**Interfaces:**
- Consumes: `WhisperModel` (Task 1).
- Produces (Tasks 9, 12 consume):
  - `ModelManager` (`@MainActor final class, ObservableObject`, `static let shared`):
    - `@Published var installed: Set<String>` (whisper model ids)
    - `@Published var progress: [String: Double]` (model id → 0…1 while downloading)
    - `@Published var lastError: String?`
    - `var whisperDir: URL` — `~/Library/Application Support/LocalFlow/Models/whisper`
    - `var llmDir: URL` — `~/Library/Application Support/LocalFlow/Models/llm`
    - `func installedPath(for model: WhisperModel) -> URL?`
    - `func download(_ model: WhisperModel)` / `func cancelDownload(_ model: WhisperModel)` / `func delete(_ model: WhisperModel)`
  - UserDefaults keys (exact strings): `"whisperModel"` (String, default `"base"`), `"language"` (String, default `"auto"`).

- [ ] **Step 1: Implement `ModelManager.swift`**

```swift
import Foundation

@MainActor
final class ModelManager: ObservableObject {
    static let shared = ModelManager()

    @Published var installed: Set<String> = []
    @Published var progress: [String: Double] = [:]
    @Published var lastError: String?

    private var tasks: [String: Task<Void, Never>] = [:]

    let whisperDir: URL
    let llmDir: URL

    init() {
        let appSupport = FileManager.default.urls(
            for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("LocalFlow", isDirectory: true)
        whisperDir = appSupport.appendingPathComponent("Models/whisper", isDirectory: true)
        llmDir = appSupport.appendingPathComponent("Models/llm", isDirectory: true)
        try? FileManager.default.createDirectory(at: whisperDir, withIntermediateDirectories: true)
        try? FileManager.default.createDirectory(at: llmDir, withIntermediateDirectories: true)
        refresh()
    }

    func refresh() {
        var found: Set<String> = []
        for model in WhisperModel.catalog {
            let url = whisperDir.appendingPathComponent(model.fileName)
            if let size = try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int64,
               size == model.sizeBytes {
                found.insert(model.id)
            }
        }
        installed = found
    }

    func installedPath(for model: WhisperModel) -> URL? {
        installed.contains(model.id) ? whisperDir.appendingPathComponent(model.fileName) : nil
    }

    func download(_ model: WhisperModel) {
        guard tasks[model.id] == nil else { return }
        lastError = nil
        progress[model.id] = 0

        // Refuse if the volume doesn't have room (model + 200 MB slack).
        if let values = try? whisperDir.resourceValues(forKeys: [.volumeAvailableCapacityForImportantUsageKey]),
           let free = values.volumeAvailableCapacityForImportantUsage,
           free < model.sizeBytes + 200_000_000 {
            lastError = "Not enough free disk space for \(model.displayName)."
            progress[model.id] = nil
            return
        }

        let dest = whisperDir.appendingPathComponent(model.fileName)
        let partial = dest.appendingPathExtension("partial")

        tasks[model.id] = Task {
            defer { tasks[model.id] = nil }
            do {
                let (bytes, response) = try await URLSession.shared.bytes(from: model.url)
                guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
                    throw URLError(.badServerResponse)
                }
                FileManager.default.createFile(atPath: partial.path, contents: nil)
                let handle = try FileHandle(forWritingTo: partial)
                defer { try? handle.close() }

                var buffer = Data(); buffer.reserveCapacity(1 << 20)
                var written: Int64 = 0
                for try await byte in bytes {
                    buffer.append(byte)
                    if buffer.count >= 1 << 20 {
                        try handle.write(contentsOf: buffer)
                        written += Int64(buffer.count)
                        buffer.removeAll(keepingCapacity: true)
                        progress[model.id] = Double(written) / Double(model.sizeBytes)
                        try Task.checkCancellation()
                    }
                }
                try handle.write(contentsOf: buffer)
                written += Int64(buffer.count)

                guard written == model.sizeBytes else {
                    throw URLError(.cannotParseResponse)
                }
                try? FileManager.default.removeItem(at: dest)
                try FileManager.default.moveItem(at: partial, to: dest)
                progress[model.id] = nil
                refresh()
            } catch {
                try? FileManager.default.removeItem(at: partial)
                progress[model.id] = nil
                if !(error is CancellationError) {
                    lastError = "Download failed: \(error.localizedDescription)"
                }
            }
        }
    }

    func cancelDownload(_ model: WhisperModel) {
        tasks[model.id]?.cancel()
    }

    func delete(_ model: WhisperModel) {
        try? FileManager.default.removeItem(at: whisperDir.appendingPathComponent(model.fileName))
        refresh()
    }
}
```

- [ ] **Step 2: Replace `ModelsTab.swift`**

```swift
import SwiftUI
import LocalFlowCore

struct ModelsTab: View {
    @ObservedObject private var models = ModelManager.shared
    @AppStorage("whisperModel") private var selectedModel = WhisperModel.default.id
    @AppStorage("language") private var language = "auto"

    var body: some View {
        Form {
            Section("Transcription (Whisper)") {
                Picker("Language", selection: $language) {
                    Text("Auto-detect").tag("auto")
                    Text("English").tag("en")
                    Text("Norwegian").tag("no")
                    Text("Swedish").tag("sv")
                    Text("Danish").tag("da")
                    Text("German").tag("de")
                    Text("Spanish").tag("es")
                    Text("French").tag("fr")
                }
                ForEach(WhisperModel.catalog) { model in
                    modelRow(model)
                }
                if let err = models.lastError {
                    Text(err).foregroundStyle(.red).font(.caption)
                }
            }
            // LLM section arrives in Task 12.
        }
        .formStyle(.grouped)
        .onAppear { models.refresh() }
    }

    @ViewBuilder
    private func modelRow(_ model: WhisperModel) -> some View {
        HStack {
            VStack(alignment: .leading) {
                Text(model.displayName)
                Text(ByteCountFormatter.string(fromByteCount: model.sizeBytes, countStyle: .file))
                    .font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if let p = models.progress[model.id] {
                ProgressView(value: p).frame(width: 100)
                Button("Cancel") { models.cancelDownload(model) }
            } else if models.installed.contains(model.id) {
                if selectedModel == model.id {
                    Label("Active", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                } else {
                    Button("Use") { selectedModel = model.id }
                    Button(role: .destructive) { models.delete(model) } label: {
                        Image(systemName: "trash")
                    }
                }
            } else {
                Button("Download") { models.download(model) }
            }
        }
    }
}
```

- [ ] **Step 3: Build and verify manually**

Run: `make run` → Settings → Models.
Expected: catalog lists 5 models with sizes. Click Download on **base** → progress bar advances → row flips to "Use"/"Active". `ls ~/Library/Application\ Support/LocalFlow/Models/whisper/` shows `ggml-base.bin` with exactly 147951465 bytes. Cancel mid-download leaves no `.partial` file. Delete removes the file and the row reverts to Download.

- [ ] **Step 4: Commit**

```bash
git add Sources
git commit -m "feat: whisper model download manager and Models settings tab"
```

---

### Task 9: HallucinationFilter + TranscriptionEngine + pipeline (P2, TDD for filter)

**Files:**
- Create: `Sources/LocalFlowCore/HallucinationFilter.swift`
- Create: `Sources/LocalFlowApp/Services/TranscriptionEngine.swift`
- Modify: `Sources/LocalFlowApp/App/DictationController.swift` (real pipeline)
- Modify: `Package.swift` (add integration test target)
- Test: `Tests/LocalFlowCoreTests/HallucinationFilterTests.swift`, `Tests/LocalFlowIntegrationTests/TranscriptionSmokeTests.swift`

**Interfaces:**
- Consumes: `ModelManager.shared.installedPath(for:)` (Task 8), `WhisperModel` (Task 1), UserDefaults keys `"whisperModel"`, `"language"`.
- Produces:
  - `HallucinationFilter` (Core): `init()`, `func clean(_ text: String) -> String`.
  - `TranscriptionEngine` (actor): `func transcribe(samples: [Float], modelPath: String, language: String, prompt: String?) throws -> String`, `enum TranscriptionError: Error { case initFailed, transcribeFailed, modelNotFound }`.
  - `DictationController` gains `private func process(samples: [Float])` real pipeline; Task 10 hooks injection at the `// INJECT` marker; Task 12 hooks cleanup at the `// CLEANUP` marker.

- [ ] **Step 1: Write the failing filter tests**

`Tests/LocalFlowCoreTests/HallucinationFilterTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class HallucinationFilterTests: XCTestCase {
    let f = HallucinationFilter()

    func testRemovesBracketedNonSpeech() {
        XCTAssertEqual(f.clean("[Music] Hello there"), "Hello there")
        XCTAssertEqual(f.clean("[BLANK_AUDIO]"), "")
        XCTAssertEqual(f.clean("Hello [inaudible] world"), "Hello world")
    }

    func testRemovesParenthesizedNonSpeech() {
        XCTAssertEqual(f.clean("(applause) Thanks everyone"), "Thanks everyone")
        XCTAssertEqual(f.clean("(silence)"), "")
    }

    func testKeepsLegitimateParentheses() {
        XCTAssertEqual(f.clean("I said (quietly) hi"), "I said (quietly) hi")
    }

    func testRemovesMusicNotes() {
        XCTAssertEqual(f.clean("♪ la la la ♪"), "")
        XCTAssertEqual(f.clean("Hello ♪♪"), "Hello")
    }

    func testCollapsesWhitespace() {
        XCTAssertEqual(f.clean("  Hello   world  "), "Hello world")
    }

    func testPlainTextUntouched() {
        XCTAssertEqual(f.clean("This is a normal sentence."), "This is a normal sentence.")
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter HallucinationFilterTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'HallucinationFilter' in scope`.

- [ ] **Step 3: Implement `HallucinationFilter.swift`**

```swift
import Foundation

/// Strips Whisper's non-speech artifacts: "[Music]", "(applause)", "♪ …", etc.
/// Bracketed/parenthesized text is removed only when it matches known
/// non-speech keywords, so real parentheticals survive.
public struct HallucinationFilter: Sendable {
    private static let keywords = [
        "music", "applause", "laughter", "laughs", "silence", "blank_audio",
        "blank audio", "inaudible", "noise", "static", "coughs", "cough",
        "foreign", "speaking in foreign language", "no audio", "crowd",
    ]

    private static let bracketed = try! NSRegularExpression(
        pattern: #"[\[\(]([^\]\)]{0,60})[\]\)]"#)

    public init() {}

    public func clean(_ text: String) -> String {
        var result = text

        // ♪-framed or ♪-containing runs are always noise.
        result = result.replacingOccurrences(
            of: #"♪[^♪\n]*♪?"#, with: " ", options: .regularExpression)

        // Bracketed segments whose content matches a non-speech keyword.
        let ns = result as NSString
        var out = ""
        var cursor = 0
        for match in Self.bracketed.matches(in: result, range: NSRange(location: 0, length: ns.length)) {
            let inner = ns.substring(with: match.range(at: 1))
                .lowercased().trimmingCharacters(in: .whitespaces)
            let isNoise = Self.keywords.contains { inner == $0 || inner.hasPrefix($0 + " ") }
            if isNoise {
                out += ns.substring(with: NSRange(location: cursor, length: match.range.location - cursor))
                cursor = match.range.location + match.range.length
            }
        }
        out += ns.substring(from: cursor)

        return out
            .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter HallucinationFilterTests 2>&1 | tail -3`
Expected: `Executed 6 tests, with 0 failures`.

- [ ] **Step 5: Implement `TranscriptionEngine.swift`**

The whisper v1.9.1 C API (verified against the shipped header): context via `whisper_context_default_params()` + `whisper_init_from_file_with_params()`; run via `whisper_full()`; read segments via `whisper_full_n_segments()` / `whisper_full_get_segment_text()`. `params.language` accepts `"auto"`, `""`, or NULL for auto-detect. C-string params must outlive the `whisper_full` call — `strdup`/`free` guarantees that.

```swift
import Foundation
import whisper

actor TranscriptionEngine {
    enum TranscriptionError: Error, LocalizedError {
        case modelNotFound, initFailed, transcribeFailed
        var errorDescription: String? {
            switch self {
            case .modelNotFound: "No transcription model installed. Open Settings → Models."
            case .initFailed: "Could not load the transcription model."
            case .transcribeFailed: "Transcription failed."
            }
        }
    }

    private var ctx: OpaquePointer?
    private var loadedModelPath: String?

    deinit { if let ctx { whisper_free(ctx) } }

    func transcribe(samples: [Float], modelPath: String, language: String, prompt: String?) throws -> String {
        try ensureContext(modelPath: modelPath)
        guard let ctx else { throw TranscriptionError.initFailed }

        var params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY)
        params.print_progress = false
        params.print_realtime = false
        params.print_special = false
        params.print_timestamps = false
        params.no_timestamps = true
        params.suppress_blank = true
        params.n_threads = Int32(max(2, ProcessInfo.processInfo.activeProcessorCount - 2))

        let langC = strdup(language)
        defer { free(langC) }
        params.language = UnsafePointer(langC)

        var promptC: UnsafeMutablePointer<CChar>?
        if let prompt, !prompt.isEmpty { promptC = strdup(prompt) }
        defer { promptC.map { free($0) } }
        if let promptC { params.initial_prompt = UnsafePointer(promptC) }

        let status = samples.withUnsafeBufferPointer { buf in
            whisper_full(ctx, params, buf.baseAddress, Int32(buf.count))
        }
        guard status == 0 else { throw TranscriptionError.transcribeFailed }

        var text = ""
        for i in 0..<whisper_full_n_segments(ctx) {
            if let seg = whisper_full_get_segment_text(ctx, i) {
                text += String(cString: seg)
            }
        }
        return text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func ensureContext(modelPath: String) throws {
        guard modelPath != loadedModelPath || ctx == nil else { return }
        if let old = ctx { whisper_free(old); ctx = nil }
        var cparams = whisper_context_default_params()
        cparams.use_gpu = true
        ctx = whisper_init_from_file_with_params(modelPath, cparams)
        guard ctx != nil else { throw TranscriptionError.initFailed }
        loadedModelPath = modelPath
    }
}
```

- [ ] **Step 6: Wire the real pipeline into `DictationController`**

Replace the Task 7 `process(samples:)` stub and add fields:

```swift
    private let transcriber = TranscriptionEngine()
    private let filter = HallucinationFilter()

    private func process(samples: [Float]) {
        Task { [weak self] in
            guard let self else { return }
            do {
                let modelID = UserDefaults.standard.string(forKey: "whisperModel") ?? WhisperModel.default.id
                guard let model = WhisperModel.catalog.first(where: { $0.id == modelID }),
                      let path = ModelManager.shared.installedPath(for: model) else {
                    throw TranscriptionEngine.TranscriptionError.modelNotFound
                }
                let language = UserDefaults.standard.string(forKey: "language") ?? "auto"
                let raw = try await transcriber.transcribe(
                    samples: samples, modelPath: path.path, language: language, prompt: nil)
                let filtered = filter.clean(raw)
                guard !filtered.isEmpty else {
                    machine.handle(.failed); phase = machine.phase
                    lastTranscript = "Didn't catch that"
                    return
                }
                machine.handle(.transcriptReady); phase = machine.phase
                let cleaned = filtered // CLEANUP — Task 12 replaces this line with CleanupEngine
                machine.handle(.cleanupDone); phase = machine.phase
                lastTranscript = cleaned
                NSLog("LocalFlow transcript: \(cleaned)")
                // INJECT — Task 10 replaces this line with TextInjector
                machine.handle(.injectionDone); phase = machine.phase
            } catch {
                machine.handle(.failed); phase = machine.phase
                lastTranscript = error.localizedDescription
            }
        }
    }
```

Concurrency note: `DictationController` is `@MainActor` and an unstructured `Task {}` created inside one of its methods inherits that actor context, so the body above touches `machine`/`phase`/`lastTranscript` directly — no `MainActor.run` hops. `ModelManager` is also `@MainActor`, so `installedPath(for:)` is a plain synchronous call here. The only `await`s are the actor hops into `TranscriptionEngine` (and later `CleanupEngine`/`TextInjector`). This shape matters for Tasks 10 and 12, whose replacement blocks contain `await` calls that would not compile inside a synchronous `MainActor.run` closure.

- [ ] **Step 7: Add the integration smoke test**

`Package.swift` — add to `targets:`:

```swift
        .testTarget(
            name: "LocalFlowIntegrationTests",
            dependencies: ["LocalFlowCore", "whisper"]
        ),
```

`Tests/LocalFlowIntegrationTests/TranscriptionSmokeTests.swift` — exercises the binaryTarget + Metal + a real model WITHOUT importing the executable target (SPM can't):

```swift
import XCTest
import whisper

final class TranscriptionSmokeTests: XCTestCase {
    func testWhisperLoadsAndRunsOnSilence() throws {
        let modelURL = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("LocalFlow/Models/whisper/ggml-base.bin")
        guard FileManager.default.fileExists(atPath: modelURL.path) else {
            throw XCTSkip("ggml-base.bin not downloaded; run the app and download it first")
        }
        var cparams = whisper_context_default_params()
        cparams.use_gpu = true
        guard let ctx = whisper_init_from_file_with_params(modelURL.path, cparams) else {
            return XCTFail("whisper_init failed")
        }
        defer { whisper_free(ctx) }

        var params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY)
        params.no_timestamps = true
        params.print_progress = false
        let silence = [Float](repeating: 0, count: 16_000) // 1 s
        let status = silence.withUnsafeBufferPointer {
            whisper_full(ctx, params, $0.baseAddress, Int32($0.count))
        }
        XCTAssertEqual(status, 0, "whisper_full should succeed on silence")
    }
}
```

- [ ] **Step 8: Run all tests**

Run: `swift test 2>&1 | tail -5`
Expected: Core tests pass; the smoke test passes (model downloaded in Task 8) or skips with the download hint. Watch the smoke test log for `Metal` initialization lines — that's the GPU path confirming itself.

- [ ] **Step 9: End-to-end manual verify**

Run: `make run`, ensure base model downloaded and Active, hold Right ⌥, say "This is a test of local transcription", release.
Expected: menu status walks Recording → Transcribing → then shows the transcript text. First run loads the model (~1 s); subsequent dictations transcribe a 3-second utterance well under a second.

- [ ] **Step 10: Commit**

```bash
git add Package.swift Sources Tests
git commit -m "feat: on-device whisper transcription pipeline with hallucination filter"
```

---

### Task 10: TextInjector + SPIKE: verify injection on macOS 26 (P3)

This task de-risks the single biggest platform risk (Tahoe dropping synthesized events from weakly-signed processes). Do NOT proceed past it until the spike verdict is recorded in `docs/TESTING.md`.

**Files:**
- Create: `Sources/LocalFlowApp/Services/TextInjector.swift`
- Create: `docs/TESTING.md`
- Modify: `Sources/LocalFlowApp/App/DictationController.swift` (replace `// INJECT` marker)

**Interfaces:**
- Produces:
  - `enum InjectionMethod: String { case paste, type }` — UserDefaults key `"injectionMethod"`, default `"paste"`.
  - `enum InjectionResult: Equatable { case pasted, typed, clipboardOnly, blockedSecureField, noText }`
  - `TextInjector` (`@MainActor final class`): `func inject(_ text: String, method: InjectionMethod) async -> InjectionResult`

- [ ] **Step 1: Implement `TextInjector.swift`**

```swift
import AppKit
import ApplicationServices

enum InjectionMethod: String { case paste, type }

enum InjectionResult: Equatable { case pasted, typed, clipboardOnly, blockedSecureField, noText }

@MainActor
final class TextInjector {

    func inject(_ text: String, method: InjectionMethod) async -> InjectionResult {
        guard !text.isEmpty else { return .noText }
        if focusedElementIsSecure() { return .blockedSecureField }

        switch method {
        case .paste:
            if await paste(text) { return .pasted }
            // CGEvent posting failed — leave the text on the clipboard so nothing is lost.
            let pb = NSPasteboard.general
            pb.clearContents()
            pb.setString(text, forType: .string)
            return .clipboardOnly
        case .type:
            type(text)
            return .typed
        }
    }

    /// True when the focused UI element is a secure (password) field.
    /// Fails open (false) when AX is unavailable — the paste itself still
    /// requires user-granted Accessibility.
    private func focusedElementIsSecure() -> Bool {
        let systemWide = AXUIElementCreateSystemWide()
        var focused: CFTypeRef?
        guard AXUIElementCopyAttributeValue(
            systemWide, kAXFocusedUIElementAttribute as CFString, &focused) == .success,
            let element = focused, CFGetTypeID(element) == AXUIElementGetTypeID() else { return false }
        let ax = element as! AXUIElement
        var subrole: CFTypeRef?
        if AXUIElementCopyAttributeValue(ax, kAXSubroleAttribute as CFString, &subrole) == .success,
           let s = subrole as? String, s == "AXSecureTextField" {
            return true
        }
        return false
    }

    private func paste(_ text: String) async -> Bool {
        let pb = NSPasteboard.general
        let saved = pb.string(forType: .string)
        pb.clearContents()
        pb.setString(text, forType: .string)
        let ourChange = pb.changeCount

        try? await Task.sleep(for: .milliseconds(120))

        guard let src = CGEventSource(stateID: .combinedSessionState),
              let down = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: true),
              let up = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: false) else {
            return false
        }
        down.flags = .maskCommand
        up.flags = .maskCommand
        down.post(tap: .cghidEventTap)
        up.post(tap: .cghidEventTap)

        // Restore the previous clipboard once the paste has been consumed,
        // unless something else changed the pasteboard in the meantime.
        Task {
            try? await Task.sleep(for: .milliseconds(700))
            if pb.changeCount == ourChange {
                pb.clearContents()
                if let saved { pb.setString(saved, forType: .string) }
            }
        }
        return true
    }

    /// Fallback: synthetic unicode typing in ≤20-UTF16-unit chunks.
    private func type(_ text: String) {
        let src = CGEventSource(stateID: .combinedSessionState)
        let units = Array(text.utf16)
        var i = 0
        while i < units.count {
            let chunk = Array(units[i..<min(i + 20, units.count)])
            if let down = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true) {
                down.keyboardSetUnicodeString(stringLength: chunk.count, unicodeString: chunk)
                down.post(tap: .cghidEventTap)
            }
            if let up = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) {
                up.post(tap: .cghidEventTap)
            }
            usleep(8_000)
            i += 20
        }
    }
}
```

- [ ] **Step 2: Replace the `// INJECT` marker in `DictationController`**

Add field `private let injector = TextInjector()`, then replace the marker block:

```swift
                let method = InjectionMethod(
                    rawValue: UserDefaults.standard.string(forKey: "injectionMethod") ?? "paste") ?? .paste
                let result = await injector.inject(cleaned, method: method)
                self.machine.handle(.injectionDone); self.phase = self.machine.phase
                switch result {
                case .pasted, .typed:
                    self.lastTranscript = cleaned
                case .clipboardOnly:
                    self.lastTranscript = "⚠️ Copied to clipboard — press ⌘V (injection blocked)"
                case .blockedSecureField:
                    self.lastTranscript = "Secure field — dictation blocked"
                case .noText:
                    self.lastTranscript = "Didn't catch that"
                }
```

- [ ] **Step 3: THE SPIKE — build signed, grant, verify injection**

```bash
make cert     # create "LocalFlow Dev" identity (GUI prompts: login password → Always Allow)
make bundle   # should print: Signed with: LocalFlow Dev
make run
```
Re-grant Accessibility (signature changed). Then dictate into each of:

1. TextEdit document
2. Safari URL bar
3. Terminal prompt
4. Notes
5. A password field (Safari → any login page) — expect **"Secure field — dictation blocked"**

Expected: transcript text appears at the cursor in 1–4; blocked in 5; the pre-dictation clipboard content is back on the clipboard ~1 s after paste.

**If text does NOT appear in 1–4** (Tahoe event gate): retest with `defaults write` → no; escalation ladder, in order: (a) confirm Accessibility is granted to *dist/LocalFlow.app* (the bundle you launched, not a stale copy); (b) if `make cert` fell back to ad-hoc (check `codesign -dv dist/LocalFlow.app` says `Signature=adhoc`), fix the cert trust in Keychain Access (Trust → Code Signing → Always Trust) and re-run; (c) create a free Apple Development identity: Xcode → Settings → Accounts → add Apple ID → Manage Certificates → "+" → Apple Development, then `CODESIGN_IDENTITY="Apple Development" make bundle`; (d) if all posting fails, set `"injectionMethod"` default to clipboard-only UX and file the finding in TESTING.md — the app remains usable via ⌘V.

- [ ] **Step 4: Write `docs/TESTING.md`**

```markdown
# Manual test checklist

## Injection spike (macOS 26 Tahoe) — record verdict here
- Date / signing identity used:
- TextEdit / Safari URL bar / Terminal / Notes: paste OK?
- Secure field correctly blocked?
- Clipboard restored after ~1s?

## Permissions
- Fresh install: onboarding shows both permissions red; granting flips green within 1s.
- After rebuild with stable cert: permissions persist.
- `tccutil reset Accessibility com.figge.LocalFlow` re-prompts correctly.

## Hotkey
- Hold ≥0.35s → PTT. Quick tap → discarded. Double-tap → hands-free lock; single press stops.
- Esc cancels in every phase. ⌥-click within 0.35s cancels (no accidental recording).

## Dictation
- 3s utterance lands in ≤1.5s after release (base model, post-warmup).
- "Didn't catch that" on silence. Model missing → clear error pointing to Settings → Models.
```

Fill in the spike section with the actual verdict.

- [ ] **Step 5: Commit**

```bash
git add Sources docs/TESTING.md
git commit -m "feat: paste-based text injection with secure-field guard (Tahoe spike verified)"
```

---

### Task 11: Overlay — floating waveform pill (P4)

**Files:**
- Create: `Sources/LocalFlowApp/UI/OverlayView.swift`
- Create: `Sources/LocalFlowApp/UI/OverlayPanel.swift`
- Modify: `Sources/LocalFlowApp/App/DictationController.swift`

**Interfaces:**
- Consumes: `DictationPhase` (Task 5), `AudioCaptureService.onLevel` (Task 7).
- Produces: `OverlayController` (`@MainActor final class`) with `let model = OverlayModel()`, `func update(phase: DictationPhase, message: String? = nil)`. `OverlayModel` has `func push(level: Float)`.
- Produces in `DictationController`: `private func setPhase(_ p: DictationPhase, message: String? = nil)` — ALL phase mutations go through this from now on.

- [ ] **Step 1: Write `OverlayView.swift`**

```swift
import SwiftUI
import LocalFlowCore

@MainActor
final class OverlayModel: ObservableObject {
    @Published var phase: DictationPhase = .idle
    @Published var levels: [Float] = Array(repeating: 0, count: 24)
    @Published var message: String?

    func push(level: Float) {
        levels.removeFirst()
        levels.append(min(1, level * 12))
    }

    func resetLevels() {
        levels = Array(repeating: 0, count: 24)
    }
}

struct OverlayView: View {
    @ObservedObject var model: OverlayModel

    var body: some View {
        HStack(spacing: 10) {
            if model.phase == .recording {
                waveform
            } else if model.phase != .idle {
                ProgressView().controlSize(.small).tint(.white)
            }
            Text(label).font(.callout.weight(.medium)).foregroundStyle(.white)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 10)
        .background(Capsule().fill(.black.opacity(0.85)))
        .overlay(Capsule().strokeBorder(.white.opacity(0.15)))
        .fixedSize()
    }

    private var label: String {
        if let m = model.message { return m }
        switch model.phase {
        case .recording: return "Listening…  (esc to cancel)"
        case .transcribing: return "Transcribing…"
        case .cleaning: return "Cleaning…"
        case .injecting: return "Inserting…"
        case .idle: return ""
        }
    }

    private var waveform: some View {
        HStack(spacing: 2) {
            ForEach(model.levels.indices, id: \.self) { i in
                RoundedRectangle(cornerRadius: 1)
                    .fill(.white)
                    .frame(width: 3, height: 4 + CGFloat(model.levels[i]) * 20)
            }
        }
        .animation(.linear(duration: 0.05), value: model.levels)
    }
}
```

- [ ] **Step 2: Write `OverlayPanel.swift`**

```swift
import AppKit
import SwiftUI
import LocalFlowCore

@MainActor
final class OverlayController {
    let model = OverlayModel()
    private var panel: NSPanel?
    private var dismissWork: DispatchWorkItem?

    func update(phase: DictationPhase, message: String? = nil) {
        model.phase = phase
        model.message = message
        dismissWork?.cancel()

        if phase != .idle {
            show()
        } else if message != nil {
            show()
            let work = DispatchWorkItem { [weak self] in self?.hide() }
            dismissWork = work
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.4, execute: work)
        } else {
            hide()
        }
    }

    private func show() {
        if panel == nil {
            let p = NSPanel(
                contentRect: NSRect(x: 0, y: 0, width: 260, height: 44),
                styleMask: [.borderless, .nonactivatingPanel],
                backing: .buffered, defer: false)
            p.level = .statusBar
            p.isOpaque = false
            p.backgroundColor = .clear
            p.hasShadow = false
            p.ignoresMouseEvents = true
            p.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
            p.contentView = NSHostingView(rootView: OverlayView(model: model))
            panel = p
        }
        guard let panel, let screen = NSScreen.main else { return }
        let size = panel.contentView?.fittingSize ?? NSSize(width: 260, height: 44)
        panel.setContentSize(size)
        let frame = screen.visibleFrame
        panel.setFrameOrigin(NSPoint(
            x: frame.midX - size.width / 2,
            y: frame.minY + 64))
        panel.orderFrontRegardless()
    }

    private func hide() {
        panel?.orderOut(nil)
        model.resetLevels()
    }
}
```

- [ ] **Step 3: Route all phase changes through `setPhase` in `DictationController`**

Add fields and the helper:

```swift
    private let overlay = OverlayController()

    private func setPhase(_ p: DictationPhase, message: String? = nil) {
        phase = p
        overlay.update(phase: p, message: message)
    }
```

Then, in `start()`, feed the waveform:

```swift
        audio.onLevel = { [weak self] level in
            self?.onLevel?(level)
            self?.overlay.model.push(level: level)
        }
```

Replace every existing `self.phase = self.machine.phase` / `phase = machine.phase` with `setPhase(machine.phase)`, and give terminal outcomes a message:
- successful injection → `setPhase(machine.phase, message: "✓ Inserted")` (after `.injectionDone`)
- `.clipboardOnly` → `setPhase(machine.phase, message: "Copied — press ⌘V")`
- `.blockedSecureField` → `setPhase(machine.phase, message: "Secure field — blocked")`
- empty transcript → `setPhase(machine.phase, message: "Didn't catch that")`
- errors → `setPhase(machine.phase, message: error.localizedDescription)`

- [ ] **Step 4: Build and verify manually**

Run: `make bundle && make run` (re-grant Accessibility if the cert changed).
Expected: holding Right ⌥ pops a black pill bottom-center with live-moving white bars that flatten when you stop talking; on release it switches to a spinner "Transcribing…", then flashes "✓ Inserted" and fades ~1.4 s later. Esc during recording hides it immediately. It appears over full-screen apps too.

- [ ] **Step 5: Commit**

```bash
git add Sources
git commit -m "feat: floating waveform overlay with phase feedback"
```

---

### Task 12: CleanupEngine — local LLM formatting via MLX (P5, TDD for prompt builder)

**Files:**
- Modify: `Package.swift` (add MLX + HuggingFace deps)
- Create: `Sources/LocalFlowCore/CleanupPromptBuilder.swift`
- Create: `Sources/LocalFlowApp/Services/CleanupEngine.swift`
- Modify: `Sources/LocalFlowApp/App/DictationController.swift` (replace `// CLEANUP` marker)
- Modify: `Sources/LocalFlowApp/UI/GeneralTab.swift` (real content), `UI/ModelsTab.swift` (LLM section)
- Test: `Tests/LocalFlowCoreTests/CleanupPromptBuilderTests.swift`

**Interfaces:**
- Produces (Core):
  - `enum CleanupLevel: String, CaseIterable, Sendable { case none, light, medium, high }` — UserDefaults key `"cleanupLevel"`, default `"light"`.
  - `CleanupPromptBuilder`: `init()`, `func systemPrompt(level: CleanupLevel, glossary: [String]) -> String?` (nil for `.none`), `func acceptOutput(_ output: String, input: String) -> String`.
- Produces (App): `CleanupEngine` (actor): `init(llmDir: URL)`, `static let defaultModelID = "mlx-community/Qwen3-4B-Instruct-2507-4bit"`, `static let lightModelID = "mlx-community/Llama-3.2-1B-Instruct-4bit"`, `func cleanup(_ text: String, level: CleanupLevel, glossary: [String], modelID: String) async -> String` (TOTAL — never throws, falls back to input), `func warmUp(modelID: String, progress: @Sendable @escaping (Double) -> Void) async throws`, `nonisolated func isModelDownloaded(modelID: String) -> Bool`. UserDefaults key `"llmModel"`.

- [ ] **Step 1: Write the failing prompt-builder tests**

`Tests/LocalFlowCoreTests/CleanupPromptBuilderTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class CleanupPromptBuilderTests: XCTestCase {
    let b = CleanupPromptBuilder()

    func testNoneLevelHasNoPrompt() {
        XCTAssertNil(b.systemPrompt(level: .none, glossary: []))
    }

    func testLightPromptCorePledges() {
        let p = b.systemPrompt(level: .light, glossary: [])!
        XCTAssertTrue(p.contains("filler words"))
        XCTAssertTrue(p.contains("Do NOT change the wording"))
        XCTAssertTrue(p.contains("Output ONLY the cleaned text"))
        XCTAssertTrue(p.contains("same language"))
    }

    func testHigherLevelsAreSupersets() {
        let light = b.systemPrompt(level: .light, glossary: [])!
        let medium = b.systemPrompt(level: .medium, glossary: [])!
        let high = b.systemPrompt(level: .high, glossary: [])!
        XCTAssertTrue(medium.contains("false starts"))
        XCTAssertTrue(high.contains("lists"))
        XCTAssertGreaterThan(medium.count, light.count)
        XCTAssertGreaterThan(high.count, medium.count)
    }

    func testGlossaryIncluded() {
        let p = b.systemPrompt(level: .light, glossary: ["GraphQL", "Fredrik"])!
        XCTAssertTrue(p.contains("GraphQL, Fredrik"))
    }

    func testAcceptOutputPassthrough() {
        XCTAssertEqual(b.acceptOutput("Clean text.", input: "clean text"), "Clean text.")
    }

    func testAcceptOutputFallsBackOnEmpty() {
        XCTAssertEqual(b.acceptOutput("  ", input: "original"), "original")
    }

    func testAcceptOutputFallsBackOnExplosion() {
        let input = "short input text here"
        let exploded = String(repeating: "blah ", count: 100)
        XCTAssertEqual(b.acceptOutput(exploded, input: input), input)
    }

    func testAcceptOutputFallsBackOnSevereTruncation() {
        let input = String(repeating: "a reasonable sentence. ", count: 10)
        XCTAssertEqual(b.acceptOutput("ok", input: input), input)
    }

    func testAcceptOutputStripsWrappers() {
        XCTAssertEqual(b.acceptOutput("```\nHello.\n```", input: "hello"), "Hello.")
        XCTAssertEqual(b.acceptOutput("<think>hmm</think>Hello.", input: "hello"), "Hello.")
        XCTAssertEqual(b.acceptOutput("\"Hello.\"", input: "hello"), "Hello.")
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter CleanupPromptBuilderTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'CleanupPromptBuilder' in scope`.

- [ ] **Step 3: Implement `CleanupPromptBuilder.swift`**

```swift
import Foundation

public enum CleanupLevel: String, CaseIterable, Sendable {
    case none, light, medium, high
}

public struct CleanupPromptBuilder: Sendable {
    public init() {}

    public func systemPrompt(level: CleanupLevel, glossary: [String]) -> String? {
        guard level != .none else { return nil }
        var p = """
        You clean up dictated speech transcripts. Remove filler words \
        (um, uh, er, you know, like — only when used as filler). \
        Fix punctuation, capitalization, and spacing. \
        Do NOT change the wording. Do NOT add, answer, or summarize anything. \
        Keep the same language as the input. \
        Output ONLY the cleaned text, with no preamble, labels, or quotes.
        """
        if level == .medium || level == .high {
            p += "\nAlso fix obvious grammatical slips and remove false starts and duplicated words."
        }
        if level == .high {
            p += "\nLightly improve readability: split run-on sentences, and format clearly dictated enumerations as lists."
        }
        if !glossary.isEmpty {
            p += "\nPreserve these terms exactly as written: \(glossary.joined(separator: ", "))."
        }
        return p
    }

    /// Sanity-guards LLM output; on any suspicion, returns the raw input
    /// (over-editing is the #1 complaint about the app we're improving on).
    public func acceptOutput(_ output: String, input: String) -> String {
        var out = output.trimmingCharacters(in: .whitespacesAndNewlines)
        out = out.replacingOccurrences(
            of: #"(?s)<think>.*?</think>"#, with: "", options: .regularExpression)
        out = out.trimmingCharacters(in: .whitespacesAndNewlines)
        if out.hasPrefix("```") {
            out = out.replacingOccurrences(
                of: #"^```[a-z]*\n?|\n?```$"#, with: "", options: .regularExpression)
            out = out.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if out.hasPrefix("\""), out.hasSuffix("\""), out.count >= 2 {
            out = String(out.dropFirst().dropLast())
        }
        guard !out.isEmpty else { return input }
        if out.count > input.count * 5 / 2 + 40 { return input }   // hallucinated expansion
        if input.count > 40, out.count < input.count / 4 { return input } // severe truncation
        return out
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter CleanupPromptBuilderTests 2>&1 | tail -3`
Expected: `Executed 9 tests, with 0 failures`.

- [ ] **Step 5: Add MLX dependencies — full final `Package.swift`**

```swift
// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "LocalFlow",
    platforms: [.macOS(.v14)],
    products: [
        .library(name: "LocalFlowCore", targets: ["LocalFlowCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/ml-explore/mlx-swift-lm", .upToNextMinor(from: "3.31.4")),
        .package(url: "https://github.com/huggingface/swift-huggingface", .upToNextMinor(from: "0.9.0")),
    ],
    targets: [
        .target(name: "LocalFlowCore"),
        .binaryTarget(
            name: "whisper",
            url: "https://github.com/ggml-org/whisper.cpp/releases/download/v1.9.1/whisper-v1.9.1-xcframework.zip",
            checksum: "8c3ecbe73f48b0cb9318fc3058264f951ab336fd530e82c4ccdd2298d1311a4c"
        ),
        .executableTarget(
            name: "LocalFlowApp",
            dependencies: [
                "LocalFlowCore",
                "whisper",
                .product(name: "MLXLLM", package: "mlx-swift-lm"),
                .product(name: "MLXLMCommon", package: "mlx-swift-lm"),
                .product(name: "MLXHuggingFace", package: "mlx-swift-lm"),
                .product(name: "HuggingFace", package: "swift-huggingface"),
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
        .testTarget(name: "LocalFlowCoreTests", dependencies: ["LocalFlowCore"]),
        .testTarget(
            name: "LocalFlowIntegrationTests",
            dependencies: ["LocalFlowCore", "whisper"]
        ),
    ]
)
```

Run: `swift build 2>&1 | tail -3` — first resolve compiles mlx-swift's Metal kernels; expect several minutes. Expected: `Build complete!`

- [ ] **Step 6: Implement `CleanupEngine.swift`**

```swift
import Foundation
import MLX
import MLXLMCommon
import MLXLLM
import MLXHuggingFace
import HuggingFace
import LocalFlowCore

actor CleanupEngine {
    static let defaultModelID = "mlx-community/Qwen3-4B-Instruct-2507-4bit"
    static let lightModelID = "mlx-community/Llama-3.2-1B-Instruct-4bit"

    private let llmDir: URL
    private var container: ModelContainer?
    private var loadedModelID: String?
    private var unloadTask: Task<Void, Never>?
    private let builder = CleanupPromptBuilder()
    private let idleUnloadAfter: Duration = .seconds(600)
    private let timeout: Duration = .seconds(10)

    init(llmDir: URL) {
        self.llmDir = llmDir
    }

    /// Total function: any failure (model missing, load error, generation
    /// error, timeout) returns the input unchanged. A transcript is never lost.
    func cleanup(_ text: String, level: CleanupLevel, glossary: [String], modelID: String) async -> String {
        let minChars = max(0, UserDefaults.standard.object(forKey: "cleanupMinChars") as? Int ?? 50)
        guard level != .none, text.count >= minChars else { return text }
        guard let system = builder.systemPrompt(level: level, glossary: glossary) else { return text }
        guard isModelDownloaded(modelID: modelID) else {
            NSLog("LocalFlow: cleanup model not downloaded; using raw transcript")
            return text
        }
        do {
            let container = try await ensureLoaded(modelID: modelID, progress: { _ in })
            let output: String = try await withThrowingTaskGroup(of: String.self) { group in
                group.addTask {
                    var gp = GenerateParameters(maxTokens: 1024)
                    gp.temperature = 0.2
                    let session = ChatSession(container, instructions: system, generateParameters: gp)
                    return try await session.respond(to: text)
                }
                group.addTask { [timeout] in
                    try await Task.sleep(for: timeout)
                    throw CancellationError()
                }
                guard let first = try await group.next() else { throw CancellationError() }
                group.cancelAll()
                return first
            }
            MLX.GPU.set(cacheLimit: 32 * 1024 * 1024)
            scheduleUnload()
            return builder.acceptOutput(output, input: text)
        } catch {
            NSLog("LocalFlow: cleanup fell back to raw transcript (\(error))")
            return text
        }
    }

    /// Downloads (if needed) and loads the model, reporting fractional progress.
    func warmUp(modelID: String, progress: @Sendable @escaping (Double) -> Void) async throws {
        _ = try await ensureLoaded(modelID: modelID, progress: progress)
    }

    nonisolated func isModelDownloaded(modelID: String) -> Bool {
        // HubCache layout: <llmDir>/models--mlx-community--<name>/snapshots/<rev>/config.json
        let dirName = "models--" + modelID.replacingOccurrences(of: "/", with: "--")
        let snapshots = llmDir.appendingPathComponent(dirName).appendingPathComponent("snapshots")
        guard let revs = try? FileManager.default.contentsOfDirectory(atPath: snapshots.path) else {
            return false
        }
        return revs.contains { rev in
            FileManager.default.fileExists(
                atPath: snapshots.appendingPathComponent(rev).appendingPathComponent("config.json").path)
        }
    }

    private func ensureLoaded(
        modelID: String, progress: @Sendable @escaping (Double) -> Void
    ) async throws -> ModelContainer {
        unloadTask?.cancel()
        if let container, loadedModelID == modelID { return container }
        container = nil

        let client = HubClient(cache: HubCache(location: .fixed(directory: llmDir)))
        let c = try await loadModelContainer(
            from: #hubDownloader(client),
            using: #huggingFaceTokenizerLoader(),
            configuration: ModelConfiguration(id: modelID),
            progressHandler: { p in progress(p.fractionCompleted) }
        )
        // Warm-up generation absorbs Metal shader compilation latency.
        let warm = ChatSession(c, generateParameters: GenerateParameters(maxTokens: 1))
        _ = try? await warm.respond(to: "Hi")

        container = c
        loadedModelID = modelID
        return c
    }

    private func scheduleUnload() {
        unloadTask?.cancel()
        unloadTask = Task { [idleUnloadAfter] in
            try? await Task.sleep(for: idleUnloadAfter)
            guard !Task.isCancelled else { return }
            await self.unload()
        }
    }

    private func unload() {
        container = nil
        loadedModelID = nil
        NSLog("LocalFlow: cleanup model unloaded after idle period")
    }
}
```

If the `#hubDownloader` / `#huggingFaceLoadModelContainer` macro spellings drift in a future 3.x patch: consult `Libraries/MLXHuggingFace/Macros.swift` in the resolved checkout under `.build/checkouts/mlx-swift-lm/` — the signatures above were verified against 3.31.4.

- [ ] **Step 7: Replace the `// CLEANUP` marker in `DictationController`**

Add field (constructed with the ModelManager dir):

```swift
    private let cleanupEngine = CleanupEngine(llmDir: ModelManager.shared.llmDir)
```

Replace `let cleaned = filtered // CLEANUP …` with:

```swift
                machine.handle(.transcriptReady)
                setPhase(machine.phase)   // .cleaning
                let level = CleanupLevel(
                    rawValue: UserDefaults.standard.string(forKey: "cleanupLevel") ?? "light") ?? .light
                let llmID = UserDefaults.standard.string(forKey: "llmModel") ?? CleanupEngine.defaultModelID
                let glossary: [String] = []   // VOCAB — Task 13 supplies terms
                let cleaned = await cleanupEngine.cleanup(
                    filtered, level: level, glossary: glossary, modelID: llmID)
```

(Adjust surrounding code so `.transcriptReady` isn't handled twice — the marker's neighborhood from Task 9 already advanced to `.cleaning`; keep exactly ONE `transcriptReady` transition.)

- [ ] **Step 8: Real `GeneralTab` + LLM section in `ModelsTab`**

`UI/GeneralTab.swift`:

```swift
import SwiftUI
import LocalFlowCore

struct GeneralTab: View {
    @AppStorage("cleanupLevel") private var cleanupLevel = "light"

    var body: some View {
        Form {
            Section("Dictation") {
                LabeledContent("Hold to talk", value: "Right ⌥ (Option)")
                LabeledContent("Hands-free lock", value: "Double-tap Right ⌥ · press once to stop")
                LabeledContent("Cancel", value: "Esc")
            }
            Section("AI cleanup") {
                Picker("Cleanup level", selection: $cleanupLevel) {
                    Text("None — raw transcript").tag("none")
                    Text("Light — fillers & punctuation (recommended)").tag("light")
                    Text("Medium — also grammar & false starts").tag("medium")
                    Text("High — also structure & lists").tag("high")
                }
                .pickerStyle(.inline)
                Text("Cleanup never rewrites your meaning; if the model misbehaves, the raw transcript is used.")
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
        .formStyle(.grouped)
    }
}
```

`UI/ModelsTab.swift` — add below the whisper Section (uses a small observable helper in the same file):

```swift
@MainActor
final class LLMDownloadState: ObservableObject {
    @Published var progress: Double?
    @Published var error: String?
}
```

and inside the `Form`:

```swift
            Section("AI cleanup model (local LLM)") {
                Picker("Model", selection: $llmModel) {
                    Text("Qwen3 4B — best quality (2.3 GB)").tag(CleanupEngine.defaultModelID)
                    Text("Llama 3.2 1B — light & fast (0.7 GB)").tag(CleanupEngine.lightModelID)
                }
                HStack {
                    if let p = llmState.progress {
                        ProgressView(value: p).frame(width: 140)
                        Text("\(Int(p * 100))%").monospacedDigit()
                    } else if cleanupEngine.isModelDownloaded(modelID: llmModel) {
                        Label("Downloaded", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                    } else {
                        Button("Download & warm up") {
                            llmState.progress = 0
                            llmState.error = nil
                            let id = llmModel
                            Task {
                                do {
                                    try await cleanupEngine.warmUp(modelID: id) { frac in
                                        Task { @MainActor in llmState.progress = frac }
                                    }
                                } catch {
                                    llmState.error = error.localizedDescription
                                }
                                llmState.progress = nil
                            }
                        }
                    }
                }
                if let err = llmState.error {
                    Text(err).foregroundStyle(.red).font(.caption)
                }
                Text("Downloaded once from Hugging Face, then used fully offline.")
                    .font(.caption).foregroundStyle(.secondary)
            }
```

with the new properties on `ModelsTab`:

```swift
    @AppStorage("llmModel") private var llmModel = CleanupEngine.defaultModelID
    @StateObject private var llmState = LLMDownloadState()
    private var cleanupEngine: CleanupEngine { AppState.shared.dictation.cleanup }
```

For that last accessor, expose the engine from `DictationController`: rename the field to `let cleanup = CleanupEngine(llmDir: ModelManager.shared.llmDir)` (internal, not private) and use `cleanupEngine` → `cleanup` at the call site from Step 7.

- [ ] **Step 9: Full test run + end-to-end manual verify**

Run: `swift test 2>&1 | tail -3` — all green.
Run: `make bundle && make run` → Settings → Models → download the Qwen model (~2.3 GB, progress %) → wait for "Downloaded".
Dictate into TextEdit: *"um so this is uh basically just a test you know of the cleanup"*.
Expected: injected text reads like *"So this is basically just a test of the cleanup."* — no "um/uh/you know". Set level to None → raw fillers come through. Kill Wi-Fi → dictation + cleanup still work (fully offline). First cleanup after 10+ min idle takes a few seconds extra (reload) — subsequent ones are fast.

- [ ] **Step 10: Commit**

```bash
git add Package.swift Sources Tests
git commit -m "feat: local LLM transcript cleanup via MLX with strict fallback guards"
```

---

### Task 13: Custom vocabulary (P6, TDD)

**Files:**
- Create: `Sources/LocalFlowCore/VocabularyEngine.swift`
- Create: `Sources/LocalFlowApp/Services/VocabularyStore.swift`
- Modify: `Sources/LocalFlowApp/UI/VocabularyTab.swift` (real content)
- Modify: `Sources/LocalFlowApp/App/DictationController.swift` (prompt + replacements + glossary)
- Test: `Tests/LocalFlowCoreTests/VocabularyEngineTests.swift`

**Interfaces:**
- Produces (Core):

```swift
public struct VocabularyEntry: Codable, Equatable, Identifiable, Sendable {
    public var id: UUID
    public var term: String
    public var soundsLike: [String]
    public init(id: UUID = UUID(), term: String, soundsLike: [String] = [])
}
public struct VocabularyEngine: Sendable {
    public init(entries: [VocabularyEntry])
    public var promptText: String?          // for whisper initial_prompt; nil when empty
    public var glossaryTerms: [String]      // for the LLM system prompt
    public func apply(to text: String) -> String  // soundsLike → term replacements
}
```

- Produces (App): `VocabularyStore` (`@MainActor final class, ObservableObject, static let shared`): `@Published var entries: [VocabularyEntry]` (auto-saves on change to `~/Library/Application Support/LocalFlow/vocabulary.json`).

- [ ] **Step 1: Write the failing tests**

`Tests/LocalFlowCoreTests/VocabularyEngineTests.swift`:

```swift
import XCTest
@testable import LocalFlowCore

final class VocabularyEngineTests: XCTestCase {
    let engine = VocabularyEngine(entries: [
        VocabularyEntry(term: "GraphQL", soundsLike: ["graph ql", "graph QL"]),
        VocabularyEntry(term: "Wispr", soundsLike: ["whisper"]),
        VocabularyEntry(term: "figge", soundsLike: []),
    ])

    func testReplacesSoundsLikeWordBounded() {
        XCTAssertEqual(engine.apply(to: "I use graph ql daily"), "I use GraphQL daily")
    }

    func testCaseInsensitiveAliasMatch() {
        XCTAssertEqual(engine.apply(to: "Graph QL is nice"), "GraphQL is nice")
    }

    func testNoPartialWordReplacement() {
        XCTAssertEqual(engine.apply(to: "the whisperer spoke"), "the whisperer spoke")
        XCTAssertEqual(engine.apply(to: "I like whisper models"), "I like Wispr models")
    }

    func testTermWithoutAliasesIsPromptOnly() {
        XCTAssertEqual(engine.apply(to: "talk to figge"), "talk to figge")
        XCTAssertTrue(engine.promptText!.contains("figge"))
    }

    func testPromptTextFormatAndCap() {
        XCTAssertTrue(engine.promptText!.hasPrefix("Glossary: "))
        let many = (0..<200).map { VocabularyEntry(term: "term\($0)") }
        let big = VocabularyEngine(entries: many)
        XCTAssertLessThanOrEqual(big.promptText!.count, 600)
    }

    func testEmptyVocabularyHasNilPrompt() {
        XCTAssertNil(VocabularyEngine(entries: []).promptText)
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `swift test --filter VocabularyEngineTests 2>&1 | tail -3`
Expected: compile FAILURE — `cannot find 'VocabularyEngine' in scope`.

- [ ] **Step 3: Implement `VocabularyEngine.swift`**

```swift
import Foundation

public struct VocabularyEntry: Codable, Equatable, Identifiable, Sendable {
    public var id: UUID
    public var term: String
    public var soundsLike: [String]

    public init(id: UUID = UUID(), term: String, soundsLike: [String] = []) {
        self.id = id
        self.term = term
        self.soundsLike = soundsLike
    }
}

public struct VocabularyEngine: Sendable {
    public let entries: [VocabularyEntry]

    public init(entries: [VocabularyEntry]) {
        self.entries = entries
    }

    /// Biases whisper toward the user's terms via initial_prompt.
    public var promptText: String? {
        let terms = entries.map(\.term).filter { !$0.isEmpty }
        guard !terms.isEmpty else { return nil }
        var text = "Glossary: "
        for (i, term) in terms.enumerated() {
            let piece = (i == 0 ? "" : ", ") + term
            if text.count + piece.count + 1 > 600 { break }
            text += piece
        }
        return text + "."
    }

    public var glossaryTerms: [String] {
        entries.map(\.term).filter { !$0.isEmpty }
    }

    /// Deterministic post-transcription corrections: alias → canonical term.
    public func apply(to text: String) -> String {
        var result = text
        for entry in entries {
            for alias in entry.soundsLike where !alias.isEmpty {
                let pattern = "\\b" + NSRegularExpression.escapedPattern(for: alias) + "\\b"
                guard let regex = try? NSRegularExpression(
                    pattern: pattern, options: [.caseInsensitive]) else { continue }
                result = regex.stringByReplacingMatches(
                    in: result,
                    range: NSRange(result.startIndex..., in: result),
                    withTemplate: NSRegularExpression.escapedTemplate(for: entry.term))
            }
        }
        return result
    }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `swift test --filter VocabularyEngineTests 2>&1 | tail -3`
Expected: `Executed 6 tests, with 0 failures`.

- [ ] **Step 5: Implement `VocabularyStore.swift`**

```swift
import Foundation
import LocalFlowCore

@MainActor
final class VocabularyStore: ObservableObject {
    static let shared = VocabularyStore()

    @Published var entries: [VocabularyEntry] {
        didSet { save() }
    }

    private let fileURL: URL

    init() {
        fileURL = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("LocalFlow/vocabulary.json")
        if let data = try? Data(contentsOf: fileURL),
           let decoded = try? JSONDecoder().decode([VocabularyEntry].self, from: data) {
            entries = decoded
        } else {
            entries = []
        }
    }

    private func save() {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        if let data = try? encoder.encode(entries) {
            try? data.write(to: fileURL, options: .atomic)
        }
    }
}
```

- [ ] **Step 6: Real `VocabularyTab`**

```swift
import SwiftUI
import LocalFlowCore

struct VocabularyTab: View {
    @ObservedObject private var store = VocabularyStore.shared
    @State private var newTerm = ""
    @State private var newSoundsLike = ""

    var body: some View {
        Form {
            Section("Add term") {
                TextField("Term (as it should be written)", text: $newTerm)
                TextField("Sounds like (comma-separated, optional)", text: $newSoundsLike)
                Button("Add") {
                    let aliases = newSoundsLike
                        .split(separator: ",")
                        .map { $0.trimmingCharacters(in: .whitespaces) }
                        .filter { !$0.isEmpty }
                    store.entries.append(
                        VocabularyEntry(term: newTerm.trimmingCharacters(in: .whitespaces),
                                        soundsLike: aliases))
                    newTerm = ""; newSoundsLike = ""
                }
                .disabled(newTerm.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            Section("Terms (\(store.entries.count))") {
                if store.entries.isEmpty {
                    Text("Names, jargon, product names… anything the transcriber gets wrong.")
                        .foregroundStyle(.secondary)
                }
                ForEach(store.entries) { entry in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(entry.term)
                            if !entry.soundsLike.isEmpty {
                                Text("sounds like: \(entry.soundsLike.joined(separator: ", "))")
                                    .font(.caption).foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        Button(role: .destructive) {
                            store.entries.removeAll { $0.id == entry.id }
                        } label: { Image(systemName: "trash") }
                    }
                }
            }
        }
        .formStyle(.grouped)
    }
}
```

- [ ] **Step 7: Wire into the pipeline in `DictationController`**

In `process(samples:)`:
- Before transcribing: `let vocab = VocabularyEngine(entries: VocabularyStore.shared.entries)` and pass `prompt: vocab.promptText` to `transcriber.transcribe(...)` (replacing `prompt: nil`).
- After the hallucination filter: `let corrected = vocab.apply(to: filtered)` and use `corrected` downstream (empty-check included).
- Replace the Task 12 `let glossary: [String] = []` line with `let glossary = vocab.glossaryTerms`.

- [ ] **Step 8: Full test run + manual verify**

Run: `swift test 2>&1 | tail -3` — all green.
Run: `make bundle && make run`. Add a vocabulary entry: term `LocalFlow`, sounds-like `local flow`. Dictate "I am testing local flow today."
Expected: injected text contains `LocalFlow` (via replacement even if whisper splits it). Add your own name with a common mis-hearing and verify it corrects.

- [ ] **Step 9: Commit**

```bash
git add Sources Tests
git commit -m "feat: custom vocabulary with whisper prompt bias and deterministic corrections"
```

---

### Task 14: Polish — history, toggle shortcut, launch-at-login, docs (P7)

**Files:**
- Modify: `Package.swift` (KeyboardShortcuts), `App/DictationController.swift`, `App/LocalFlowApp.swift`, `UI/GeneralTab.swift`, `UI/AdvancedTab.swift`
- Create: `README.md`

**Interfaces:**
- Consumes: everything prior.
- Produces: `DictationController.history: [String]` (`@Published`, newest first, max 10), `func toggleDictation()`; `KeyboardShortcuts.Name.toggleDictation`.

- [ ] **Step 1: Add KeyboardShortcuts dependency**

In `Package.swift` `dependencies:` add:

```swift
        .package(url: "https://github.com/sindresorhus/KeyboardShortcuts", from: "3.0.1"),
```

and to the app target's dependencies:

```swift
                .product(name: "KeyboardShortcuts", package: "KeyboardShortcuts"),
```

- [ ] **Step 2: History + toggle in `DictationController`**

Add:

```swift
    @Published private(set) var history: [String] = []

    func toggleDictation() {
        switch phase {
        case .idle: beginRecording()
        case .recording: endRecording()
        default: break
        }
    }
```

On every successful injection (`.pasted` / `.typed` / `.clipboardOnly` cases), prepend:

```swift
                    self.history.insert(cleaned, at: 0)
                    if self.history.count > 10 { self.history.removeLast() }
```

In `start()`, listen for the optional user-defined shortcut (KeyboardShortcuts 3.x streaming API):

```swift
        Task { [weak self] in
            for await event in KeyboardShortcuts.events(for: .toggleDictation) where event == .keyDown {
                self?.toggleDictation()
            }
        }
```

with, at file top level (outside the class):

```swift
import KeyboardShortcuts

extension KeyboardShortcuts.Name {
    static let toggleDictation = Self("toggleDictation")
}
```

- [ ] **Step 3: Recent-transcripts menu**

In `MenuContent` (LocalFlowApp.swift), after the status line:

```swift
        if !dictation.history.isEmpty {
            Menu("Recent transcripts") {
                ForEach(Array(dictation.history.enumerated()), id: \.offset) { _, item in
                    Button(String(item.prefix(48)) + (item.count > 48 ? "…" : "")) {
                        NSPasteboard.general.clearContents()
                        NSPasteboard.general.setString(item, forType: .string)
                    }
                }
            }
            Divider()
        }
```

- [ ] **Step 4: GeneralTab additions — shortcut recorder + launch at login**

Add to `GeneralTab` (new Section before "AI cleanup"), with `import KeyboardShortcuts` and `import ServiceManagement` at the top:

```swift
            Section("Shortcuts") {
                KeyboardShortcuts.Recorder("Toggle dictation (alternative):", name: .toggleDictation)
                Text("The primary hold-to-talk key stays Right ⌥.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("Startup") {
                Toggle("Launch LocalFlow at login", isOn: launchAtLogin)
            }
```

and in the struct:

```swift
    private var launchAtLogin: Binding<Bool> {
        Binding(
            get: { SMAppService.mainApp.status == .enabled },
            set: { enable in
                do {
                    if enable { try SMAppService.mainApp.register() }
                    else { try SMAppService.mainApp.unregister() }
                } catch {
                    NSLog("LocalFlow launch-at-login failed: \(error)")
                }
            })
    }
```

(Note: registration only works from the bundled .app, not `swift run`.)

- [ ] **Step 5: Real `AdvancedTab`**

```swift
import SwiftUI

struct AdvancedTab: View {
    @AppStorage("injectionMethod") private var injectionMethod = "paste"
    @AppStorage("cleanupMinChars") private var cleanupMinChars = 50

    var body: some View {
        Form {
            Section("Text insertion") {
                Picker("Method", selection: $injectionMethod) {
                    Text("Paste (recommended)").tag("paste")
                    Text("Type character-by-character").tag("type")
                }
                Text("Typing is slower but works in apps that block programmatic paste.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("AI cleanup") {
                Stepper("Skip cleanup under \(cleanupMinChars) characters",
                        value: $cleanupMinChars, in: 0...200, step: 10)
            }
        }
        .formStyle(.grouped)
    }
}
```

- [ ] **Step 6: Write `README.md`**

```markdown
# LocalFlow

Fully-local voice dictation for macOS. Hold **Right ⌥**, speak, release —
clean text appears in whatever app you're using. Nothing ever leaves your Mac.

- **Transcription:** whisper.cpp (Metal) with downloadable ggml models
- **Cleanup:** a small local LLM via Apple MLX removes filler words and fixes
  punctuation — conservatively, and it never blocks your transcript
- **Vocabulary:** your names and jargon, biased into recognition and corrected
  deterministically
- **Privacy:** no telemetry, no accounts, no cloud. The only network use is
  downloading models from Hugging Face when you ask.

## Quick start

    make cert     # one-time: stable local signing identity (keeps permissions across rebuilds)
    make run      # build, bundle, launch

1. Grant **Microphone** and **Accessibility** in the setup window.
2. Settings → Models: download **Base** (fast) or **Small** (better), and the
   cleanup LLM if you want AI cleanup.
3. Hold **Right ⌥** anywhere and talk. Double-tap to lock hands-free; **Esc** cancels.

## Controls

| Action | Key |
|---|---|
| Push-to-talk | hold Right ⌥ |
| Hands-free lock | double-tap Right ⌥ (press once to stop) |
| Cancel | Esc |
| Alternative toggle | configurable in Settings → General |

## Development

    make test     # unit + integration tests
    make bundle   # build dist/LocalFlow.app

See `docs/superpowers/specs/` for the design spec and `docs/TESTING.md` for
the manual test checklist (TCC/permission flows can't be automated).
```

- [ ] **Step 7: Full verification pass**

Run: `swift test 2>&1 | tail -3` — all green.
Run: `make bundle && make run`, then walk `docs/TESTING.md` top to bottom and check every box. Confirm: history menu fills up and copies; alternative shortcut records and toggles; launch-at-login toggle survives an app restart; injection method "type" works in TextEdit.

- [ ] **Step 8: Commit**

```bash
git add Package.swift Sources README.md
git commit -m "feat: history menu, alternate shortcut, launch-at-login, docs"
```

---

## Plan self-review notes (already applied)

- Spec coverage: all P0–P7 spec items map to Tasks 1–14; P8 items (Command Mode, streaming preview, vocab auto-learn) are explicitly out of scope.
- The `// CLEANUP` and `// INJECT` markers in Task 9 are replaced by Tasks 12 and 10 respectively; Task 11 renames direct phase writes to `setPhase`. Executors of Tasks 10–12: read the current `DictationController` before editing — markers may have shifted lines.
- Verified-by-download facts baked in: whisper xcframework checksum, model byte sizes, `whisper_full_params` field names (v1.9.1 header), `ChatSession`/`loadModelContainer`/`#hubDownloader` signatures (mlx-swift-lm 3.31.4), `HubCache(location: .fixed(directory:))` (swift-huggingface 0.9.0).
