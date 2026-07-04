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
    private let transcriber = TranscriptionEngine()
    private let filter = HallucinationFilter()
    private let injector = TextInjector()
    private let overlay = OverlayController()
    let cleanup = CleanupEngine(llmDir: ModelManager.shared.llmDir)
    /// Anything shorter than 0.3 s of trimmed audio is an accidental tap.
    private let minSamples = 4_800

    private func setPhase(_ p: DictationPhase, message: String? = nil) {
        phase = p
        overlay.update(phase: p, message: message)
    }

    func start() {
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
    }

    private func beginRecording() {
        guard machine.handle(.startRecording) else { return }
        do {
            try audio.start()
            setPhase(machine.phase)
        } catch {
            _ = audio.stop()
            machine.handle(.failed)
            setPhase(machine.phase, message: error.localizedDescription)
            NSLog("LocalFlow audio start failed: \(error.localizedDescription)")
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
                let modelID = UserDefaults.standard.string(forKey: "whisperModel") ?? WhisperModel.default.id
                guard let model = WhisperModel.catalog.first(where: { $0.id == modelID }),
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
                machine.handle(.transcriptReady); setPhase(machine.phase)
                let level = CleanupLevel(
                    rawValue: UserDefaults.standard.string(forKey: "cleanupLevel") ?? "light") ?? .light
                let llmID = UserDefaults.standard.string(forKey: "llmModel") ?? CleanupEngine.defaultModelID
                let glossary = vocab.glossaryTerms
                let cleaned = await cleanup.cleanup(
                    corrected, level: level, glossary: glossary, modelID: llmID)
                machine.handle(.cleanupDone); setPhase(machine.phase)
                lastTranscript = cleaned
                NSLog("LocalFlow transcript: \(cleaned)")
                let method = InjectionMethod(
                    rawValue: UserDefaults.standard.string(forKey: "injectionMethod") ?? "paste") ?? .paste
                let result = await injector.inject(cleaned, method: method)
                machine.handle(.injectionDone)
                switch result {
                case .pasted, .typed:
                    lastTranscript = cleaned
                    setPhase(machine.phase, message: "✓ Inserted")
                case .clipboardOnly:
                    lastTranscript = "⚠️ Copied to clipboard — press ⌘V (injection blocked)"
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
