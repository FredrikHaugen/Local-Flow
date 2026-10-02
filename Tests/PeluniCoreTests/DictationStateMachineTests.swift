import XCTest
@testable import PeluniCore

final class DictationStateMachineTests: XCTestCase {
    var m = DictationStateMachine()
    override func setUp() { m = DictationStateMachine() }

    func testHappyPath() {
        XCTAssertTrue(m.handle(.startRecording)); XCTAssertEqual(m.phase, .recording)
        XCTAssertTrue(m.handle(.stopRecording)); XCTAssertEqual(m.phase, .transcribing)
        XCTAssertTrue(m.handle(.transcriptReady)); XCTAssertEqual(m.phase, .cleaning)
        XCTAssertTrue(m.handle(.cleanupDone)); XCTAssertEqual(m.phase, .injecting)
        XCTAssertTrue(m.handle(.injectionDone)); XCTAssertEqual(m.phase, .idle)
    }

    func testHotkeyIgnoredWhileProcessing() {
        _ = m.handle(.startRecording); _ = m.handle(.stopRecording)
        XCTAssertFalse(m.handle(.startRecording))
        XCTAssertEqual(m.phase, .transcribing)
    }

    func testCancelFromEachActiveState() {
        for events in [[DictationEvent.startRecording],
                       [.startRecording, .stopRecording],
                       [.startRecording, .stopRecording, .transcriptReady],
                       [.startRecording, .stopRecording, .transcriptReady, .cleanupDone]] {
            m = DictationStateMachine()
            events.forEach { _ = m.handle($0) }
            XCTAssertTrue(m.handle(.cancel))
            XCTAssertEqual(m.phase, .idle)
        }
    }

    func testFailureReturnsToIdle() {
        for events in [[DictationEvent.startRecording],
                       [.startRecording, .stopRecording],
                       [.startRecording, .stopRecording, .transcriptReady],
                       [.startRecording, .stopRecording, .transcriptReady, .cleanupDone]] {
            m = DictationStateMachine()
            events.forEach { _ = m.handle($0) }
            XCTAssertTrue(m.handle(.failed))
            XCTAssertEqual(m.phase, .idle)
        }
    }

    func testIllegalEventsIgnored() {
        XCTAssertFalse(m.handle(.transcriptReady))
        XCTAssertFalse(m.handle(.injectionDone))
        XCTAssertEqual(m.phase, .idle)
    }
}
