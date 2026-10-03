# peluni

Fully-local voice dictation for macOS. Hold **Right ⌥**, speak, release —
clean text appears in whatever app you're using. Nothing ever leaves your Mac.

**Website:** [peluni.app](https://peluni.app) · **Download:** [Releases](https://github.com/FredrikHaugen/peluni/releases)

- **Transcription:** whisper.cpp (Metal) with downloadable ggml models
- **Cleanup:** a small local LLM via Apple MLX removes filler words and fixes
  punctuation — conservatively, and it never blocks your transcript
- **Vocabulary:** your names and jargon, biased into recognition and corrected
  deterministically
- **Privacy:** no telemetry, no accounts, no cloud. The only network use is
  downloading models from Hugging Face when you ask.

## Install

1. Download `peluni-<version>.dmg` from the
   [Releases page](https://github.com/FredrikHaugen/peluni/releases).
   It is signed with a Developer ID and notarized by Apple, so it opens
   without Gatekeeper warnings. To check the download, put the `.sha256` file
   published with it in the same folder and run `shasum -a 256 -c peluni-<version>.dmg.sha256`.
2. Open the DMG and drag **peluni** onto **Applications**, then launch it.
   It lives in the menu bar (the peluni mark); there is no Dock icon.
3. The setup window walks you through three steps: allow **Microphone**,
   allow **Accessibility**, and download the **speech model**
   (148 MB). Then hold **Right ⌥** anywhere and talk.

### Upgrading from an earlier version

peluni (formerly LocalFlow) moves your downloaded models, vocabulary and settings over on first
launch, so nothing is downloaded again. It's a new app identity, so macOS asks for Microphone and
Accessibility once more, and "Launch at login" has to be switched on again. Once peluni works,
delete the old app from Applications.

## Requirements

**To run peluni**

- macOS 14 (Sonoma) or later
- A Mac with Apple Silicon (M1 or later). The app is built for arm64 only; Intel Macs aren't supported.
- Disk space for models, downloaded on first use:
  - Speech model: 78 MB (Tiny) to 1.6 GB (Large v3 Turbo). Base, the recommended start, is 148 MB.
  - Optional cleanup LLM: 0.7 GB (Llama 3.2 1B) or 2.3 GB (Qwen3 4B)
  - Optional autocomplete LLM (experimental: it loads, but suggestions aren't shown yet): 0.3 GB (Qwen2.5 0.5B), or reuse the 0.7 GB Llama 3.2 1B
- An internet connection only while downloading models; everything else works offline
- Microphone and Accessibility permissions (the setup window walks you through both)

**To build from source**

- A Mac with Apple Silicon running macOS 15.2 or later (Xcode 16.3's own minimum)
- Xcode 16.3 or later (Swift 6.1 toolchain). On Xcode 26 or later, also install
  the Metal Toolchain once: `xcodebuild -downloadComponent MetalToolchain`
  (MLX's shaders don't build without it).
- `make vendor` once, to fetch the pinned whisper.cpp v1.9.1 framework
- To publish a release: a Developer ID Application certificate and a
  `notarytool` keychain profile (see `scripts/release.sh`)

## Quick start (from source)

    make run

That's the whole loop. Every `make run` builds the current code, bundles it
into `dist/peluni.app`, quits any peluni that's already running, and
launches the new build. Run it again after each change.

The first run also does the one-time setup for you: it downloads and
checksum-verifies the whisper engine (`make vendor`) and creates a local
"peluni Dev" signing identity (`make cert`) so macOS keeps your
permissions across rebuilds. Expect the first build to take several minutes
(MLX is large); later builds are incremental. xcodebuild's full output is
shown, so a long quiet compile step is progress, not a hang.

Once it launches:

1. Follow the setup window: **Microphone**, **Accessibility**, and the
   **Base** speech model. Settings → Models has larger speech models and the
   optional cleanup LLM.
2. Hold **Right ⌥** anywhere and talk. Double-tap to lock hands-free; **Esc** cancels.

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

The code splits into two targets: **`PeluniCore`** (pure, dependency-free
logic — state machines, VAD, filters, vocabulary — fully unit-tested without
permissions or models) and **`PeluniApp`** (SwiftUI plus thin services
wrapping the OS: audio, hotkeys, whisper, MLX, text injection).

The full story — vocabulary system, reliability principles, technology
choices — is in [`docs/PROJECT.md`](docs/PROJECT.md), and the design spec
lives in
[`docs/superpowers/specs/2026-07-04-peluni-design.md`](docs/superpowers/specs/2026-07-04-peluni-design.md).

## Development

A fresh clone needs `make vendor` once before `make test`/`make bundle` will work.

    make test     # unit + integration tests
    make bundle   # build dist/peluni.app
    make release  # Developer ID sign, notarize, staple, and build dist/peluni-<version>.dmg

See `docs/TESTING.md` for the manual test checklist (TCC/permission flows
can't be automated).

Two build subtleties are load-bearing: the app bundle must be built with
`xcodebuild` (`make bundle`), because `swift build` can't compile MLX's Metal
shaders; and rebuilds must be signed with the stable `make cert` identity or
macOS revokes permissions on every build. `CLAUDE.md` documents these and the
architecture for AI-assisted sessions.

The marketing site is a separate Next.js project in `marketing-page/`
(`pnpm install && pnpm dev`); see its README.

## Contributing

Contributions are very welcome — this is an early project (v0.0.1, not released yet) and help
is appreciated, whether that's a bug fix, a feature, docs, or just filing a
good issue. To get started:

1. Fork and clone, then `make run`.
2. Make your change. New testable logic belongs in `PeluniCore` with unit
   tests; keep `PeluniApp` services as thin OS wrappers.
3. Run `make test`, and for changes touching permissions, hotkeys, or
   injection, walk the relevant parts of the manual checklist in
   `docs/TESTING.md`.
4. Open a pull request describing what changed and why.

Ideas that are deliberately out of scope for now (voice-driven editing
commands, live streaming transcripts, persisted history, non-macOS platforms)
are listed in `docs/PROJECT.md` — an issue to discuss one of these before
building it is the right first step. For anything else: small, focused PRs
are the easiest to review and merge.

## License

MIT — see [LICENSE](LICENSE). Third-party licenses ship inside the app at
`peluni.app/Contents/Resources/THIRD_PARTY_NOTICES.txt`.
