import SwiftUI
import LocalFlowCore
import KeyboardShortcuts
import ServiceManagement

struct GeneralTab: View {
    @AppStorage("cleanupLevel") private var cleanupLevel = "light"
    @AppStorage("dictationEnabled") private var dictationEnabled = true
    @AppStorage("autocompleteEnabled") private var autocompleteEnabled = false

    var body: some View {
        Form {
            Section("Input modes") {
                Toggle("Dictation (Whisper)", isOn: $dictationEnabled)
                Toggle("Autocomplete (experimental)", isOn: $autocompleteEnabled)
                Text("Autocomplete keeps a model loaded only while enabled — off means zero memory and zero CPU. Dictation stops listening when off; its models unload when the app quits.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("Dictation") {
                LabeledContent("Hold to talk", value: "Right ⌥ (Option)")
                LabeledContent("Hands-free lock", value: "Double-tap Right ⌥ · press once to stop")
                LabeledContent("Cancel", value: "Esc")
            }
            Section("Shortcuts") {
                KeyboardShortcuts.Recorder("Toggle dictation (alternative):", name: .toggleDictation)
                Text("The primary hold-to-talk key stays Right ⌥.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("Startup") {
                Toggle("Launch LocalFlow at login", isOn: launchAtLogin)
            }
            Section("AI cleanup") {
                Picker("Cleanup level", selection: $cleanupLevel) {
                    Text("None — raw transcript").tag("none")
                    Text("Light — fillers & punctuation (recommended)").tag("light")
                    Text("Medium — also grammar & false starts").tag("medium")
                    Text("High — also structure & lists").tag("high")
                }
                .pickerStyle(.inline)
                Text("Cleanup never rewrites your meaning; if the model misbehaves, the raw transcript is used.")
                    .font(.caption).foregroundStyle(.secondary)
            }
        }
        .formStyle(.grouped)
        .onChange(of: dictationEnabled) { _, _ in AppState.shared.applyInputModeSettings() }
        .onChange(of: autocompleteEnabled) { _, _ in AppState.shared.applyInputModeSettings() }
    }

    private var launchAtLogin: Binding<Bool> {
        Binding(
            get: { SMAppService.mainApp.status == .enabled },
            set: { enable in
                do {
                    if enable { try SMAppService.mainApp.register() }
                    else { try SMAppService.mainApp.unregister() }
                } catch {
                    NSLog("LocalFlow launch-at-login failed: \(error)")
                }
            })
    }
}
