# LocalFlow — Design Spec

**Date:** 2026-07-04
**Status:** Approved in substance (user approved the build prompt; scope/name defaults chosen while user AFK — flagged below)
**Repo:** `/Users/figge/Dev/whispr-local`

## 1. Goal

A native macOS menu-bar dictation app that replicates Wispr Flow's core UX — hold a hotkey anywhere, speak, and get clean formatted text injected into the focused app — with **100% on-device processing and zero network calls** (the only network I/O is explicit, user-initiated model downloads from Hugging Face/GitHub).

### User decisions (from explicit Q&A)

- Stack: **native Swift/SwiftUI** menu-bar app
- Transcription: **whisper.cpp** (Metal, downloadable ggml models)
- Must-haves: **system-wide dictation**, **AI cleanup/formatting via local LLM**, **custom vocabulary**

### Defaults chosen while user was AFK (override freely)

- Session scope: **P0–P7** (full core; Command Mode P8 out of scope)
- App name: **LocalFlow**, bundle ID `com.figge.LocalFlow`

### Non-goals (v1)

- Command Mode (voice-driven editing of selected text) — P8 backlog
- Live streaming partial transcripts during recording (whisper base/small is >15× real-time; transcribe-on-release is fast enough; streaming is a later polish item)
- Auto-learning vocabulary from user corrections — backlog
- iOS/Windows, App Store distribution, sandboxing
- Transcript history persisted to disk (in-memory last 10 only)

## 2. Verified dependency decisions (evidence from 2026-07-04 research)

| Decision | Detail | Evidence |
|---|---|---|
| whisper.cpp via SPM `binaryTarget` | `whisper-v1.9.1-xcframework.zip` from official GitHub release (2026-06-19), checksum `8c3ecbe73f48b0cb9318fc3058264f951ab336fd530e82c4ccdd2298d1311a4c` (computed from downloaded asset). Metal embedded (`GGML_METAL_EMBED_LIBRARY=ON`), macOS 13.3+, `framework module whisper` modulemap — `import whisper` directly. | Package.swift deleted from whisper.cpp master (Mar 2025, PR #2873); README documents binaryTarget as the official path. whisper.spm is 2 years stale — do not use. |
| LLM via MLX | `ml-explore/mlx-swift-lm` **3.31.4** (products `MLXLLM`, `MLXLMCommon`, `MLXHuggingFace`) + `huggingface/swift-huggingface` for `HubClient`. Load: `loadModelContainer(from: #hubDownloader(HubClient(cache: HubCache(location: .fixed(directory: appSupport)))), using: #huggingFaceTokenizerLoader(), configuration:)`; drive via `ChatSession`. | Libraries moved out of mlx-swift-examples; 3.x broke old HubApi loading. macOS 14+, swift-tools 6.1. |
| Cleanup models (4-bit, mlx-community, all dense — MoE has a known 7× slowdown in mlx-swift-lm) | Default **Qwen3-4B-Instruct-2507-4bit** (2.28 GB); balanced Llama-3.2-3B-Instruct-4bit (1.82 GB); light Llama-3.2-1B-Instruct-4bit (0.71 GB) / gemma-3-1b-it-qat-4bit (0.77 GB). | Sizes verified via HF API. ~118 tok/s (M4 Pro) to ~150+ (M5-class) for 4B; 1B 2–3× faster. |
| Hotkey: custom monitor, NOT KeyboardShortcuts | KeyboardShortcuts **cannot** express modifier-only bindings (maintainer declined, issue #65; Carbon limitation). Primary PTT = `NSEvent.addGlobalMonitorForEvents(matching: .flagsChanged)` + local monitor; Hex-style `HotKeyProcessor` state machine (idle / pressAndHold / doubleTapLock, 0.3 s double-tap window, Esc cancel, dirty-state guard). Requires **Accessibility only**. Keep KeyboardShortcuts 3.x solely for an optional user-customizable key+modifier toggle shortcut (free recorder UI). | VoiceInk (5.4k★) ships Accessibility-only with this pattern; Hex's HotKeyProcessor is MIT and unit-tested. Reference clones in scratchpad. |
| Injection: paste-primary | Snapshot clipboard → set transcript → ~100 ms → post ⌘V key events to `.cghidEventTap` → restore clipboard. Secondary (per-app override): `CGEvent` `keyboardSetUnicodeString` synthetic typing. | VoiceInk `CursorPaster` and Hex `PasteboardClient` both ship paste-only on Tahoe; neither uses `keyboardSetUnicodeString`. |
| Signing | No identities on this Mac (`security find-identity` → 0). **Tahoe (observed 26.5) drops synthesized events from unsigned/ad-hoc background processes.** Plan: `scripts/make-cert.sh` creates a stable self-signed "LocalFlow Dev" codesigning cert; bundle signed with it (stable TCC identity across rebuilds). De-risk in P3 spike; fallback = free Apple Development identity via Xcode GUI. | nick-liu.com Tahoe hotkey post; trycua/cua#870. Properly signed bundled GUI apps are not reported broken. |
| Whisper models | HF `ggerganov/whisper.cpp` `resolve/main/ggml-<model>.bin`. Multilingual default (user may dictate Norwegian): default download **base** (148 MB), recommend **small** (488 MB) in UI; offer tiny/medium/large-v3-turbo (1.62 GB). Language setting: auto + explicit picker. | URL pattern + exact sizes verified via HF API. |

## 3. Architecture

SPM executable package; `.app` bundle assembled by script (no .xcodeproj). Not sandboxed. arm64 only. macOS 14.0+ (MLX floor).

```
Package LocalFlow
├── Target: LocalFlowCore  (library — pure logic, zero system-framework deps beyond Foundation)
│     DictationStateMachine, HotKeyProcessor, VADTrimmer, HallucinationFilter,
│     VocabularyEngine (replacement map + whisper prompt builder),
│     CleanupPromptBuilder (level → system prompt), Models (Settings, VocabularyEntry, …)
├── Target: LocalFlowApp   (executable — SwiftUI + services, depends on Core + whisper + MLX)
│     App/         LocalFlowApp (MenuBarExtra), AppState (@MainActor observable)
│     Services/    AudioCaptureService, HotkeyMonitor, TranscriptionEngine (actor),
│                  CleanupEngine (actor), TextInjector, ModelManager, PermissionsService
│     UI/          MenuBarView, OverlayPanel (NSPanel) + OverlayView (waveform pill),
│                  SettingsWindow { GeneralTab, ModelsTab, VocabularyTab, PermissionsTab, AdvancedTab },
│                  OnboardingWindow
├── Target: whisper (binaryTarget, v1.9.1 xcframework)
├── Deps: mlx-swift-lm 3.31.4, swift-huggingface, KeyboardShortcuts 3.x
└── Tests: LocalFlowCoreTests (XCTest), LocalFlowIntegrationTests (model-gated)
```

**Component contracts** (what it does / interface / depends on):

- **AudioCaptureService** — mic → PCM. `start() throws`, `stop() -> [Float]` (16 kHz mono Float32, VAD-trimmed), `levels: AsyncStream<Float>` (RMS ~30 Hz for waveform). AVAudioEngine input tap + AVAudioConverter. Never enable voice-processing IO (9-channel format trap).
- **HotkeyMonitor** — OS events → intents. Emits `AsyncStream<HotkeyIntent>` (`beginPTT`, `endPTT`, `toggleLock`, `cancel`). Wraps NSEvent global+local monitors; translates OS events into Core's own `KeyInput` value type and feeds them to `HotKeyProcessor` (keeping Core free of AppKit). Default binding Right Option (keycode 61); alternates: Fn, Right Cmd, F-keys.
- **TranscriptionEngine** (actor) — samples → text. `transcribe(_ samples: [Float], language: Language, prompt: String?) async throws -> String`. Owns `whisper_context` (loaded lazily, reload on model change); Metal on; runs hallucination filter before returning.
- **CleanupEngine** (actor) — raw text → cleaned text. `cleanup(_ text: String, level: CleanupLevel, timeout: Duration = .seconds(10)) async -> String`. **Total function: any error/timeout returns input unchanged.** MLX ChatSession; warmup 1-token generation at load; `MLX.GPU.set(cacheLimit:)` after generation; idle-unload after 10 min; skips input < 50 chars or level == .none.
- **TextInjector** — text → focused app. `inject(_ text: String) async -> InjectionResult` (.pasted / .typed / .clipboardOnly / .blockedSecureField). Checks AX focused element for secure fields first; paste-primary with clipboard snapshot/restore; leaves text on clipboard + notifies on failure.
- **ModelManager** (@MainActor observable) — model files. Lists catalog (whisper + LLM), download w/ progress (URLSession download task, size validation, .partial then atomic rename), delete, disk-space check. Whisper models: `~/Library/Application Support/LocalFlow/Models/whisper/`. LLM weights: HubCache fixed dir under `~/Library/Application Support/LocalFlow/Models/llm/`.
- **OverlayController** — non-activating borderless NSPanel (`.nonactivatingPanel`, floating level, all-spaces collection behavior), bottom-center; SwiftUI pill: waveform bars from `levels`, state label (Listening… / Transcribing… / Cleaning… / ✓ Inserted / error), Esc hint. Auto-dismiss ~1 s after terminal state.
- **VocabularyStore** — JSON at `~/Library/Application Support/LocalFlow/vocabulary.json`. Entries: `term`, optional `soundsLike: [String]`. Feeds (a) whisper `initial_prompt` (terms joined, capped ~180 tokens), (b) post-transcription word-boundary, case-preserving replacements (soundsLike → term).
- **DictationController** (@MainActor) — orchestrator; owns the Core state machine: `idle → recording → transcribing → cleaning → injecting → idle`, with `cancel` from any active state (Esc or menu) and error edges back to idle. Single in-flight dictation; hotkey during processing is ignored (v1).
- **PermissionsService** — mic (`AVCaptureDevice.authorizationStatus`) + Accessibility (`AXIsProcessTrusted`, prompt via `AXIsProcessTrustedWithOptions`); deep-links to System Settings panes; polls while onboarding visible; re-checks at every launch (Tahoe resets reported after OS updates).

## 4. Data flow (happy path)

1. User holds Right Option → `HotkeyMonitor` → `beginPTT` → `DictationController` → `AudioCaptureService.start()` + overlay (Listening, live waveform). Double-tap locks hands-free; Esc cancels.
2. Release → `endPTT` → `stop()` returns trimmed samples. < 0.3 s of audio → discard silently (accidental tap).
3. `TranscriptionEngine.transcribe(samples, language, prompt: vocabulary.promptText)` → raw text → hallucination filter → vocabulary replacements.
4. `CleanupEngine.cleanup(text, level: settings.cleanupLevel)` — overlay shows Cleaning; falls back to raw on any failure.
5. `TextInjector.inject(cleaned)` → paste into focused app → overlay ✓ → auto-dismiss → idle. Transcript appended to in-memory history (last 10, menu-accessible).

## 5. Error handling

Principle: **a spoken transcript is never silently lost.** Every failure ends with text delivered somewhere visible or an explicit error UI.

| Failure | Behavior |
|---|---|
| Mic permission missing | Onboarding/alert with deep-link; hotkey shows overlay error state |
| Accessibility missing | Same; injection degrades to clipboard-only + notification |
| Whisper model missing | Overlay error → opens Models tab; download prompt |
| whisper.cpp init/transcribe error | Overlay error + user notification; log |
| Empty/whitespace transcript | Overlay "Didn't catch that"; no injection |
| LLM load/generate error or >10 s timeout | Silent fallback to raw transcript (log); dictation still completes |
| Paste fails / no focused element | Text left on clipboard + notification "Copied — press ⌘V" |
| Secure field focused | No injection, no clipboard write; overlay "Secure field — dictation blocked" |
| Download failure | Retryable error in Models tab; partial file cleaned up |
| Event monitor dead (Tahoe gate) | P3 spike detects; startup self-check warns if AXIsProcessTrusted false |

## 6. Testing

- **Unit (CI-able, no TCC):** LocalFlowCore — HotKeyProcessor transitions (incl. double-tap window edges, Esc, dirty-state), DictationStateMachine legal/illegal transitions, VADTrimmer, HallucinationFilter cases, VocabularyEngine (case preservation, word boundaries, prompt capping), CleanupPromptBuilder levels.
- **Integration (local, gated):** transcribe bundled 3-s WAV fixture with tiny model if present under Models dir (skip otherwise); CleanupEngine timeout-fallback with a mock generator.
- **Manual checklist** (`docs/TESTING.md`): permissions flows, injection into TextEdit/Slack-like/Terminal/secure field, hotkey while other modifiers held, model download cancel/resume, rebuild → permissions persist (cert stability).

## 7. Packaging & signing

- `Makefile`: `make build` (swift build -c release), `make bundle` (assemble LocalFlow.app: Info.plist with `LSUIElement=true`, `NSMicrophoneUsageDescription`, min macOS 14; copy binary; codesign), `make run`, `make test`, `make cert`.
- `scripts/make-cert.sh`: create/import self-signed "LocalFlow Dev" codesigning cert (stable identity → TCC grants survive rebuilds); ad-hoc fallback with warning.
- Launch-at-login via `SMAppService` (P7 toggle).

## 8. Phases

- **P0 Skeleton** — package layout, MenuBarExtra app, bundle+sign scripts, Settings shell, PermissionsService + onboarding. *Exit: signed .app runs in menu bar, shows permission status.*
- **P1 Capture + hotkey** — AudioCaptureService, HotkeyMonitor + HotKeyProcessor (unit-tested), record-on-hold with RMS logged. *Exit: hold Right Option → samples captured.*
- **P2 Transcription** — whisper binaryTarget, TranscriptionEngine, ModelManager + Models tab (download base). *Exit: dictation prints transcript to log/debug UI.*
- **P3 Injection spike (de-risk Tahoe)** — TextInjector paste-primary + secure-field check; verify on this Mac with self-signed cert into TextEdit + Terminal. *Exit: text lands in focused app; Tahoe risk resolved or fallback plan activated.*
- **P4 Overlay** — panel, waveform, states, Esc cancel. *Exit: full visual feedback loop.*
- **P5 Cleanup** — MLX deps, CleanupEngine, levels in Settings, timeout fallback, idle-unload. *Exit: "um so this is uh a test" → "This is a test." fully offline.*
- **P6 Vocabulary** — store, prompt bias, replacements, Vocabulary tab. *Exit: custom term recognized + replaced.*
- **P7 Polish** — toggle-lock UX, alternate shortcut (KeyboardShortcuts), launch-at-login, history menu, model recommendations, README.
- **P8 (backlog)** — Command Mode, streaming preview, auto-learn vocabulary.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Tahoe drops synthesized events for self-signed-cert apps too | P3 spike immediately after P2; fallback: free Apple Development identity (Xcode is installed); worst case: clipboard-only mode still useful |
| MLX first-load latency (multi-sec) + ~2.3 GB working set | Warmup at load, idle-unload timer, 1B model option, lazy load on first cleanup |
| Whisper accuracy for Norwegian on base | Multilingual models + language picker; recommend small/medium in UI |
| TCC re-prompts during dev | Stable self-signed cert; documented `tccutil reset` recovery |
| mlx-swift-lm API churn (3.x is new) | Pin exact versions; CleanupEngine isolated behind a protocol so runtime can be swapped (llama.cpp xcframework fallback documented) |
