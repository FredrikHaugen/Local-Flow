import XCTest
@testable import LocalFlowCore

final class VADTrimmerTests: XCTestCase {
    let trimmer = VADTrimmer(threshold: 0.05, windowSize: 4, padding: 8)

    func testAllSilenceReturnsEmpty() {
        XCTAssertEqual(trimmer.trim([Float](repeating: 0.001, count: 100)), [])
    }

    func testEmptyInput() {
        XCTAssertEqual(trimmer.trim([]), [])
    }

    func testSpeechInMiddleTrimmedWithPadding() {
        var s = [Float](repeating: 0.0, count: 100)
        for i in 40..<60 { s[i] = 0.5 }   // loud region
        let out = trimmer.trim(s)
        // window-aligned start = 40, minus padding 8 → 32; end = 60 + 8 → 68
        XCTAssertEqual(out.count, 68 - 32)
        XCTAssertEqual(out.first, 0.0)     // padding retained
        XCTAssertTrue(out.contains(0.5))
    }

    func testPaddingClampedAtEdges() {
        var s = [Float](repeating: 0.5, count: 10)
        s[9] = 0.5
        let out = trimmer.trim(s)
        XCTAssertEqual(out.count, 10)      // padding can't exceed bounds
    }

    func testShorterThanWindowKeptIfLoud() {
        let out = trimmer.trim([0.5, 0.5])
        XCTAssertEqual(out, [0.5, 0.5])
    }

    func testNonPositiveWindowSizeReturnsInputUnchanged() {
        let bad = VADTrimmer(threshold: 0.05, windowSize: 0, padding: 8)
        XCTAssertEqual(bad.trim([0.5, 0.0, 0.5]), [0.5, 0.0, 0.5])
    }
}
