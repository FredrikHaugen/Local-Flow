import Foundation

public enum DictationPhase: String, Equatable, Sendable {
    case idle, recording, transcribing, cleaning, injecting
}

public enum DictationEvent: Equatable, Sendable {
    case startRecording, stopRecording, cancel, transcriptReady, cleanupDone, injectionDone, failed
}

public struct DictationStateMachine: Sendable {
    public private(set) var phase: DictationPhase = .idle

    public init() {}

    @discardableResult
    public mutating func handle(_ event: DictationEvent) -> Bool {
        switch (phase, event) {
        case (.idle, .startRecording): phase = .recording
        case (.recording, .stopRecording): phase = .transcribing
        case (.transcribing, .transcriptReady): phase = .cleaning
        case (.cleaning, .cleanupDone): phase = .injecting
        case (.injecting, .injectionDone): phase = .idle
        case (.recording, .cancel), (.transcribing, .cancel), (.cleaning, .cancel), (.injecting, .cancel):
            phase = .idle
        case (.recording, .failed), (.transcribing, .failed), (.cleaning, .failed), (.injecting, .failed):
            phase = .idle
        default:
            return false
        }
        return true
    }
}
