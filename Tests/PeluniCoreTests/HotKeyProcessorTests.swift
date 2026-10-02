import XCTest
@testable import PeluniCore

final class HotKeyProcessorTests: XCTestCase {
    var p = HotKeyProcessor()

    override func setUp() { p = HotKeyProcessor() }

    func testNormalPushToTalk() {
        XCTAssertEqual(p.handle(.targetDown(at: 0)), .startRecording)
        XCTAssertEqual(p.handle(.targetUp(at: 1.0)), .stopAndTranscribe)
        XCTAssertEqual(p.state, .idle)
    }

    func testShortTapThenExpiryDiscards() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.targetUp(at: 0.1)), ProcessorAction.none)
        XCTAssertEqual(p.state, .tapPending(releasedAt: 0.1))
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 0.45)), .cancelRecording)
        XCTAssertEqual(p.state, .idle)
    }

    func testStaleExpiryIgnored() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 0.2)), ProcessorAction.none)
        XCTAssertEqual(p.state, .tapPending(releasedAt: 0.1))
    }

    func testDoubleTapLocksThenStops() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.targetDown(at: 0.3)), ProcessorAction.none)
        XCTAssertEqual(p.state, .locked)
        _ = p.handle(.targetUp(at: 0.4)) // release of the locking tap: ignored
        XCTAssertEqual(p.state, .locked)
        XCTAssertEqual(p.handle(.targetDown(at: 5.0)), .stopAndTranscribe)
        XCTAssertEqual(p.state, .idle)
    }

    func testLateSecondPressBecomesNewHold() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        XCTAssertEqual(p.handle(.targetDown(at: 1.0)), ProcessorAction.none)
        XCTAssertEqual(p.state, .pressAndHold(startedAt: 1.0))
    }

    func testEscapeCancelsEveryActiveState() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.escape), .cancelRecording)

        _ = p.handle(.targetDown(at: 1)); _ = p.handle(.targetUp(at: 1.1))
        XCTAssertEqual(p.handle(.escape), .cancelRecording)

        _ = p.handle(.targetDown(at: 2)); _ = p.handle(.targetUp(at: 2.1))
        _ = p.handle(.targetDown(at: 2.3))
        XCTAssertEqual(p.state, .locked)
        XCTAssertEqual(p.handle(.escape), .cancelRecording)
    }

    func testOptionClickWithinThresholdCancels() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.mouseDown(at: 0.2)), .cancelRecording)
        XCTAssertEqual(p.state, .idle)
    }

    func testMouseAfterThresholdIgnored() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.mouseDown(at: 1.0)), ProcessorAction.none)
        XCTAssertEqual(p.state, .pressAndHold(startedAt: 0))
    }

    func testOtherKeyWithinThresholdCancels() {
        _ = p.handle(.targetDown(at: 0))
        XCTAssertEqual(p.handle(.otherKeyDown(at: 0.1)), .cancelRecording)
    }

    func testIdleIgnoresStrayEvents() {
        XCTAssertEqual(p.handle(.targetUp(at: 0)), ProcessorAction.none)
        XCTAssertEqual(p.handle(.escape), ProcessorAction.none)
        XCTAssertEqual(p.handle(.tapWindowExpired(at: 1)), ProcessorAction.none)
        XCTAssertEqual(p.state, .idle)
    }

    func testHotkeyIgnoredNoRestartWhileLocked() {
        _ = p.handle(.targetDown(at: 0)); _ = p.handle(.targetUp(at: 0.1))
        _ = p.handle(.targetDown(at: 0.2))
        XCTAssertEqual(p.handle(.otherKeyDown(at: 3)), ProcessorAction.none)
        XCTAssertEqual(p.state, .locked)
    }

    func testResetFromTapPendingLetsNextPressRecord() {
        // A monitor restarted mid tap-window must not swallow the next hold.
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        p.reset()
        XCTAssertEqual(p.state, .idle)
        XCTAssertEqual(p.handle(.targetDown(at: 5)), .startRecording)
    }

    func testResetAfterRefusedStartKeepsDoubleTapFromLocking() {
        // The controller refused to record (e.g. no model); the processor must not
        // carry on into tapPending/locked while the app stays idle.
        XCTAssertEqual(p.handle(.targetDown(at: 0)), .startRecording)
        p.reset()
        XCTAssertEqual(p.handle(.targetUp(at: 0.1)), ProcessorAction.none)
        XCTAssertEqual(p.state, .idle)
        XCTAssertEqual(p.handle(.targetDown(at: 0.2)), .startRecording)
    }

    func testResetFromLocked() {
        _ = p.handle(.targetDown(at: 0))
        _ = p.handle(.targetUp(at: 0.1))
        _ = p.handle(.targetDown(at: 0.2))
        XCTAssertEqual(p.state, .locked)
        p.reset()
        XCTAssertEqual(p.state, .idle)
    }
}
