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
    /// Anything shorter than 0.3 s of trimmed audio is an accidental tap.
    private let minSamples = 4_800

    func start() {
        audio.onLevel = { [weak self] level in self?.onLevel?(level) }
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
            phase = machine.phase
        } catch {
            _ = audio.stop()
            machine.handle(.failed)
            phase = machine.phase
            NSLog("LocalFlow audio start failed: \(error.localizedDescription)")
        }
    }

    private func endRecording() {
        guard machine.handle(.stopRecording) else { return }
        phase = machine.phase
        let raw = audio.stop()
        let trimmed = trimmer.trim(raw)
        guard trimmed.count >= minSamples else {
            machine.handle(.failed)
            phase = machine.phase
            return
        }
        process(samples: trimmed)
    }

    private func cancelDictation() {
        guard machine.handle(.cancel) else { return }
        _ = audio.stop()
        phase = machine.phase
    }

    private func process(samples: [Float]) {
        Task { [weak self] in
            guard let self else { return }
            do {
                let modelID = UserDefaults.standard.string(forKey: "whisperModel") ?? WhisperModel.default.id
                guard let model = WhisperModel.catalog.first(where: { $0.id == modelID }),
                      let path = ModelManager.shared.installedPath(for: model) else {
                    throw TranscriptionEngine.TranscriptionError.modelNotFound
                }
                let language = UserDefaults.standard.string(forKey: "language") ?? "auto"
                let raw = try await transcriber.transcribe(
                    samples: samples, modelPath: path.path, language: language, prompt: nil)
                let filtered = filter.clean(raw)
                guard !filtered.isEmpty else {
                    machine.handle(.failed); phase = machine.phase
                    lastTranscript = "Didn't catch that"
                    return
                }
                machine.handle(.transcriptReady); phase = machine.phase
                let cleaned = filtered // CLEANUP — Task 12 replaces this line with CleanupEngine
                machine.handle(.cleanupDone); phase = machine.phase
                lastTranscript = cleaned
                NSLog("LocalFlow transcript: \(cleaned)")
                let method = InjectionMethod(
                    rawValue: UserDefaults.standard.string(forKey: "injectionMethod") ?? "paste") ?? .paste
                let result = await injector.inject(cleaned, method: method)
                machine.handle(.injectionDone); phase = machine.phase
                switch result {
                case .pasted, .typed:
                    lastTranscript = cleaned
                case .clipboardOnly:
                    lastTranscript = "⚠️ Copied to clipboard — press ⌘V (injection blocked)"
                case .blockedSecureField:
                    lastTranscript = "Secure field — dictation blocked"
                case .noText:
                    lastTranscript = "Didn't catch that"
                }
            } catch {
                machine.handle(.failed); phase = machine.phase
                lastTranscript = error.localizedDescription
            }
        }
    }
}
