import SwiftUI
import LocalFlowCore

struct ModelsTab: View {
    @ObservedObject private var models = ModelManager.shared
    @AppStorage("whisperModel") private var selectedModel = WhisperModel.default.id
    @AppStorage("language") private var language = "auto"

    var body: some View {
        Form {
            Section("Transcription (Whisper)") {
                Picker("Language", selection: $language) {
                    Text("Auto-detect").tag("auto")
                    Text("English").tag("en")
                    Text("Norwegian").tag("no")
                    Text("Swedish").tag("sv")
                    Text("Danish").tag("da")
                    Text("German").tag("de")
                    Text("Spanish").tag("es")
                    Text("French").tag("fr")
                }
                ForEach(WhisperModel.catalog) { model in
                    modelRow(model)
                }
                if let err = models.lastError {
                    Text(err).foregroundStyle(.red).font(.caption)
                }
            }
            // LLM section arrives in Task 12.
        }
        .formStyle(.grouped)
        .onAppear { models.refresh() }
    }

    @ViewBuilder
    private func modelRow(_ model: WhisperModel) -> some View {
        HStack {
            VStack(alignment: .leading) {
                Text(model.displayName)
                Text(ByteCountFormatter.string(fromByteCount: model.sizeBytes, countStyle: .file))
                    .font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if let p = models.progress[model.id] {
                ProgressView(value: p).frame(width: 100)
                Button("Cancel") { models.cancelDownload(model) }
            } else if models.installed.contains(model.id) {
                if selectedModel == model.id {
                    Label("Active", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                } else {
                    Button("Use") { selectedModel = model.id }
                    Button(role: .destructive) { models.delete(model) } label: {
                        Image(systemName: "trash")
                    }
                }
            } else {
                Button("Download") { models.download(model) }
            }
        }
    }
}
