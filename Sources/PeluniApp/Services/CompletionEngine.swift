import Foundation
import MLX
import MLXLMCommon
import MLXLLM
import MLXHuggingFace
import HuggingFace
import Tokenizers
import PeluniCore

/// Small local LLM proposing inline continuations. Mirrors CleanupEngine's
/// structure but is stricter about lifecycle and privacy: cached weights load
/// through a *directory* ModelConfiguration, which mlx-swift-lm's resolve()
/// never hands to the hub downloader — the keystroke path is provably
/// network-free (#hubDownloader with an id config pings huggingface.co on
/// every load, even fully cached). The model stays resident while the toggle
/// is on; only unloadNow() (toggle off / model switch) releases it, and it
/// also invalidates in-flight loads via an epoch so a slow load can't
/// resurrect the weights. Total function: any failure returns nil — a
/// missing suggestion is never a user-visible error.
actor CompletionEngine {
    static let defaultModelID = "mlx-community/Qwen2.5-0.5B-Instruct-4bit"
    /// Same weights as the light cleanup model — one download serves both.
    static let sharedLightModelID = CleanupEngine.lightModelID

    private let llmDir: URL
    private var container: ModelContainer?
    private var loadedModelID: String?
    /// Coalesces concurrent loads per model id: debounce fires during a
    /// multi-second cold start must all await ONE load, never duplicates —
    /// including when a Settings model-switch load overlaps a completion load.
    private var loadTasks: [String: (epoch: UInt64, task: Task<ModelContainer, Error>)] = [:]
    /// Bumped by unloadNow(); loads started before the bump discard their result.
    private var epoch: UInt64 = 0
    private let builder = CompletionPromptBuilder()
    private let timeout: Duration = .seconds(3)

    init(llmDir: URL) {
        self.llmDir = llmDir
    }

    func complete(context: String, modelID: String) async -> String? {
        // Never download on the keystroke path: completion is network-free by
        // contract. Downloads happen only via the Settings button (warmUp).
        guard cachedSnapshotDirectory(modelID: modelID) != nil else { return nil }
        do {
            let container = try await ensureLoaded(
                modelID: modelID, allowNetwork: false, progress: { _ in })
            try Task.checkCancellation()   // keystrokes arrived during the load?
            let slice = builder.contextSlice(context)
            let output: String = try await withThrowingTaskGroup(of: String.self) { group in
                group.addTask { [builder] in
                    var gp = GenerateParameters(maxTokens: 24)
                    gp.temperature = 0
                    let session = ChatSession(
                        container, instructions: builder.systemPrompt(), generateParameters: gp)
                    var acc = ""
                    for try await chunk in session.streamResponse(to: slice) {
                        try Task.checkCancellation()
                        acc += chunk
                        if acc.contains("\n") { break }  // ghost text is single-line
                    }
                    return acc
                }
                group.addTask { [timeout] in
                    try await Task.sleep(for: timeout)
                    throw CancellationError()
                }
                guard let first = try await group.next() else { throw CancellationError() }
                group.cancelAll()
                return first
            }
            MLX.Memory.cacheLimit = 32 * 1024 * 1024
            return builder.acceptOutput(output, context: slice)
        } catch {
            return nil
        }
    }

    /// Downloads (if needed) and loads the model, reporting fractional
    /// progress. Used by the Settings button and warm-on-enable. If the
    /// autocomplete toggle is off when it finishes, the weights are released
    /// again: Settings verifies the download, but only the toggle owns
    /// residency.
    func warmUp(modelID: String, progress: @Sendable @escaping (Double) -> Void) async throws {
        _ = try await ensureLoaded(modelID: modelID, allowNetwork: true, progress: progress)
        if !UserDefaults.standard.bool(forKey: "autocompleteEnabled") {
            unloadNow()
        }
    }

    /// Called when the autocomplete toggle turns off: off = zero RAM.
    func unloadNow() {
        epoch &+= 1
        for entry in loadTasks.values { entry.task.cancel() }
        loadTasks.removeAll()
        container = nil
        loadedModelID = nil
        NSLog("peluni: completion model unloaded")
    }

    nonisolated func isModelDownloaded(modelID: String) -> Bool {
        cachedSnapshotDirectory(modelID: modelID) != nil
    }

    /// HubCache layout: <llmDir>/models--<org>--<name>/snapshots/<rev>/config.json
    private nonisolated func cachedSnapshotDirectory(modelID: String) -> URL? {
        HubSnapshot.directory(modelID: modelID, in: llmDir)
    }

    private func ensureLoaded(
        modelID: String, allowNetwork: Bool,
        progress: @Sendable @escaping (Double) -> Void
    ) async throws -> ModelContainer {
        if let container, loadedModelID == modelID { return container }
        if let entry = loadTasks[modelID] {
            return try await entry.task.value
        }
        container = nil
        loadedModelID = nil

        // Cached weights load from the snapshot directory — resolve() never
        // consults the Downloader for .directory configurations. The id-based
        // (network-capable) config exists only for the explicit download path.
        let configuration: ModelConfiguration
        if let dir = cachedSnapshotDirectory(modelID: modelID) {
            configuration = ModelConfiguration(directory: dir)
        } else if allowNetwork {
            configuration = ModelConfiguration(id: modelID)
        } else {
            throw CancellationError()
        }

        let startEpoch = epoch
        let client = HubClient(cache: HubCache(location: .fixed(directory: llmDir)))
        // Unstructured on purpose: a cancelled completion request must not
        // kill a load other requests are awaiting. Task {} inherits this
        // actor's isolation, so touching self inside is safe.
        let task = Task { () throws -> ModelContainer in
            defer {
                // Keyed by model id AND epoch: this defer must never clear
                // another model's registration or a post-unload re-register.
                if self.loadTasks[modelID]?.epoch == startEpoch {
                    self.loadTasks[modelID] = nil
                }
            }
            let c = try await loadModelContainer(
                from: #hubDownloader(client),
                using: #huggingFaceTokenizerLoader(),
                configuration: configuration,
                progressHandler: { p in progress(p.fractionCompleted) }
            )
            // Warm-up generation absorbs Metal shader compilation latency.
            let warm = ChatSession(c, generateParameters: GenerateParameters(maxTokens: 1))
            _ = try? await warm.respond(to: "Hi")
            guard self.epoch == startEpoch else {
                // unloadNow() ran mid-load: drop the weights, don't resurrect.
                throw CancellationError()
            }
            self.container = c
            self.loadedModelID = modelID
            return c
        }
        loadTasks[modelID] = (startEpoch, task)
        return try await task.value
    }
}
