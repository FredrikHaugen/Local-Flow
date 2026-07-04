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

## Development

A fresh clone needs `make vendor` once before `make test`/`make bundle` will work.

    make test     # unit + integration tests
    make bundle   # build dist/LocalFlow.app

See `docs/superpowers/specs/` for the design spec and `docs/TESTING.md` for
the manual test checklist (TCC/permission flows can't be automated).
