// Tests/LocalFlowCoreTests/AutocompleteTriggerPolicyTests.swift
import XCTest
@testable import LocalFlowCore

typealias TriggerAction = AutocompleteTriggerPolicy.Action

final class AutocompleteTriggerPolicyTests: XCTestCase {
    var p = AutocompleteTriggerPolicy()

    override func setUp() { p = AutocompleteTriggerPolicy() }

    func testKeystrokeSchedulesDebounce() {
        XCTAssertEqual(p.handle(.keystroke(at: 0)), .scheduleDebounce(after: p.debounceInterval))
    }

    func testStaleExpiryIsIgnored() {
        _ = p.handle(.keystroke(at: 0))
        _ = p.handle(.keystroke(at: 0.10))
        // Timer armed by the first keystroke fires: too soon after the second.
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.18)), TriggerAction.none)
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.29)), .fire)
    }

    func testQuietPeriodFires() {
        _ = p.handle(.keystroke(at: 0))
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.18)), .fire)
    }

    func testFireConsumesPendingKeystroke() {
        _ = p.handle(.keystroke(at: 0))
        _ = p.handle(.debounceExpired(at: 0.2))
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.4)), TriggerAction.none)
    }

    func testNoFireWhileSuggestionVisible() {
        _ = p.handle(.suggestionShown)
        _ = p.handle(.keystroke(at: 0))
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.2)), TriggerAction.none)
        _ = p.handle(.suggestionDismissed)
        _ = p.handle(.keystroke(at: 1))
        XCTAssertEqual(p.handle(.debounceExpired(at: 1.2)), .fire)
    }

    func testDictationBusySuppressesEverything() {
        _ = p.handle(.dictationBusyChanged(true))
        XCTAssertEqual(p.handle(.keystroke(at: 0)), TriggerAction.none)
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.2)), TriggerAction.none)
        _ = p.handle(.dictationBusyChanged(false))
        _ = p.handle(.keystroke(at: 1))
        XCTAssertEqual(p.handle(.debounceExpired(at: 1.2)), .fire)
    }

    func testDictationBusyDropsPendingTrigger() {
        _ = p.handle(.keystroke(at: 0))
        _ = p.handle(.dictationBusyChanged(true))
        _ = p.handle(.dictationBusyChanged(false))
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.2)), TriggerAction.none)
    }

    func testFocusChangeDropsPendingTrigger() {
        _ = p.handle(.keystroke(at: 0))
        _ = p.handle(.focusChanged)
        XCTAssertEqual(p.handle(.debounceExpired(at: 0.2)), TriggerAction.none)
    }

    func testContextGate() {
        XCTAssertFalse(p.shouldRequestCompletion(context: ""))
        XCTAssertFalse(p.shouldRequestCompletion(context: "short text"))
        XCTAssertFalse(p.shouldRequestCompletion(context: String(repeating: " ", count: 40)))
        XCTAssertTrue(p.shouldRequestCompletion(context: "This is comfortably long enough now."))
    }
}
