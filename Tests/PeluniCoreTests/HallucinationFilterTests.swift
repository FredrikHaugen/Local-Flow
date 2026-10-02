import XCTest
@testable import PeluniCore

final class HallucinationFilterTests: XCTestCase {
    let f = HallucinationFilter()

    func testRemovesBracketedNonSpeech() {
        XCTAssertEqual(f.clean("[Music] Hello there"), "Hello there")
        XCTAssertEqual(f.clean("[BLANK_AUDIO]"), "")
        XCTAssertEqual(f.clean("Hello [inaudible] world"), "Hello world")
    }

    func testRemovesParenthesizedNonSpeech() {
        XCTAssertEqual(f.clean("(applause) Thanks everyone"), "Thanks everyone")
        XCTAssertEqual(f.clean("(silence)"), "")
    }

    func testKeepsLegitimateParentheses() {
        XCTAssertEqual(f.clean("I said (quietly) hi"), "I said (quietly) hi")
    }

    func testRemovesMusicNotes() {
        XCTAssertEqual(f.clean("♪ la la la ♪"), "")
        XCTAssertEqual(f.clean("Hello ♪♪"), "Hello")
    }

    func testCollapsesWhitespace() {
        XCTAssertEqual(f.clean("  Hello   world  "), "Hello world")
    }

    func testPlainTextUntouched() {
        XCTAssertEqual(f.clean("This is a normal sentence."), "This is a normal sentence.")
    }
}
