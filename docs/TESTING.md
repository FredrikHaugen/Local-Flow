# Manual test checklist

## Injection spike (macOS 26 Tahoe) — record verdict here
- Date / signing identity used:
- TextEdit / Safari URL bar / Terminal / Notes: paste OK?
- Secure field correctly blocked?
- Clipboard restored after ~1s?

## Permissions
- Fresh install: onboarding shows both permissions red; granting flips green within 1s.
- After rebuild with stable cert: permissions persist.
- `tccutil reset Accessibility com.figge.peluni` re-prompts correctly.
- Upgrade path (formerly LocalFlow): with models in `~/Library/Application Support/LocalFlow/` and no `peluni/` folder, first launch moves the folder (models show as installed, no re-download), and vocabulary and settings carry over.
- Upgrade path (formerly LocalFlow): with both `LocalFlow/` and `peluni/` present, neither is touched and peluni uses `peluni/`.

## Hotkey
- Hold ≥0.35s → PTT. Quick tap → discarded. Double-tap → hands-free lock; single press stops.
- Esc cancels in every phase. ⌥-click within 0.35s cancels (no accidental recording).

## Dictation
- 3s utterance lands in ≤1.5s after release (base model, post-warmup).
- "Didn't catch that" on silence. Model missing → clear error pointing to Settings → Models.
