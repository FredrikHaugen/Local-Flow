import SwiftUI

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    @Published var statusText: String = "Idle"
    let permissions = PermissionsService()
}
