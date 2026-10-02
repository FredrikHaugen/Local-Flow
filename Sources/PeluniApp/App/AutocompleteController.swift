import AppKit
import Combine
import PeluniCore

/// Owns the autocomplete subsystem's full lifecycle. Off ⇒ no event tap, no
/// timers, no model in memory. This stage wires keystrokes → debounce →
/// trigger policy → AX context read, and logs the would-be trigger; the
/// model and overlay arrive in later tasks.
@MainActor
final class AutocompleteController: ObservableObject {
    @Published private(set) var isRunning = false

    private var policy = AutocompleteTriggerPolicy()
    private let tap = KeystrokeTapService()
    private var debounceWork: DispatchWorkItem?
    private var phaseSub: AnyCancellable?
    private var activationObserver: (any NSObjectProtocol)?
    private weak var dictation: DictationController?
    private var engine: CompletionEngine?
    private var completionTask: Task<Void, Never>?

    func start(dictation: DictationController, engine: CompletionEngine) {
        guard !isRunning else { return }
        self.dictation = dictation
        self.engine = engine
        policy = AutocompleteTriggerPolicy()
        // Tap callbacks fire on the tap's own thread; hop to the main actor.
        tap.onKeyDown = { [weak self] _ in
            DispatchQueue.main.async {
                self?.completionTask?.cancel()
                self?.feed(.keystroke(at: ProcessInfo.processInfo.systemUptime))
            }
        }
        tap.onPointerActivity = { [weak self] in
            DispatchQueue.main.async { self?.contextInvalidated() }
        }
        guard tap.start() else {
            // Accessibility revoked: leave the subsystem visibly dead rather
            // than pretending it runs.
            NSLog("peluni: autocomplete unavailable — event tap could not start")
            return
        }
        phaseSub = dictation.$phase.sink { [weak self] phase in
            _ = self?.policy.handle(.dictationBusyChanged(phase != .idle))
        }
        activationObserver = NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.didActivateApplicationNotification, object: nil, queue: .main
        ) { [weak self] _ in
            Task { @MainActor in self?.contextInvalidated() }
        }
        isRunning = true
        NSLog("peluni: autocomplete subsystem started")
    }

    func stop() {
        guard isRunning else { return }
        tap.stop()
        debounceWork?.cancel()
        completionTask?.cancel()
        completionTask = nil
        engine = nil
        phaseSub = nil
        if let activationObserver {
            NSWorkspace.shared.notificationCenter.removeObserver(activationObserver)
        }
        activationObserver = nil
        isRunning = false
        NSLog("peluni: autocomplete subsystem stopped")
    }

    /// Focus moved, app switched, scrolled, or clicked: any pending trigger
    /// is stale.
    private func contextInvalidated() {
        completionTask?.cancel()
        debounceWork?.cancel()
        feed(.focusChanged)
    }

    private func feed(_ event: AutocompleteTriggerPolicy.Event) {
        switch policy.handle(event) {
        case .scheduleDebounce(let interval):
            debounceWork?.cancel()
            let work = DispatchWorkItem { [weak self] in
                self?.feed(.debounceExpired(at: ProcessInfo.processInfo.systemUptime))
            }
            debounceWork = work
            DispatchQueue.main.asyncAfter(deadline: .now() + interval, execute: work)
        case .fire:
            fire()
        case .none:
            break
        }
    }

    private func fire() {
        guard let element = AXFocus.focusedElement(), !AXFocus.isSecure(element),
              let context = AXFocus.textBeforeCaret(element, maxChars: 400),
              policy.shouldRequestCompletion(context: context),
              let engine else { return }
        let modelID = UserDefaults.standard.string(forKey: "completionModel")
            ?? CompletionEngine.defaultModelID
        let started = ProcessInfo.processInfo.systemUptime
        completionTask = Task {
            guard let suggestion = await engine.complete(context: context, modelID: modelID),
                  !Task.isCancelled else { return }
            let ms = Int((ProcessInfo.processInfo.systemUptime - started) * 1000)
            NSLog("peluni: completion ready (\(ms) ms, \(suggestion.count) chars)")
            // Task 7 shows the overlay here.
        }
    }
}
