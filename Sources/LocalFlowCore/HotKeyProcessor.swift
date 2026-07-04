import Foundation

public enum ProcessorEvent: Equatable, Sendable {
    case targetDown(at: TimeInterval)
    case targetUp(at: TimeInterval)
    case escape
    case otherKeyDown(at: TimeInterval)
    case mouseDown(at: TimeInterval)
    case tapWindowExpired(at: TimeInterval)
}

public enum ProcessorAction: Equatable, Sendable {
    case startRecording
    case stopAndTranscribe
    case cancelRecording
    case none
}

public struct HotKeyProcessor: Sendable {
    public enum State: Equatable, Sendable {
        case idle
        case pressAndHold(startedAt: TimeInterval)
        case tapPending(releasedAt: TimeInterval)
        case locked
    }

    public private(set) var state: State = .idle
    public var doubleTapWindow: TimeInterval = 0.3
    public var minHoldDuration: TimeInterval = 0.35

    public init() {}

    public mutating func handle(_ event: ProcessorEvent) -> ProcessorAction {
        switch (state, event) {
        case (.idle, .targetDown(let t)):
            state = .pressAndHold(startedAt: t)
            return .startRecording
        case (.idle, _):
            return .none

        case (.pressAndHold(let s), .targetUp(let t)):
            if t - s >= minHoldDuration {
                state = .idle
                return .stopAndTranscribe
            }
            state = .tapPending(releasedAt: t)
            return .none
        case (.pressAndHold, .escape):
            state = .idle
            return .cancelRecording
        case (.pressAndHold(let s), .mouseDown(let t)),
             (.pressAndHold(let s), .otherKeyDown(let t)):
            if t - s < minHoldDuration {
                state = .idle
                return .cancelRecording
            }
            return .none
        case (.pressAndHold, _):
            return .none

        case (.tapPending(let r), .targetDown(let t)):
            state = t - r <= doubleTapWindow ? .locked : .pressAndHold(startedAt: t)
            return .none
        case (.tapPending(let r), .tapWindowExpired(let t)):
            if t - r >= doubleTapWindow {
                state = .idle
                return .cancelRecording
            }
            return .none
        case (.tapPending, .escape), (.tapPending, .mouseDown), (.tapPending, .otherKeyDown):
            state = .idle
            return .cancelRecording
        case (.tapPending, _):
            return .none

        case (.locked, .targetDown):
            state = .idle
            return .stopAndTranscribe
        case (.locked, .escape):
            state = .idle
            return .cancelRecording
        case (.locked, _):
            return .none
        }
    }
}
