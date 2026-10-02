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

    public enum FolderOutcome: Equatable, Sendable {
        case moved
        case nothingToMigrate
        /// Both folders exist: neither is touched, and the new one is used.
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
        if fileManager.fileExists(atPath: current.path) { return .keptBoth }
        try fileManager.moveItem(at: legacy, to: current)
        return .moved
    }

    /// The legacy settings to write into the new domain: only keys it doesn't have yet,
    /// and nothing at all once the migration has run.
    public static func defaultsToCopy(legacy: [String: Any], current: [String: Any]) -> [String: Any] {
        if current[migratedKey] as? Bool == true { return [:] }
        return legacy.filter { current[$0.key] == nil }
    }
}
