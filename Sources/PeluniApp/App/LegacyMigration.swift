import Foundation
import PeluniCore

/// Runs once per launch, before anything opens Application Support or reads settings.
enum LegacyMigration {
    static func run() {
        let defaults = UserDefaults.standard
        if let bundleID = Bundle.main.bundleIdentifier,
           let legacy = defaults.persistentDomain(forName: LegacyRename.legacyBundleID) {
            let current = defaults.persistentDomain(forName: bundleID) ?? [:]
            let copy = LegacyRename.defaultsToCopy(legacy: legacy, current: current)
            for (key, value) in copy { defaults.set(value, forKey: key) }
            defaults.set(true, forKey: LegacyRename.migratedKey)
            if !copy.isEmpty { NSLog("peluni: copied \(copy.count) legacy settings") }
        }

        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        do {
            let outcome = try LegacyRename.migrateSupportFolder(in: base)
            if outcome != .nothingToMigrate { NSLog("peluni: legacy data folder \(outcome)") }
        } catch {
            // Not fatal: the app starts with an empty folder and the old one stays where it was.
            NSLog("peluni: could not move legacy data folder (\(type(of: error)))")
        }
    }
}
