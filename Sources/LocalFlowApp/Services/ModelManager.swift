import Foundation
import LocalFlowCore

@MainActor
final class ModelManager: ObservableObject {
    static let shared = ModelManager()

    @Published var installed: Set<String> = []
    @Published var progress: [String: Double] = [:]
    @Published var lastError: String?

    private var tasks: [String: Task<Void, Never>] = [:]

    let whisperDir: URL
    let llmDir: URL

    init() {
        let appSupport = FileManager.default.urls(
            for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("LocalFlow", isDirectory: true)
        whisperDir = appSupport.appendingPathComponent("Models/whisper", isDirectory: true)
        llmDir = appSupport.appendingPathComponent("Models/llm", isDirectory: true)
        try? FileManager.default.createDirectory(at: whisperDir, withIntermediateDirectories: true)
        try? FileManager.default.createDirectory(at: llmDir, withIntermediateDirectories: true)
        refresh()
    }

    func refresh() {
        var found: Set<String> = []
        for model in WhisperModel.catalog {
            let url = whisperDir.appendingPathComponent(model.fileName)
            if let size = try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int64,
               size == model.sizeBytes {
                found.insert(model.id)
            }
        }
        installed = found
    }

    func installedPath(for model: WhisperModel) -> URL? {
        installed.contains(model.id) ? whisperDir.appendingPathComponent(model.fileName) : nil
    }

    func download(_ model: WhisperModel) {
        guard tasks[model.id] == nil else { return }
        lastError = nil
        progress[model.id] = 0

        // Best-effort check: fails open if capacity metadata is unavailable.
        if let values = try? whisperDir.resourceValues(forKeys: [.volumeAvailableCapacityForImportantUsageKey]),
           let free = values.volumeAvailableCapacityForImportantUsage,
           free < model.sizeBytes + 200_000_000 {
            lastError = "Not enough free disk space for \(model.displayName)."
            progress[model.id] = nil
            return
        }

        let dest = whisperDir.appendingPathComponent(model.fileName)
        let partial = dest.appendingPathExtension("partial")

        tasks[model.id] = Task {
            defer { tasks[model.id] = nil }
            do {
                try await Self.performDownload(model: model, partial: partial, dest: dest) { [weak self] frac in
                    Task { @MainActor in self?.progress[model.id] = frac }
                }
                progress[model.id] = nil
                refresh()
            } catch {
                progress[model.id] = nil
                if !(error is CancellationError) {
                    lastError = "Download failed: \(error.localizedDescription)"
                }
            }
        }
    }

    /// Runs OFF the Main Actor (nonisolated async): streaming + disk writes must never block UI.
    private nonisolated static func performDownload(
        model: WhisperModel, partial: URL, dest: URL,
        onProgress: @escaping @Sendable (Double) -> Void
    ) async throws {
        let (bytes, response) = try await URLSession.shared.bytes(from: model.url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        FileManager.default.createFile(atPath: partial.path, contents: nil)
        do {
            let handle = try FileHandle(forWritingTo: partial)
            defer { try? handle.close() }

            var buffer = Data(); buffer.reserveCapacity(1 << 20)
            var written: Int64 = 0
            for try await byte in bytes {
                buffer.append(byte)
                if buffer.count >= 1 << 20 {
                    try handle.write(contentsOf: buffer)
                    written += Int64(buffer.count)
                    buffer.removeAll(keepingCapacity: true)
                    onProgress(Double(written) / Double(model.sizeBytes))
                    try Task.checkCancellation()
                }
            }
            try Task.checkCancellation() // cover the sub-1MB tail
            try handle.write(contentsOf: buffer)
            written += Int64(buffer.count)

            guard written == model.sizeBytes else { throw URLError(.cannotParseResponse) }
            try? FileManager.default.removeItem(at: dest)
            try FileManager.default.moveItem(at: partial, to: dest)
        } catch {
            try? FileManager.default.removeItem(at: partial)
            throw error
        }
    }

    func cancelDownload(_ model: WhisperModel) {
        tasks[model.id]?.cancel()
    }

    func delete(_ model: WhisperModel) {
        try? FileManager.default.removeItem(at: whisperDir.appendingPathComponent(model.fileName))
        refresh()
    }
}
