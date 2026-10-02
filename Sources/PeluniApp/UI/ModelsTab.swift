import SwiftUI
import LocalFlowCore

@MainActor
final class LLMDownloadState: ObservableObject {
    @Published var progress: Double?
    @Published var error: String?
}

struct ModelsTab: View {
    @ObservedObject private var models = ModelManager.shared
    @AppStorage("whisperModel") private var selectedModel = WhisperModel.default.id
    @AppStorage("language") private var language = "auto"
    @AppStorage("llmModel") private var llmModel = CleanupEngine.defaultModelID
    @StateObject private var llmState = LLMDownloadState()
    private var cleanupEngine: CleanupEngine { AppState.shared.dictation.cleanup }
    @AppStorage("completionModel") private var completionModel = CompletionEngine.defaultModelID
    @StateObject private var completionState = LLMDownloadState()
    private var completionEngine: CompletionEngine { AppState.shared.completionEngine }

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
            Section("AI cleanup model (local LLM)") {
                Picker("Model", selection: $llmModel) {
                    Text("Qwen3 4B — best quality (2.3 GB)").tag(CleanupEngine.defaultModelID)
                    Text("Llama 3.2 1B — light & fast (0.7 GB)").tag(CleanupEngine.lightModelID)
                }
                HStack {
                    if let p = llmState.progress {
                        ProgressView(value: p).frame(width: 140)
                        Text("\(Int(p * 100))%").monospacedDigit()
                    } else if cleanupEngine.isModelDownloaded(modelID: llmModel) {
                        Label("Downloaded", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                    } else {
                        Button("Download & warm up") {
                            llmState.progress = 0
                            llmState.error = nil
                            let id = llmModel
                            Task {
                                do {
                                    try await cleanupEngine.warmUp(modelID: id) { frac in
                                        Task { @MainActor in llmState.progress = frac }
                                    }
                                } catch {
                                    llmState.error = DownloadErrorMessage.text(for: error, item: "the cleanup model")
                                }
                                llmState.progress = nil
                            }
                        }
                    }
                }
                if let err = llmState.error {
                    Text(err).foregroundStyle(.red).font(.caption)
                }
                Text("Downloaded once from Hugging Face, then used fully offline.")
                    .font(.caption).foregroundStyle(.secondary)
            }
            Section("Autocomplete model (local LLM)") {
                Picker("Model", selection: $completionModel) {
                    Text("Qwen2.5 0.5B — fastest (0.3 GB)").tag(CompletionEngine.defaultModelID)
                    Text("Llama 3.2 1B — shared with light cleanup (0.7 GB)")
                        .tag(CompletionEngine.sharedLightModelID)
                }
                HStack {
                    if let p = completionState.progress {
                        ProgressView(value: p).frame(width: 140)
                        Text("\(Int(p * 100))%").monospacedDigit()
                    } else if completionEngine.isModelDownloaded(modelID: completionModel) {
                        Label("Downloaded", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                    } else {
                        Button("Download & warm up") {
                            completionState.progress = 0
                            completionState.error = nil
                            let id = completionModel
                            Task {
                                do {
                                    try await completionEngine.warmUp(modelID: id) { frac in
                                        Task { @MainActor in completionState.progress = frac }
                                    }
                                } catch {
                                    completionState.error = DownloadErrorMessage.text(for: error, item: "the autocomplete model")
                                }
                                completionState.progress = nil
                            }
                        }
                    }
                }
                if let err = completionState.error {
                    Text(err).foregroundStyle(.red).font(.caption)
                }
                Text("Used only while the Autocomplete input mode is on.")
                    .font(.caption).foregroundStyle(.secondary)
            }
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
                Text("\(Int(p * 100))%").monospacedDigit()
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
