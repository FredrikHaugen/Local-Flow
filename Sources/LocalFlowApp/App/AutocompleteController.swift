import AppKit
import Combine
import LocalFlowCore

/// Owns the autocomplete subsystem's full lifecycle. Off ⇒ no event tap, no
/// timers, no model in memory. Grows the keystroke pipeline in later tasks;
/// for now it only starts and stops cleanly.
@MainActor
final class AutocompleteController: ObservableObject {
    @Published private(set) var isRunning = false

    private weak var dictation: DictationController?

    func start(dictation: DictationController) {
        guard !isRunning else { return }
        self.dictation = dictation
        isRunning = true
        NSLog("LocalFlow: autocomplete subsystem started")
    }

    func stop() {
        guard isRunning else { return }
        isRunning = false
        NSLog("LocalFlow: autocomplete subsystem stopped")
    }
}
