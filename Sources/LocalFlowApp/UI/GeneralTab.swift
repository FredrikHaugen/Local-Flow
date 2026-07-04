import SwiftUI
import LocalFlowCore

struct GeneralTab: View {
    @AppStorage("cleanupLevel") private var cleanupLevel = "light"

    var body: some View {
        Form {
            Section("Dictation") {
                LabeledContent("Hold to talk", value: "Right ⌥ (Option)")
                LabeledContent("Hands-free lock", value: "Double-tap Right ⌥ · press once to stop")
                LabeledContent("Cancel", value: "Esc")
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
    }
}
