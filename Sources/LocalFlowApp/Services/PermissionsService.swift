import AVFoundation
import ApplicationServices
import AppKit
import LocalFlowCore

enum PermissionPane {
    case microphone, accessibility

    var url: URL {
        switch self {
        case .microphone:
            URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone")!
        case .accessibility:
            URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility")!
        }
    }
}

@MainActor
final class PermissionsService: ObservableObject {
    @Published var micGranted = false
    @Published var accessibilityGranted = false
    private var timer: Timer?
    private var pollingClients = 0

    var allGranted: Bool { micGranted && accessibilityGranted }

    init() { refresh() }

    func refresh() {
        // Assign only on change: this runs every second while polling.
        let mic = AVCaptureDevice.authorizationStatus(for: .audio) == .authorized
        if mic != micGranted { micGranted = mic }
        let ax = AXIsProcessTrusted()
        if ax != accessibilityGranted { accessibilityGranted = ax }
    }

    var micAuthorization: MicAuthorization {
        switch AVCaptureDevice.authorizationStatus(for: .audio) {
        case .notDetermined: .notDetermined
        case .denied: .denied
        case .restricted: .restricted
        case .authorized: .authorized
        @unknown default: .denied
        }
    }

    /// One action per click: the system prompt while it can still appear, Settings after that.
    func grantMic() async {
        switch micAction {
        case .requestPrompt: await requestMic()
        case .openSystemSettings: openSystemSettings(pane: .microphone)
        case .none: break
        }
    }

    private static let accessibilityPromptKey = "accessibilityPromptShown"

    var micAction: PermissionAction { PermissionGuidance.micAction(for: micAuthorization) }

    var accessibilityAction: PermissionAction {
        PermissionGuidance.accessibilityAction(
            trusted: accessibilityGranted,
            promptedBefore: UserDefaults.standard.bool(forKey: Self.accessibilityPromptKey))
    }

    func grantAccessibility() {
        refresh()
        switch accessibilityAction {
        case .requestPrompt:
            UserDefaults.standard.set(true, forKey: Self.accessibilityPromptKey)
            objectWillChange.send()
            promptAccessibility()
        case .openSystemSettings:
            openSystemSettings(pane: .accessibility)
        case .none:
            break
        }
    }

    func requestMic() async {
        _ = await AVCaptureDevice.requestAccess(for: .audio)
        refresh()
    }

    func promptAccessibility() {
        let opts = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: true] as CFDictionary
        _ = AXIsProcessTrustedWithOptions(opts)
    }

    func openSystemSettings(pane: PermissionPane) {
        NSWorkspace.shared.open(pane.url)
    }

    func startPolling() {
        pollingClients += 1
        guard timer == nil else { return }
        let t = Timer(timeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.refresh() }
        }
        // .common so it keeps firing while a menu is open.
        RunLoop.main.add(t, forMode: .common)
        timer = t
    }

    func stopPolling() {
        pollingClients = max(0, pollingClients - 1)
        guard pollingClients == 0 else { return }
        timer?.invalidate()
        timer = nil
    }
}
