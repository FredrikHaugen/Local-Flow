import XCTest
@testable import PeluniCore

final class LegacyRenameTests: XCTestCase {
    private var base: URL!
    private let fm = FileManager.default

    override func setUpWithError() throws {
        base = fm.temporaryDirectory.appendingPathComponent(UUID().uuidString, isDirectory: true)
        try fm.createDirectory(at: base, withIntermediateDirectories: true)
    }

    override func tearDownWithError() throws {
        try? fm.removeItem(at: base)
    }

    private func dir(_ name: String) -> URL { base.appendingPathComponent(name, isDirectory: true) }

    func testMovesLegacyFolderWhenNewOneIsAbsent() throws {
        let model = dir("LocalFlow").appendingPathComponent("Models/whisper/ggml-base.bin")
        try fm.createDirectory(at: model.deletingLastPathComponent(), withIntermediateDirectories: true)
        try Data("weights".utf8).write(to: model)

        XCTAssertEqual(try LegacyRename.migrateSupportFolder(in: base), .moved)

        let moved = dir("peluni").appendingPathComponent("Models/whisper/ggml-base.bin")
        XCTAssertEqual(try Data(contentsOf: moved), Data("weights".utf8))
        XCTAssertFalse(fm.fileExists(atPath: dir("LocalFlow").path))
    }

    func testNothingToMigrateOnAFreshInstall() throws {
        XCTAssertEqual(try LegacyRename.migrateSupportFolder(in: base), .nothingToMigrate)
        XCTAssertFalse(fm.fileExists(atPath: dir("peluni").path))
    }

    func testKeepsBothWhenNewFolderExists() throws {
        try fm.createDirectory(at: dir("LocalFlow"), withIntermediateDirectories: true)
        try Data("old".utf8).write(to: dir("LocalFlow").appendingPathComponent("vocabulary.json"))
        try fm.createDirectory(at: dir("peluni"), withIntermediateDirectories: true)
        try Data("new".utf8).write(to: dir("peluni").appendingPathComponent("vocabulary.json"))

        XCTAssertEqual(try LegacyRename.migrateSupportFolder(in: base), .keptBoth)

        XCTAssertEqual(try Data(contentsOf: dir("LocalFlow").appendingPathComponent("vocabulary.json")), Data("old".utf8))
        XCTAssertEqual(try Data(contentsOf: dir("peluni").appendingPathComponent("vocabulary.json")), Data("new".utf8))
    }

    func testIgnoresALegacyFileThatIsNotAFolder() throws {
        try Data().write(to: base.appendingPathComponent("LocalFlow"))
        XCTAssertEqual(try LegacyRename.migrateSupportFolder(in: base), .nothingToMigrate)
    }

    func testCopiesLegacyDefaultsTheNewDomainLacks() {
        let copy = LegacyRename.defaultsToCopy(
            legacy: ["cleanupLevel": "high", "language": "sv"], current: [:])
        XCTAssertEqual(copy as NSDictionary, ["cleanupLevel": "high", "language": "sv"] as NSDictionary)
    }

    func testNeverOverwritesCurrentDefaults() {
        let copy = LegacyRename.defaultsToCopy(
            legacy: ["cleanupLevel": "high", "language": "sv"], current: ["cleanupLevel": "none"])
        XCTAssertEqual(copy as NSDictionary, ["language": "sv"] as NSDictionary)
    }

    func testCopiesNothingOnceMigrated() {
        let copy = LegacyRename.defaultsToCopy(
            legacy: ["language": "sv"], current: [LegacyRename.migratedKey: true])
        XCTAssertTrue(copy.isEmpty)
    }

    func testMovesIntoANewFolderThatHoldsNoFiles() throws {
        // An earlier launch whose move failed left only empty model folders behind.
        try fm.createDirectory(at: dir("peluni").appendingPathComponent("Models/whisper"), withIntermediateDirectories: true)
        try fm.createDirectory(at: dir("LocalFlow"), withIntermediateDirectories: true)
        try Data("old".utf8).write(to: dir("LocalFlow").appendingPathComponent("vocabulary.json"))

        XCTAssertEqual(try LegacyRename.migrateSupportFolder(in: base), .moved)

        XCTAssertEqual(try Data(contentsOf: dir("peluni").appendingPathComponent("vocabulary.json")), Data("old".utf8))
        XCTAssertFalse(fm.fileExists(atPath: dir("LocalFlow").path))
    }

    func testSkipsPerAppStateThatBelongsToTheOldIdentity() {
        // The new bundle ID has no Accessibility grant yet, so it must prompt again.
        let copy = LegacyRename.defaultsToCopy(
            legacy: ["accessibilityPromptShown": true, "NSWindow Frame Settings": "0 0 10 10", "language": "sv"],
            current: [:])
        XCTAssertEqual(copy as NSDictionary, ["language": "sv"] as NSDictionary)
    }
}
