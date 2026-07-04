import SwiftUI
import LocalFlowCore

@MainActor
final class AppState: ObservableObject {
    static let shared = AppState()
    let permissions = PermissionsService()
    let dictation = DictationController()

    var statusText: String {
        switch dictation.phase {
        case .idle: dictation.lastTranscript.isEmpty ? "Idle" : dictation.lastTranscript
        case .recording: "● Recording…"
        case .transcribing: "Transcribing…"
        case .cleaning: "Cleaning…"
        case .injecting: "Inserting…"
        }
    }

    func startServices() {
        dictation.start()
    }
}
