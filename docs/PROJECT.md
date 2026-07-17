# LocalFlow

**Fully-local voice dictation for macOS.** Hold a hotkey anywhere, speak, release — clean, formatted text appears in whatever app you're using. It delivers the Wispr Flow experience with one fundamental difference: every byte of audio and text is processed on your Mac. No cloud, no accounts, no telemetry. The only network traffic the app ever produces is downloading model files from Hugging Face, and only when you explicitly ask it to.

## What it does

LocalFlow lives in the menu bar (no Dock icon). From any application:

- **Hold Right ⌥ (Option) and talk.** A floating pill overlay at the bottom of the screen shows a live waveform while it listens.
- **Release** — the recording is transcribed, cleaned up, and pasted into the focused text field, typically in about a second with the base model.
- **Double-tap Right ⌥** for hands-free lock (talk without holding the key; press once to stop). Quick accidental taps are detected and discarded.
- **Esc cancels** at any stage of the pipeline.
- A configurable secondary keyboard shortcut can toggle dictation as an alternative to the hold-key.

The menu bar shows live status, the last transcript, and a history of the last ten transcripts (in-memory only — nothing is persisted to disk) that can be copied back to the clipboard.

## The processing pipeline

Each dictation flows through a five-stage, on-device pipeline governed by an explicit state machine (`idle → recording → transcribing → cleaning → injecting → idle`, cancellable from any stage):

1. **Capture** — `AVAudioEngine` taps the microphone and converts to 16 kHz mono Float32 (whisper's native format), streaming RMS levels to the waveform overlay in real time.
2. **Trim** — an energy-based voice-activity trimmer strips leading/trailing silence; anything under 0.3 s of actual audio is treated as an accidental key tap and dropped silently.
3. **Transcribe** — [whisper.cpp](https://github.com/ggml-org/whisper.cpp) v1.9.1 with Metal GPU acceleration, using downloadable ggml models (Tiny → Large v3 Turbo; Base recommended as a starting point, multilingual with auto language detection). A hallucination filter then removes whisper's well-known non-speech artifacts (`[Music]`, `(applause)`, `♪ …`) while preserving genuine parentheticals.
4. **Clean up** — a small local LLM running on [Apple MLX](https://github.com/ml-explore/mlx-swift-lm) (default: Qwen3-4B-Instruct 4-bit) removes filler words and fixes punctuation, capitalization, and spacing. Four user-selectable levels: **None** (raw), **Light** (fillers & punctuation), **Medium** (also grammar and false starts), **High** (also sentence structure and dictated lists).
5. **Inject** — the text is pasted into the focused app via a synthesized ⌘V, with the previous clipboard contents snapshotted and restored afterwards. A character-by-character synthetic-typing fallback is available for apps that block programmatic paste.

## Custom vocabulary

Names, jargon, and technical terms that speech models routinely butcher get two layers of defense:

- **Recognition biasing** — vocabulary terms are fed to whisper as an `initial_prompt` glossary, nudging the acoustic model toward the right spellings, and to the cleanup LLM as terms to preserve verbatim.
- **Deterministic correction** — each term can carry "sounds like" aliases (e.g. *"whisper flow" → "Wispr Flow"*), applied after transcription as case-insensitive, word-boundary-anchored replacements. Replacement is single-pass against the original text, so one rule's output can never be re-matched and mangled by another.

Vocabulary is stored as plain JSON in `~/Library/Application Support/LocalFlow/vocabulary.json`.

## Reliability principles

The design encodes a few hard rules learned from the failure modes of dictation tools:

- **A transcript is never silently lost.** Every failure path ends with the text delivered somewhere visible or an explicit error: if paste fails, the transcript stays on the clipboard with a "press ⌘V" notice; if the mic or model is missing, the overlay says exactly what to fix.
- **AI cleanup can never block or corrupt a dictation.** The cleanup engine is a total function: any model-load error, generation error, or 10-second timeout falls back to the raw transcript. Output sanity guards reject hallucinated expansions, severe truncations, and chat-model artifacts (code fences, `<think>` blocks, wrapping quotes) — over-editing being the top complaint about cloud dictation tools. Very short utterances (configurable, default < 50 chars) skip cleanup entirely.
- **Secure fields are sacred.** If the focused element is a password field (checked via the Accessibility API both before and after the paste-settle delay, guarding the TOCTOU race), LocalFlow refuses to inject *and* refuses to write the transcript to the clipboard.
- **Memory is respected.** The LLM warm-loads with a one-token generation to absorb Metal shader compilation, caps the MLX GPU cache after each run, and unloads itself after 10 minutes of inactivity. The whisper context loads lazily and reloads only on model change.

## Technology

| Concern | Choice |
|---|---|
| Language / UI | Swift 6 toolchain, SwiftUI (`MenuBarExtra`, Settings scene, `NSPanel` overlay) |
| Speech-to-text | whisper.cpp xcframework (Metal, vendored with checksum verification) |
| LLM inference | mlx-swift-lm + swift-huggingface (HubCache-managed weights) |
| Hotkey | Custom `NSEvent` global/local monitors feeding a pure state machine — modifier-only bindings (Right ⌥) are impossible with Carbon-based shortcut libraries; [KeyboardShortcuts](https://github.com/sindresorhus/KeyboardShortcuts) is used only for the optional user-customizable toggle |
| Injection | CGEvent ⌘V paste (primary) / `keyboardSetUnicodeString` typing (fallback, surrogate-pair-safe chunking) |
| Distribution | SPM package, no `.xcodeproj`; the `.app` is assembled and codesigned by script; launch-at-login via `SMAppService` |

Requirements: Apple Silicon (arm64), macOS 14+, Microphone + Accessibility permissions (requested by a polling onboarding window with deep links into System Settings). The app is not sandboxed.

## Architecture

The package deliberately splits into two targets:

- **`LocalFlowCore`** — pure, dependency-free logic: the dictation and hotkey state machines (including the double-tap/hold/cancel timing rules), VAD trimmer, hallucination filter, vocabulary engine, cleanup prompt builder and output guards, and the model catalog. Everything here is deterministic and covered by unit tests that run without permissions, models, or hardware.
- **`LocalFlowApp`** — the executable: thin SwiftUI views and system-facing services (audio capture, event monitors, whisper and MLX actors, AX-based text injection, model downloads with atomic `.partial` → rename semantics and disk-space checks, permissions). `DictationController` orchestrates the pipeline and owns the state machine.

Integration tests (whisper smoke test against a real model) skip gracefully when models aren't downloaded; TCC-gated flows (permissions, injection) are covered by a manual test checklist since macOS makes them impossible to automate.

## Building

```sh
make vendor   # one-time: fetch + SHA256-verify the whisper.cpp xcframework
make cert     # one-time: create a stable local signing identity
make run      # build, bundle dist/LocalFlow.app, launch
make test     # unit + integration tests
```

Two build-system subtleties are load-bearing: the app bundle must be built with `xcodebuild` rather than `swift build` (SwiftPM cannot compile MLX's Metal shaders), and rebuilds must be signed with a stable identity or macOS revokes the Accessibility grant on every build — `make cert` creates a self-signed "LocalFlow Dev" certificate so permissions survive the development loop.

## Status & roadmap

Version 0.1.0. Deliberately out of scope for now: voice-driven command mode for editing selected text, live streaming partial transcripts while recording (transcription on release is already fast enough at >15× real-time), auto-learning vocabulary from corrections, persisted history, and non-macOS platforms.
