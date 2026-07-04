import AppKit
import ApplicationServices

enum InjectionMethod: String { case paste, type }

enum InjectionResult: Equatable { case pasted, typed, clipboardOnly, blockedSecureField, noText }

@MainActor
final class TextInjector {

    func inject(_ text: String, method: InjectionMethod) async -> InjectionResult {
        guard !text.isEmpty else { return .noText }
        if focusedElementIsSecure() { return .blockedSecureField }

        switch method {
        case .paste:
            switch await paste(text) {
            case .posted:
                return .pasted
            case .blockedSecureField:
                return .blockedSecureField
            case .eventFailure:
                // paste() already left the transcript on the clipboard; nothing is lost.
                return .clipboardOnly
            }
        case .type:
            await type(text)
            return .typed
        }
    }

    /// True when the focused UI element is a secure (password) field.
    /// Checks both subrole and role — apps report AXSecureTextField either way.
    /// Fails open (false) when AX is unavailable — the paste itself still
    /// requires user-granted Accessibility.
    private func focusedElementIsSecure() -> Bool {
        let systemWide = AXUIElementCreateSystemWide()
        var focused: CFTypeRef?
        guard AXUIElementCopyAttributeValue(
            systemWide, kAXFocusedUIElementAttribute as CFString, &focused) == .success,
            let element = focused, CFGetTypeID(element) == AXUIElementGetTypeID() else { return false }
        let ax = element as! AXUIElement
        for attribute in [kAXSubroleAttribute, kAXRoleAttribute] {
            var value: CFTypeRef?
            if AXUIElementCopyAttributeValue(ax, attribute as CFString, &value) == .success,
               let s = value as? String, s == "AXSecureTextField" {
                return true
            }
        }
        return false
    }

    private enum PasteOutcome { case posted, eventFailure, blockedSecureField }

    private func paste(_ text: String) async -> PasteOutcome {
        let pb = NSPasteboard.general
        let saved = pb.string(forType: .string)
        pb.clearContents()
        pb.setString(text, forType: .string)
        let ourChange = pb.changeCount

        try? await Task.sleep(for: .milliseconds(120))

        // Focus can move during the settle delay — re-check before posting (TOCTOU guard).
        if focusedElementIsSecure() {
            if pb.changeCount == ourChange {
                pb.clearContents()
                if let saved { pb.setString(saved, forType: .string) }
            }
            return .blockedSecureField
        }

        guard let src = CGEventSource(stateID: .combinedSessionState),
              let down = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: true),
              let up = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: false) else {
            return .eventFailure
        }
        down.flags = .maskCommand
        up.flags = .maskCommand
        down.post(tap: .cghidEventTap)
        up.post(tap: .cghidEventTap)

        // Restore the previous clipboard once the paste has been consumed,
        // unless something else changed the pasteboard in the meantime.
        Task {
            try? await Task.sleep(for: .milliseconds(700))
            if pb.changeCount == ourChange {
                pb.clearContents()
                if let saved { pb.setString(saved, forType: .string) }
            }
        }
        return .posted
    }

    /// Fallback: synthetic unicode typing in ≤20-UTF16-unit chunks.
    /// Async so the inter-chunk pacing never blocks the main thread.
    private func type(_ text: String) async {
        let src = CGEventSource(stateID: .combinedSessionState)
        let units = Array(text.utf16)
        var i = 0
        while i < units.count {
            var end = min(i + 20, units.count)
            // Never split a surrogate pair across chunk boundaries.
            if end < units.count, end - i > 1, (0xD800...0xDBFF).contains(units[end - 1]) {
                end -= 1
            }
            let chunk = Array(units[i..<end])
            if let down = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true) {
                down.keyboardSetUnicodeString(stringLength: chunk.count, unicodeString: chunk)
                down.post(tap: .cghidEventTap)
            }
            if let up = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) {
                up.post(tap: .cghidEventTap)
            }
            try? await Task.sleep(for: .milliseconds(8))
            i = end
        }
    }
}
