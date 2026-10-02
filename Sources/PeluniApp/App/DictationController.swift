import SwiftUI
import PeluniCore
import KeyboardShortcuts

extension KeyboardShortcuts.Name {
    static let toggleDictation = Self("toggleDictation")
}

@MainActor
final class DictationController: ObservableObject {
    @Published private(set) var phase: DictationPhase = .idle
    @Published private(set) var lastTranscript: String = ""
    @Published private(set) var history: [String] = []
    var onLevel: ((Float) -> Void)?

    private var machine = DictationStateMachine()
    private let hotkey = HotkeyMonitor()
    private let audio = AudioCaptureService()
    private let trimmer = VADTrimmer()
    private let transcriber = TranscriptionEngine()
    private let filter = HallucinationFilter()
    private let injector = TextInjector()
    private let overlay = OverlayController()
    let cleanup = CleanupEngine(llmDir: ModelManager.shared.llmDir)
    /// Anything shorter than 0.3 s of trimmed audio is an accidental tap.
    private let minSamples = 4_800
    private var started = false
    private var shortcutTask: Task<Void, Never>?

    private func setPhase(_ p: DictationPhase, message: String? = nil) {
        phase = p
        overlay.update(phase: p, message: message)
    }

    func start() {
        guard !started else { return }
        started = true
        audio.onLevel = { [weak self] level in
            self?.onLevel?(level)
            self?.overlay.model.push(level: level)
        }
        hotkey.onIntent = { [weak self] intent in
            guard let self else { return }
            switch intent {
            case .begin: self.beginRecording()
            case .end: self.endRecording()
            case .cancel: self.cancelDictation()
            }
        }
        hotkey.start()

        shortcutTask = Task { [weak self] in
            for await event in KeyboardShortcuts.events(for: .toggleDictation) where event == .keyDown {
                self?.toggleDictation()
            }
        }
    }

    func stop() {
        guard started else { return }
        started = false
        hotkey.stop()
        shortcutTask?.cancel()
        shortcutTask = nil
        if phase == .recording {
            machine.handle(.cancel)
            _ = audio.stop()
            setPhase(machine.phase)
        }
    }

    func toggleDictation() {
        switch phase {
        case .idle: beginRecording()
        case .recording: endRecording()
        default: break
        }
    }

    private func beginRecording() {
        // Refuse before recording, not after: otherwise the user speaks a whole
        // sentence into a recording that can only be thrown away.
        // With the mic denied the engine still "records" — silence — and the
        // user's sentence vanishes with no message. Refuse up front instead.
        let permissions = AppState.shared.permissions
        permissions.refresh()
        guard permissions.micGranted else {
            hotkey.reset()
            let message = "Microphone access is off. Allow it in peluni Setup."
            lastTranscript = message
            setPhase(machine.phase, message: message)
            OnboardingWindowController.showIfNeeded(permissions: permissions, models: .shared)
            return
        }
        guard ModelManager.shared.activeModel != nil else {
            hotkey.reset()
            let message = TranscriptionEngine.TranscriptionError.modelNotFound.localizedDescription
            lastTranscript = message
            setPhase(machine.phase, message: message)
            OnboardingWindowController.showIfNeeded(permissions: AppState.shared.permissions, models: .shared)
            return
        }
        guard machine.handle(.startRecording) else { return }
        do {
            try audio.start()
            setPhase(machine.phase)
        } catch {
            _ = audio.stop()
            hotkey.reset()
            machine.handle(.failed)
            setPhase(machine.phase, message: error.localizedDescription)
            NSLog("peluni audio start failed: \(error.localizedDescription)")
        }
    }

    private func endRecording() {
        guard machine.handle(.stopRecording) else { return }
        setPhase(machine.phase)
        let raw = audio.stop()
        let trimmed = trimmer.trim(raw)
        guard trimmed.count >= minSamples else {
            machine.handle(.failed)
            setPhase(machine.phase)
            return
        }
        process(samples: trimmed)
    }

    private func cancelDictation() {
        guard machine.handle(.cancel) else { return }
        _ = audio.stop()
        setPhase(machine.phase)
    }

    private func process(samples: [Float]) {
        Task { [weak self] in
            guard let self else { return }
            let vocab = VocabularyEngine(entries: VocabularyStore.shared.entries)
            do {
                guard let model = ModelManager.shared.activeModel,
                      let path = ModelManager.shared.installedPath(for: model) else {
                    throw TranscriptionEngine.TranscriptionError.modelNotFound
                }
                let language = UserDefaults.standard.string(forKey: "language") ?? "auto"
                let raw = try await transcriber.transcribe(
                    samples: samples, modelPath: path.path, language: language, prompt: vocab.promptText)
                let filtered = filter.clean(raw)
                let corrected = vocab.apply(to: filtered)
                guard !corrected.isEmpty else {
                    machine.handle(.failed); setPhase(machine.phase, message: "Didn't catch that")
                    lastTranscript = "Didn't catch that"
                    return
                }
                guard machine.handle(.transcriptReady) else { return } // cancelled mid-transcription
                setPhase(machine.phase)
                let level = CleanupLevel(
                    rawValue: UserDefaults.standard.string(forKey: "cleanupLevel") ?? "light") ?? .light
                let llmID = UserDefaults.standard.string(forKey: "llmModel") ?? CleanupEngine.defaultModelID
                let glossary = vocab.glossaryTerms
                let cleaned = await cleanup.cleanup(
                    corrected, level: level, glossary: glossary, modelID: llmID)
                guard machine.handle(.cleanupDone) else { return } // cancelled mid-cleanup
                setPhase(machine.phase)
                lastTranscript = cleaned
                NSLog("peluni: transcript ready (\(cleaned.count) chars)")
                let method = InjectionMethod(
                    rawValue: UserDefaults.standard.string(forKey: "injectionMethod") ?? "paste") ?? .paste
                let result = await injector.inject(cleaned, method: method)
                machine.handle(.injectionDone)
                switch result {
                case .pasted, .typed:
                    lastTranscript = cleaned
                    self.history.insert(cleaned, at: 0)
                    if self.history.count > 10 { self.history.removeLast() }
                    setPhase(machine.phase, message: "✓ Inserted")
                case .clipboardOnly:
                    lastTranscript = "⚠️ Copied to clipboard — press ⌘V (injection blocked)"
                    self.history.insert(cleaned, at: 0)
                    if self.history.count > 10 { self.history.removeLast() }
                    setPhase(machine.phase, message: "Copied — press ⌘V")
                case .blockedSecureField:
                    lastTranscript = "Secure field — dictation blocked"
                    setPhase(machine.phase, message: "Secure field — blocked")
                case .noText:
                    lastTranscript = "Didn't catch that"
                    setPhase(machine.phase, message: "Didn't catch that")
                }
            } catch {
                machine.handle(.failed); setPhase(machine.phase, message: error.localizedDescription)
                lastTranscript = error.localizedDescription
            }
        }
    }
}
