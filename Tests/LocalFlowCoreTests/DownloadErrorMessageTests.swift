import XCTest
@testable import LocalFlowCore

final class DownloadErrorMessageTests: XCTestCase {
    private func text(_ e: Error) -> String? { DownloadErrorMessage.text(for: e, item: "Base") }

    func testCancellationShowsNothing() {
        XCTAssertNil(text(CancellationError()))
        XCTAssertNil(text(URLError(.cancelled)))
    }

    func testOfflineMessage() {
        let expected = "Couldn't download Base: no internet connection. Connect and try again."
        XCTAssertEqual(text(URLError(.notConnectedToInternet)), expected)
        XCTAssertEqual(text(URLError(.networkConnectionLost)), expected)
        XCTAssertEqual(text(URLError(.dataNotAllowed)), expected)
    }

    func testTimeoutMessage() {
        XCTAssertEqual(text(URLError(.timedOut)), "Couldn't download Base: the connection timed out. Try again.")
    }

    func testHostUnreachableMessage() {
        let expected = "Couldn't download Base: couldn't reach Hugging Face. Check your connection or try again later."
        XCTAssertEqual(text(URLError(.cannotFindHost)), expected)
        XCTAssertEqual(text(URLError(.cannotConnectToHost)), expected)
        XCTAssertEqual(text(URLError(.dnsLookupFailed)), expected)
    }

    func testServerErrorMessage() {
        XCTAssertEqual(text(URLError(.badServerResponse)),
                       "Couldn't download Base: the server returned an error. Try again later.")
    }

    func testIncompleteDownloadMessage() {
        // ModelManager throws .cannotParseResponse when the byte count doesn't match the catalog size.
        XCTAssertEqual(text(URLError(.cannotParseResponse)),
                       "Couldn't download Base: the download was incomplete. Try again.")
    }

    func testDiskFullMessage() {
        let expected = "Couldn't download Base: not enough free disk space."
        XCTAssertEqual(text(CocoaError(.fileWriteOutOfSpace)), expected)
        XCTAssertEqual(text(POSIXError(.ENOSPC)), expected)
    }

    func testUnknownErrorFallsBackToLocalizedDescription() {
        struct Odd: LocalizedError { var errorDescription: String? { "something odd" } }
        XCTAssertEqual(text(Odd()), "Couldn't download Base: something odd")
    }
}
