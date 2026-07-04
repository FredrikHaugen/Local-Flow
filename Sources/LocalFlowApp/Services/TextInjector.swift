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
            if await paste(text) { return .pasted }
            // CGEvent posting failed — leave the text on the clipboard so nothing is lost.
            let pb = NSPasteboard.general
            pb.clearContents()
            pb.setString(text, forType: .string)
            return .clipboardOnly
        case .type:
            type(text)
            return .typed
        }
    }

    /// True when the focused UI element is a secure (password) field.
    /// Fails open (false) when AX is unavailable — the paste itself still
    /// requires user-granted Accessibility.
    private func focusedElementIsSecure() -> Bool {
        let systemWide = AXUIElementCreateSystemWide()
        var focused: CFTypeRef?
        guard AXUIElementCopyAttributeValue(
            systemWide, kAXFocusedUIElementAttribute as CFString, &focused) == .success,
            let element = focused, CFGetTypeID(element) == AXUIElementGetTypeID() else { return false }
        let ax = element as! AXUIElement
        var subrole: CFTypeRef?
        if AXUIElementCopyAttributeValue(ax, kAXSubroleAttribute as CFString, &subrole) == .success,
           let s = subrole as? String, s == "AXSecureTextField" {
            return true
        }
        return false
    }

    private func paste(_ text: String) async -> Bool {
        let pb = NSPasteboard.general
        let saved = pb.string(forType: .string)
        pb.clearContents()
        pb.setString(text, forType: .string)
        let ourChange = pb.changeCount

        try? await Task.sleep(for: .milliseconds(120))

        guard let src = CGEventSource(stateID: .combinedSessionState),
              let down = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: true),
              let up = CGEvent(keyboardEventSource: src, virtualKey: 9, keyDown: false) else {
            return false
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
        return true
    }

    /// Fallback: synthetic unicode typing in ≤20-UTF16-unit chunks.
    private func type(_ text: String) {
        let src = CGEventSource(stateID: .combinedSessionState)
        let units = Array(text.utf16)
        var i = 0
        while i < units.count {
            let chunk = Array(units[i..<min(i + 20, units.count)])
            if let down = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true) {
                down.keyboardSetUnicodeString(stringLength: chunk.count, unicodeString: chunk)
                down.post(tap: .cghidEventTap)
            }
            if let up = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) {
                up.post(tap: .cghidEventTap)
            }
            usleep(8_000)
            i += 20
        }
    }
}
