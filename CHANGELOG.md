# Changelog

What changed in peluni, newest first. Each line starts with what kind of change it is. Dates are when the change was made.

## 0.1.0 (unreleased)

### 2026-10-02

- Changed how cleanup loads a downloaded model: it now loads from disk without contacting Hugging Face. Before, loading it also asked huggingface.co about the model's files, on the first cleanup after launch and again after ten idle minutes. Those requests named the model, never anything you said.
- Fixed a half-finished model download counting as downloaded. It now shows as not downloaded, so you can download it again.
- Changed the name to peluni (formerly LocalFlow). On first launch, peluni moves your models, vocabulary and settings over from the old app, so nothing is downloaded again.
- Changed the app icon and the menu bar icon.

### 2026-10-01

- Added the speech model download to the setup window.
- Changed each permission button in the setup window to say what it will do: Allow, or Open Settings.
- Changed download errors to say what went wrong, such as no connection or not enough disk space, with a Retry button.
- Added a percentage to download progress bars.
- Fixed recording starting without microphone access or a speech model. peluni now says what's missing before you start talking.
- Added a Setup item to the menu bar menu, which reopens the setup window.
- Added a release script that signs peluni with a Developer ID and has Apple notarize it. It only matters if you build peluni yourself.

### 2026-07-19

- Added an experimental Autocomplete switch in Settings → General. It loads a small model but doesn't show suggestions yet.

### 2026-07-04

- Added the first working version (formerly LocalFlow): hold Right ⌥ to dictate, transcription with whisper.cpp on the GPU, optional cleanup by a local model at four levels, custom vocabulary, pasting with clipboard restore, and no typing into password fields.
