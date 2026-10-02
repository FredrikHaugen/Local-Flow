# Changelog

What changed in peluni, newest first. Dates are when the change was made.

## 0.1.0 (unreleased)

### 2026-10-02

- Cleanup loads its model from disk once it's downloaded, so dictating never contacts Hugging Face. A half-finished model download no longer counts as downloaded, so it can be downloaded again.
- Renamed to peluni (formerly LocalFlow). On first launch, peluni moves your models, vocabulary and settings over from the old app, so nothing is downloaded again.
- New app icon and menu bar icon.

### 2026-10-01

- The setup window now includes the speech model download, and each permission button says what it will do: Allow, or Open Settings.
- Download errors say what went wrong, such as no connection or not enough disk space, and offer Retry. Progress bars show a percentage.
- peluni refuses to record without microphone access or a speech model, before you start talking.
- A Setup item in the menu bar menu reopens the setup window.
- A release script that signs the app with a Developer ID and has Apple notarize it.

### 2026-07-19

- An experimental Autocomplete switch in Settings → General. It loads a small model but doesn't show suggestions yet.

### 2026-07-04

- First working version (formerly LocalFlow): hold Right ⌥ to dictate, transcription with whisper.cpp on the GPU, optional cleanup by a local model at four levels, custom vocabulary, pasting with clipboard restore, and no typing into password fields.
