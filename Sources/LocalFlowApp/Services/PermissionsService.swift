import AVFoundation
import ApplicationServices
import AppKit

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
        micGranted = AVCaptureDevice.authorizationStatus(for: .audio) == .authorized
        accessibilityGranted = AXIsProcessTrusted()
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
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.refresh() }
        }
    }

    func stopPolling() {
        pollingClients = max(0, pollingClients - 1)
        guard pollingClients == 0 else { return }
        timer?.invalidate()
        timer = nil
    }
}
