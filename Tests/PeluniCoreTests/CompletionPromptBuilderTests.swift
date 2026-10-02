import XCTest
@testable import LocalFlowCore

final class CompletionPromptBuilderTests: XCTestCase {
    let b = CompletionPromptBuilder()

    func testContextSliceKeepsSuffix() {
        let long = String(repeating: "abcdefghij", count: 100) // 1000 chars
        XCTAssertEqual(b.contextSlice(long).count, 400)
        XCTAssertEqual(b.contextSlice("short"), "short")
    }

    func testKeepsOnlyFirstLine() {
        XCTAssertEqual(b.acceptOutput("world.\nAnd more", context: "Hello "), "world.")
    }

    func testTruncatesAtFirstSentenceEnd() {
        XCTAssertEqual(b.acceptOutput("world. And then more", context: "Hello "), "world.")
        XCTAssertEqual(b.acceptOutput("Is it? Yes it is", context: "Hello. "), "Is it?")
    }

    func testStripsWrappingQuotes() {
        XCTAssertEqual(b.acceptOutput("\"world\"", context: "Hello "), "world")
    }

    func testStripsEchoedContextTail() {
        // Model repeated the end of the context before continuing.
        XCTAssertEqual(b.acceptOutput("brown fox jumps", context: "The quick brown"), " fox jumps")
    }

    func testPreservesLeadingSpace() {
        XCTAssertEqual(b.acceptOutput(" world", context: "Hello"), " world")
    }

    func testNilForEmptyOrWhitespace() {
        XCTAssertNil(b.acceptOutput("", context: "Hello"))
        XCTAssertNil(b.acceptOutput("   \n  ", context: "Hello"))
    }

    func testNilWhenOutputIsOnlyEcho() {
        XCTAssertNil(b.acceptOutput("quick brown", context: "The quick brown"))
    }

    func testCapsAtWordBoundary() {
        let long = "one " + String(repeating: "reallylongword ", count: 20)
        let out = b.acceptOutput(long, context: "Count: ")!
        XCTAssertLessThanOrEqual(out.count, 120)
        XCTAssertFalse(out.hasSuffix(" "))
        XCTAssertTrue(out.hasSuffix("reallylongword"))
    }

    func testTrimsTrailingWhitespace() {
        XCTAssertEqual(b.acceptOutput("world   ", context: "Hello "), "world")
    }
}
