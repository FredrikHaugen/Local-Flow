import XCTest
@testable import LocalFlowCore

final class PermissionGuidanceTests: XCTestCase {
    func testUndeterminedMicShowsSystemPromptOnly() {
        XCTAssertEqual(PermissionGuidance.micAction(for: .notDetermined), .requestPrompt)
    }

    func testDeniedMicOpensSettings() {
        // requestAccess never shows UI again after a denial; Settings is the only path.
        XCTAssertEqual(PermissionGuidance.micAction(for: .denied), .openSystemSettings)
    }

    func testRestrictedMicOpensSettings() {
        XCTAssertEqual(PermissionGuidance.micAction(for: .restricted), .openSystemSettings)
    }

    func testAuthorizedMicDoesNothing() {
        XCTAssertEqual(PermissionGuidance.micAction(for: .authorized), .none)
    }

    func testFirstAccessibilityClickPromptsOnly() {
        XCTAssertEqual(PermissionGuidance.accessibilityAction(trusted: false, promptedBefore: false), .requestPrompt)
    }

    func testLaterAccessibilityClicksOpenSettings() {
        XCTAssertEqual(PermissionGuidance.accessibilityAction(trusted: false, promptedBefore: true), .openSystemSettings)
    }

    func testTrustedAccessibilityDoesNothing() {
        XCTAssertEqual(PermissionGuidance.accessibilityAction(trusted: true, promptedBefore: false), .none)
        XCTAssertEqual(PermissionGuidance.accessibilityAction(trusted: true, promptedBefore: true), .none)
    }
}
