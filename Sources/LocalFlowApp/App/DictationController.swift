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

    /// Task 9 replaces this stub with the real transcribe→clean→inject pipeline.
    private func process(samples: [Float]) {
        let seconds = Double(samples.count) / 16_000.0
        lastTranscript = String(format: "Captured %.1fs (%d samples)", seconds, samples.count)
        NSLog("LocalFlow: \(lastTranscript)")
        machine.handle(.failed) // no pipeline yet; return to idle
        phase = machine.phase
    }
}
