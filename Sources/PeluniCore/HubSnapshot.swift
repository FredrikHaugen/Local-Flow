import Foundation

/// Finds a downloaded Hugging Face model in a HubCache folder.
public enum HubSnapshot {
    /// The cache folder name for a model id: "org/name" becomes "models--org--name".
    public static func folderName(modelID: String) -> String {
        "models--" + modelID.replacingOccurrences(of: "/", with: "--")
    }

    /// The snapshot directory under `cacheDir` that holds a complete download of `modelID` (a
    /// config.json and at least one .safetensors file), or nil when there is none. The revision
    /// refs/main points at wins; otherwise revisions are checked in sorted order so the result is
    /// stable. A half-finished download doesn't count, so it can be downloaded again.
    public static func directory(modelID: String, in cacheDir: URL, fileManager: FileManager = .default) -> URL? {
        let modelDir = cacheDir.appendingPathComponent(folderName(modelID: modelID))
        let snapshots = modelDir.appendingPathComponent("snapshots")
        guard let revisions = try? fileManager.contentsOfDirectory(atPath: snapshots.path) else { return nil }
        let main = (try? String(contentsOf: modelDir.appendingPathComponent("refs/main"), encoding: .utf8))?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let sorted = revisions.sorted()
        let ordered = sorted.filter { $0 == main } + sorted.filter { $0 != main }
        for revision in ordered {
            let dir = snapshots.appendingPathComponent(revision)
            if isComplete(dir, fileManager: fileManager) { return dir }
        }
        return nil
    }

    private static func isComplete(_ dir: URL, fileManager: FileManager) -> Bool {
        guard fileManager.fileExists(atPath: dir.appendingPathComponent("config.json").path),
              let files = try? fileManager.contentsOfDirectory(atPath: dir.path) else { return false }
        return files.contains { $0.hasSuffix(".safetensors") }
    }
}
