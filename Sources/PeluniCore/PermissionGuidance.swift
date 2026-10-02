import Foundation

/// Microphone authorization, mirrored from AVFoundation so Core stays Foundation-only.
public enum MicAuthorization: Sendable {
    case notDetermined, denied, restricted, authorized
}

public enum PermissionAction: Equatable, Sendable {
    case requestPrompt, openSystemSettings, none
}

/// Decides what a "Grant…" button should do for each permission state.
public enum PermissionGuidance {
    /// The system mic prompt only appears while undetermined; after that, only Settings can change it.
    public static func micAction(for status: MicAuthorization) -> PermissionAction {
        switch status {
        case .notDetermined: .requestPrompt
        case .denied, .restricted: .openSystemSettings
        case .authorized: .none
        }
    }

    /// The Accessibility prompt already offers "Open System Settings", so prompt once, then go straight to Settings.
    public static func accessibilityAction(trusted: Bool, promptedBefore: Bool) -> PermissionAction {
        if trusted { return .none }
        return promptedBefore ? .openSystemSettings : .requestPrompt
    }
}
