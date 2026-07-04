import SwiftUI

@main
struct LocalFlowApp: App {
    var body: some Scene {
        MenuBarExtra("LocalFlow", systemImage: "mic") {
            Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }
        }
    }
}
