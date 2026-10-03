import XCTest
@testable import PeluniCore

final class HubSnapshotTests: XCTestCase {
    private var root: URL!

    override func setUpWithError() throws {
        root = FileManager.default.temporaryDirectory
            .appendingPathComponent("HubSnapshotTests-\(UUID().uuidString)")
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    }

    override func tearDownWithError() throws {
        try? FileManager.default.removeItem(at: root)
    }

    /// <root>/models--org--name/snapshots/<rev>/, complete (config.json and weights) or not.
    private func makeSnapshot(
        _ modelID: String, rev: String, withConfig: Bool, withWeights: Bool? = nil
    ) throws -> URL {
        let dir = root
            .appendingPathComponent(HubSnapshot.folderName(modelID: modelID))
            .appendingPathComponent("snapshots")
            .appendingPathComponent(rev)
        try FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        if withConfig {
            try Data("{}".utf8).write(to: dir.appendingPathComponent("config.json"))
        }
        if withWeights ?? withConfig {
            try Data().write(to: dir.appendingPathComponent("model.safetensors"))
        }
        return dir
    }

    private func setMainRef(_ modelID: String, to rev: String) throws {
        let refs = root.appendingPathComponent(HubSnapshot.folderName(modelID: modelID))
            .appendingPathComponent("refs")
        try FileManager.default.createDirectory(at: refs, withIntermediateDirectories: true)
        try Data("\(rev)\n".utf8).write(to: refs.appendingPathComponent("main"))
    }

    func testFolderNameReplacesSlashesWithDoubleDashes() {
        XCTAssertEqual(
            HubSnapshot.folderName(modelID: "mlx-community/Qwen3-4B-Instruct-2507-4bit"),
            "models--mlx-community--Qwen3-4B-Instruct-2507-4bit")
    }

    func testMissingCacheFolderIsNotADownload() {
        XCTAssertNil(HubSnapshot.directory(modelID: "org/absent", in: root))
    }

    func testSnapshotWithoutConfigIsNotADownload() throws {
        _ = try makeSnapshot("org/model", rev: "abc", withConfig: false)
        XCTAssertNil(HubSnapshot.directory(modelID: "org/model", in: root))
    }

    func testSnapshotWithConfigIsFound() throws {
        let dir = try makeSnapshot("org/model", rev: "abc", withConfig: true)
        XCTAssertEqual(HubSnapshot.directory(modelID: "org/model", in: root)?.path, dir.path)
    }

    func testCompleteSnapshotIsFoundNextToAnUnfinishedOne() throws {
        _ = try makeSnapshot("org/model", rev: "aaa", withConfig: false)
        let complete = try makeSnapshot("org/model", rev: "bbb", withConfig: true)
        XCTAssertEqual(HubSnapshot.directory(modelID: "org/model", in: root)?.path, complete.path)
    }

    func testAnotherModelsSnapshotDoesNotCount() throws {
        _ = try makeSnapshot("org/other", rev: "abc", withConfig: true)
        XCTAssertNil(HubSnapshot.directory(modelID: "org/model", in: root))
    }

    func testSnapshotWithConfigButNoWeightsIsNotADownload() throws {
        _ = try makeSnapshot("org/model", rev: "abc", withConfig: true, withWeights: false)
        XCTAssertNil(HubSnapshot.directory(modelID: "org/model", in: root))
    }

    func testMainRefWinsOverAnOlderCompleteSnapshot() throws {
        _ = try makeSnapshot("org/model", rev: "aaa", withConfig: true)
        let current = try makeSnapshot("org/model", rev: "zzz", withConfig: true)
        try setMainRef("org/model", to: "zzz")
        XCTAssertEqual(HubSnapshot.directory(modelID: "org/model", in: root)?.path, current.path)
    }

    func testIncompleteMainRefFallsBackToACompleteSnapshot() throws {
        let complete = try makeSnapshot("org/model", rev: "aaa", withConfig: true)
        _ = try makeSnapshot("org/model", rev: "zzz", withConfig: true, withWeights: false)
        try setMainRef("org/model", to: "zzz")
        XCTAssertEqual(HubSnapshot.directory(modelID: "org/model", in: root)?.path, complete.path)
    }
}
