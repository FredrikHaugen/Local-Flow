import Foundation
import MLX
import MLXLMCommon
import MLXLLM
import MLXHuggingFace
import HuggingFace
import Tokenizers
import LocalFlowCore

actor CleanupEngine {
    static let defaultModelID = "mlx-community/Qwen3-4B-Instruct-2507-4bit"
    static let lightModelID = "mlx-community/Llama-3.2-1B-Instruct-4bit"

    private let llmDir: URL
    private var container: ModelContainer?
    private var loadedModelID: String?
    private var unloadTask: Task<Void, Never>?
    private let builder = CleanupPromptBuilder()
    private let idleUnloadAfter: Duration = .seconds(600)
    private let timeout: Duration = .seconds(10)

    init(llmDir: URL) {
        self.llmDir = llmDir
    }

    /// Total function: any failure (model missing, load error, generation
    /// error, timeout) returns the input unchanged. A transcript is never lost.
    func cleanup(_ text: String, level: CleanupLevel, glossary: [String], modelID: String) async -> String {
        let minChars = max(0, UserDefaults.standard.object(forKey: "cleanupMinChars") as? Int ?? 50)
        guard level != .none, text.count >= minChars else { return text }
        guard let system = builder.systemPrompt(level: level, glossary: glossary) else { return text }
        guard isModelDownloaded(modelID: modelID) else {
            NSLog("LocalFlow: cleanup model not downloaded; using raw transcript")
            return text
        }
        do {
            let container = try await ensureLoaded(modelID: modelID, progress: { _ in })
            let output: String = try await withThrowingTaskGroup(of: String.self) { group in
                group.addTask {
                    var gp = GenerateParameters(maxTokens: 1024)
                    gp.temperature = 0.2
                    let session = ChatSession(container, instructions: system, generateParameters: gp)
                    return try await session.respond(to: text)
                }
                group.addTask { [timeout] in
                    try await Task.sleep(for: timeout)
                    throw CancellationError()
                }
                guard let first = try await group.next() else { throw CancellationError() }
                group.cancelAll()
                return first
            }
            MLX.GPU.set(cacheLimit: 32 * 1024 * 1024)
            scheduleUnload()
            return builder.acceptOutput(output, input: text)
        } catch {
            NSLog("LocalFlow: cleanup fell back to raw transcript (\(error))")
            return text
        }
    }

    /// Downloads (if needed) and loads the model, reporting fractional progress.
    func warmUp(modelID: String, progress: @Sendable @escaping (Double) -> Void) async throws {
        _ = try await ensureLoaded(modelID: modelID, progress: progress)
    }

    nonisolated func isModelDownloaded(modelID: String) -> Bool {
        // HubCache layout: <llmDir>/models--mlx-community--<name>/snapshots/<rev>/config.json
        let dirName = "models--" + modelID.replacingOccurrences(of: "/", with: "--")
        let snapshots = llmDir.appendingPathComponent(dirName).appendingPathComponent("snapshots")
        guard let revs = try? FileManager.default.contentsOfDirectory(atPath: snapshots.path) else {
            return false
        }
        return revs.contains { rev in
            FileManager.default.fileExists(
                atPath: snapshots.appendingPathComponent(rev).appendingPathComponent("config.json").path)
        }
    }

    private func ensureLoaded(
        modelID: String, progress: @Sendable @escaping (Double) -> Void
    ) async throws -> ModelContainer {
        unloadTask?.cancel()
        if let container, loadedModelID == modelID { return container }
        container = nil

        let client = HubClient(cache: HubCache(location: .fixed(directory: llmDir)))
        let c = try await loadModelContainer(
            from: #hubDownloader(client),
            using: #huggingFaceTokenizerLoader(),
            configuration: ModelConfiguration(id: modelID),
            progressHandler: { p in progress(p.fractionCompleted) }
        )
        // Warm-up generation absorbs Metal shader compilation latency.
        let warm = ChatSession(c, generateParameters: GenerateParameters(maxTokens: 1))
        _ = try? await warm.respond(to: "Hi")

        container = c
        loadedModelID = modelID
        return c
    }

    private func scheduleUnload() {
        unloadTask?.cancel()
        unloadTask = Task { [idleUnloadAfter] in
            try? await Task.sleep(for: idleUnloadAfter)
            guard !Task.isCancelled else { return }
            await self.unload()
        }
    }

    private func unload() {
        container = nil
        loadedModelID = nil
        NSLog("LocalFlow: cleanup model unloaded after idle period")
    }
}
