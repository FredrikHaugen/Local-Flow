import SwiftUI

struct AdvancedTab: View {
    @AppStorage("injectionMethod") private var injectionMethod = "paste"
    @AppStorage("cleanupMinChars") private var cleanupMinChars = 50

    var body: some View {
        Form {
            Section("Text insertion") {
                Picker("Method", selection: $injectionMethod) {
                    Text("Paste (recommended)").tag("paste")
                    Text("Type character-by-character").tag("type")
                }
                Text("Typing is slower but works in apps that block programmatic paste.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("AI cleanup") {
                Stepper("Skip cleanup under \(cleanupMinChars) characters",
                        value: $cleanupMinChars, in: 0...200, step: 10)
            }
        }
        .formStyle(.grouped)
    }
}
