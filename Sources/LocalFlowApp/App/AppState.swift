import SwiftUI
import Combine
import LocalFlowCore

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    let permissions = PermissionsService()
    let dictation = DictationController()
    let autocomplete = AutocompleteController()
    /// One engine instance app-wide: Settings uses it for downloads, the
    /// controller for completions. Creation is cheap — weights load lazily.
    let completionEngine = CompletionEngine(llmDir: ModelManager.shared.llmDir)

    var statusText: String {
        switch dictation.phase {
        case .idle: dictation.lastTranscript.isEmpty ? "Idle" : dictation.lastTranscript
        case .recording: "● Recording…"
        case .transcribing: "Transcribing…"
        case .cleaning: "Cleaning…"
        case .injecting: "Inserting…"
        }
    }

    private var accessibilityObserver: AnyCancellable?

    func startServices() {
        UserDefaults.standard.register(defaults: ["dictationEnabled": true])
        applyInputModeSettings()
        guard !permissions.accessibilityGranted, accessibilityObserver == nil else { return }
        // Poll even if the setup window gets closed, so the hotkey comes alive
        // whenever trust is granted, without a relaunch.
        permissions.startPolling()
        // Once trusted, wait for dictation to be idle (it can be running via the
        // toggle shortcut) so the restart never cancels an in-flight transcript.
        accessibilityObserver = permissions.$accessibilityGranted
            .filter { $0 }
            .first()
            .map { [dictation] _ in dictation.$phase.filter { $0 == .idle }.first() }
            .switchToLatest()
            .sink { [weak self] _ in
                guard let self else { return }
                self.permissions.stopPolling()
                self.restartInputModes()
            }
    }

    /// Event monitors and taps created before Accessibility was granted never
    /// deliver events; recreate them once trust arrives.
    func restartInputModes() {
        guard dictation.phase == .idle else { return }
        dictation.stop()
        autocomplete.stop()
        applyInputModeSettings()
    }

    /// Each master toggle owns its subsystem's lifecycle; either mode runs
    /// alone, both run together, and toggling one never touches the other.
    func applyInputModeSettings() {
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: "dictationEnabled") {
            dictation.start()
        } else {
            dictation.stop()
        }
        if defaults.bool(forKey: "autocompleteEnabled") {
            autocomplete.start(dictation: dictation, engine: completionEngine)
            // Pre-warm so the first suggestion doesn't pay multi-second load
            // latency. Only when already downloaded — never a network trigger.
            let modelID = defaults.string(forKey: "completionModel")
                ?? CompletionEngine.defaultModelID
            if completionEngine.isModelDownloaded(modelID: modelID) {
                Task { try? await completionEngine.warmUp(modelID: modelID, progress: { _ in }) }
            }
        } else {
            autocomplete.stop()
            Task { await completionEngine.unloadNow() }
        }
    }
}
