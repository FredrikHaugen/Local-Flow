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

    make vendor   # one-time: fetch + checksum-verify the whisper engine
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

## How it works

Every dictation runs through a five-stage, fully on-device pipeline, governed
by an explicit state machine (`idle → recording → transcribing → cleaning →
injecting → idle`, cancellable from any stage):

1. **Capture** — `AVAudioEngine` taps the mic at 16 kHz mono Float32 and
   streams levels to the waveform overlay.
2. **Trim** — an energy-based voice-activity trimmer strips silence; under
   0.3 s of speech is treated as an accidental key tap and discarded.
3. **Transcribe** — whisper.cpp with Metal GPU acceleration, with your
   vocabulary fed in as a recognition-biasing prompt. A hallucination filter
   removes whisper's non-speech artifacts (`[Music]`, `(applause)`, …).
4. **Clean up** — a small local LLM (Apple MLX) fixes punctuation and removes
   filler words at your chosen intensity. Cleanup can never block or corrupt
   a transcript: any error or timeout falls back to the raw text.
5. **Inject** — pasted into the focused app via synthesized ⌘V, with your
   clipboard snapshotted and restored. Password fields are detected and never
   touched.

A few hard rules run through the design: a transcript is never silently lost
(worst case it lands on the clipboard with a notification), secure fields get
no injection *and* no clipboard write, and everything — audio, text, models —
stays on your Mac.

The code splits into two targets: **`LocalFlowCore`** (pure, dependency-free
logic — state machines, VAD, filters, vocabulary — fully unit-tested without
permissions or models) and **`LocalFlowApp`** (SwiftUI plus thin services
wrapping the OS: audio, hotkeys, whisper, MLX, text injection).

The full story — vocabulary system, reliability principles, technology
choices — is in [`docs/PROJECT.md`](docs/PROJECT.md), and the design spec
lives in
[`docs/superpowers/specs/2026-07-04-localflow-design.md`](docs/superpowers/specs/2026-07-04-localflow-design.md).

## Development

A fresh clone needs `make vendor` once before `make test`/`make bundle` will work.

    make test     # unit + integration tests
    make bundle   # build dist/LocalFlow.app

See `docs/TESTING.md` for the manual test checklist (TCC/permission flows
can't be automated).

Two build subtleties are load-bearing: the app bundle must be built with
`xcodebuild` (`make bundle`), because `swift build` can't compile MLX's Metal
shaders; and rebuilds must be signed with the stable `make cert` identity or
macOS revokes permissions on every build. `CLAUDE.md` documents these and the
architecture for AI-assisted sessions.

## Contributing

Contributions are very welcome — this is an early project (v0.1.0) and help
is appreciated, whether that's a bug fix, a feature, docs, or just filing a
good issue. To get started:

1. Fork and clone, then `make vendor && make cert && make run`.
2. Make your change. New testable logic belongs in `LocalFlowCore` with unit
   tests; keep `LocalFlowApp` services as thin OS wrappers.
3. Run `make test`, and for changes touching permissions, hotkeys, or
   injection, walk the relevant parts of the manual checklist in
   `docs/TESTING.md`.
4. Open a pull request describing what changed and why.

Ideas that are deliberately out of scope for now (voice-driven editing
commands, live streaming transcripts, persisted history, non-macOS platforms)
are listed in `docs/PROJECT.md` — an issue to discuss one of these before
building it is the right first step. For anything else: small, focused PRs
are the easiest to review and merge.
