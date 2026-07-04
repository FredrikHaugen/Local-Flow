import SwiftUI

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    @Published var statusText: String = "Idle"
    let permissions = PermissionsService()
    let hotkey = HotkeyMonitor()

    func startServices() {
        hotkey.onIntent = { [weak self] intent in
            self?.statusText = "Hotkey: \(intent)"
            NSLog("LocalFlow hotkey intent: \(intent)")
        }
        hotkey.start()
    }
}
