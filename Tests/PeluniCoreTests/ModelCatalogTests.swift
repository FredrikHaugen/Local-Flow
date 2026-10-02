import XCTest
@testable import LocalFlowCore

final class ModelCatalogTests: XCTestCase {
    func testCatalogContainsExpectedModels() {
        let ids = WhisperModel.catalog.map(\.id)
        XCTAssertEqual(ids, ["tiny", "base", "small", "medium", "large-v3-turbo"])
    }

    func testDefaultIsBase() {
        XCTAssertEqual(WhisperModel.default.id, "base")
    }

    func testURLAndFileNamePattern() {
        let base = WhisperModel.catalog.first { $0.id == "base" }!
        XCTAssertEqual(base.fileName, "ggml-base.bin")
        XCTAssertEqual(
            base.url.absoluteString,
            "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin")
        XCTAssertEqual(base.sizeBytes, 147_951_465)
        XCTAssertFalse(base.isEnglishOnly)
    }
}
