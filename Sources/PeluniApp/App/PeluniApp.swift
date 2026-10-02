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
                    OnboardingWindowController.showIfNeeded(permissions: appState.permissions, models: .shared)
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
        if !dictation.history.isEmpty {
            Menu("Recent transcripts") {
                ForEach(Array(dictation.history.enumerated()), id: \.offset) { _, item in
                    Button(String(item.prefix(48)) + (item.count > 48 ? "…" : "")) {
                        NSPasteboard.general.clearContents()
                        NSPasteboard.general.setString(item, forType: .string)
                    }
                }
            }
            Divider()
        }
        Button("Setup…") {
            OnboardingWindowController.show(permissions: appState.permissions, models: .shared)
        }
        SettingsLink { Text("Settings…") }.keyboardShortcut(",")
        Button("Caret probe…") { CaretProbeWindowController.show() }
        Divider()
        Button("Quit LocalFlow") { NSApplication.shared.terminate(nil) }.keyboardShortcut("q")
    }
}
