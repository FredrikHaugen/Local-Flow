import Foundation

/// Pure decision logic for when inline autocomplete may fire.
/// Fed timestamped events by the app layer (which owns the actual timer),
/// mirroring the HotKeyProcessor / HotkeyMonitor split.
public struct AutocompleteTriggerPolicy: Sendable {
    public enum Event: Equatable, Sendable {
        case keystroke(at: TimeInterval)
        case debounceExpired(at: TimeInterval)
        case suggestionShown
        case suggestionDismissed
        case dictationBusyChanged(Bool)
        case focusChanged
    }

    public enum Action: Equatable, Sendable {
        case scheduleDebounce(after: TimeInterval)
        case fire
        case none
    }

    public var debounceInterval: TimeInterval = 0.18
    public var minContextLength: Int = 20

    public private(set) var suggestionVisible = false
    public private(set) var dictationBusy = false
    private var lastKeystrokeAt: TimeInterval?

    public init() {}

    public mutating func handle(_ event: Event) -> Action {
        switch event {
        case .keystroke(let t):
            if dictationBusy { return .none }
            lastKeystrokeAt = t
            return .scheduleDebounce(after: debounceInterval)

        case .debounceExpired(let t):
            guard let last = lastKeystrokeAt,
                  t - last >= debounceInterval,
                  !suggestionVisible, !dictationBusy else { return .none }
            lastKeystrokeAt = nil
            return .fire

        case .suggestionShown:
            suggestionVisible = true
            return .none

        case .suggestionDismissed:
            suggestionVisible = false
            return .none

        case .dictationBusyChanged(let busy):
            dictationBusy = busy
            if busy { lastKeystrokeAt = nil }
            return .none

        case .focusChanged:
            lastKeystrokeAt = nil
            return .none
        }
    }

    /// Gate applied by the caller after reading the focused element's text.
    public func shouldRequestCompletion(context: String) -> Bool {
        context.trimmingCharacters(in: .whitespacesAndNewlines).count >= minContextLength
    }
}
