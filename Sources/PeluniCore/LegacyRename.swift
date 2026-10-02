import Foundation

/// peluni was called LocalFlow. On first launch after the rename, an upgrading user's downloaded
/// models, vocabulary and settings move to the new names. Nothing is ever deleted or merged.
public enum LegacyRename {
    public static let legacyBundleID = "com.figge.LocalFlow"
    public static let legacySupportFolder = "LocalFlow"
    public static let supportFolder = "peluni"
    /// Set in the new defaults domain once the legacy settings were copied, so a key the user
    /// later removes is never resurrected from the old domain.
    public static let migratedKey = "migratedFromLegacyName"
    /// Settings that describe the old app identity rather than the user's choices: the new bundle
    /// ID has no Accessibility grant, so it must prompt again. AppKit's own `NS…` keys (window
    /// frames, status item positions) are skipped too.
    static let identityKeys: Set<String> = ["accessibilityPromptShown"]

    public enum FolderOutcome: Equatable, Sendable {
        case moved
        case nothingToMigrate
        /// Both folders hold files: neither is touched, and the new one is used.
        case keptBoth
    }

    /// `base` is the user's Application Support directory.
    public static func migrateSupportFolder(
        in base: URL, fileManager: FileManager = .default
    ) throws -> FolderOutcome {
        let legacy = base.appendingPathComponent(legacySupportFolder, isDirectory: true)
        let current = base.appendingPathComponent(supportFolder, isDirectory: true)
        var isDirectory: ObjCBool = false
        guard fileManager.fileExists(atPath: legacy.path, isDirectory: &isDirectory),
              isDirectory.boolValue else { return .nothingToMigrate }
        if fileManager.fileExists(atPath: current.path) {
            // A new folder with no files in it (say, an earlier launch whose move failed created
            // empty model folders) holds nothing to keep, so the legacy data still moves in.
            guard try holdsNoFiles(current, fileManager: fileManager) else { return .keptBoth }
            try fileManager.removeItem(at: current)
        }
        try fileManager.moveItem(at: legacy, to: current)
        return .moved
    }

    private static func holdsNoFiles(_ folder: URL, fileManager: FileManager) throws -> Bool {
        guard let items = fileManager.enumerator(
            at: folder, includingPropertiesForKeys: [.isDirectoryKey], options: [.skipsHiddenFiles])
        else { return false }
        for case let item as URL in items {
            if try item.resourceValues(forKeys: [.isDirectoryKey]).isDirectory != true { return false }
        }
        return true
    }

    /// The legacy settings to write into the new domain: only keys it doesn't have yet,
    /// and nothing at all once the migration has run.
    public static func defaultsToCopy(legacy: [String: Any], current: [String: Any]) -> [String: Any] {
        if current[migratedKey] as? Bool == true { return [:] }
        return legacy.filter { key, _ in
            current[key] == nil && !identityKeys.contains(key) && !key.hasPrefix("NS")
        }
    }
}
