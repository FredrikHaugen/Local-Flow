import SwiftUI

@main
struct LocalFlowApp: App {
    @StateObject private var appState = AppState.shared

    var body: some Scene {
        MenuBarExtra {
            MenuContent()
                .environmentObject(appState)
        } label: {
            Image(systemName: "mic")
                .onAppear {
                    OnboardingWindowController.showIfNeeded(permissions: appState.permissions)
                    appState.startServices()
                }
        }

        Settings {
            SettingsView().environmentObject(appState)
        }
    }
}

private struct MenuContent: View {
    @EnvironmentObject var appState: AppState
    @ObservedObject private var dictation: DictationController

    init() { _dictation = ObservedObject(wrappedValue: AppState.shared.dictation) }

    var body: some View {
        Text(appState.statusText)
        Divider()
        SettingsLink { Text("Settings…") }.keyboardShortcut(",")
        Divider()
        Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }.keyboardShortcut("q")
    }
}
