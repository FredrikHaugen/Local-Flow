import ApplicationServices
import AppKit

/// Read-only Accessibility helpers for the autocomplete pipeline. All calls
/// are synchronous; they run only on the debounced trigger path, never
/// per-keystroke.
enum AXFocus {
    static func focusedElement() -> AXUIElement? {
        let systemWide = AXUIElementCreateSystemWide()
        // A hung target app must cost us 250 ms per call, not the ~6 s AX
        // default — these are synchronous mach IPC calls.
        AXUIElementSetMessagingTimeout(systemWide, 0.25)
        var focused: CFTypeRef?
        guard AXUIElementCopyAttributeValue(
            systemWide, kAXFocusedUIElementAttribute as CFString, &focused) == .success,
            let element = focused, CFGetTypeID(element) == AXUIElementGetTypeID() else { return nil }
        let el = element as! AXUIElement
        AXUIElementSetMessagingTimeout(el, 0.25)
        return el
    }

    /// Same rule as TextInjector: AXSecureTextField reported as role or subrole.
    static func isSecure(_ element: AXUIElement) -> Bool {
        for attribute in [kAXSubroleAttribute, kAXRoleAttribute] {
            var value: CFTypeRef?
            if AXUIElementCopyAttributeValue(element, attribute as CFString, &value) == .success,
               let s = value as? String, s == "AXSecureTextField" {
                return true
            }
        }
        return false
    }

    static func selectedRange(_ element: AXUIElement) -> CFRange? {
        var value: CFTypeRef?
        guard AXUIElementCopyAttributeValue(
            element, kAXSelectedTextRangeAttribute as CFString, &value) == .success,
            let v = value, CFGetTypeID(v) == AXValueGetTypeID() else { return nil }
        var range = CFRange()
        guard AXValueGetValue((v as! AXValue), .cfRange, &range) else { return nil }
        return range
    }

    /// Up to `maxChars` characters immediately before the caret. Uses a
    /// ranged read so huge documents are never copied across the AX boundary.
    static func textBeforeCaret(_ element: AXUIElement, maxChars: Int) -> String? {
        guard let sel = selectedRange(element) else { return nil }
        let end = sel.location
        guard end > 0 else { return "" }
        let start = max(0, end - maxChars)
        var range = CFRange(location: start, length: end - start)
        guard let rangeValue = AXValueCreate(.cfRange, &range) else { return nil }
        var out: CFTypeRef?
        guard AXUIElementCopyParameterizedAttributeValue(
            element, kAXStringForRangeParameterizedAttribute as CFString,
            rangeValue, &out) == .success, let s = out as? String else { return nil }
        return s
    }

    /// Screen rectangle of the caret in Cocoa (bottom-left-origin) coords.
    /// Tries the collapsed caret range first; falls back to the right edge of
    /// the character before the caret (some apps return a zero rect for
    /// zero-length ranges).
    static func caretBounds(_ element: AXUIElement) -> CGRect? {
        guard let sel = selectedRange(element) else { return nil }
        if let r = bounds(for: CFRange(location: sel.location, length: 0), in: element),
           r.height > 0 {
            return cocoaRect(r)
        }
        guard sel.location > 0 else { return nil }
        if let r = bounds(for: CFRange(location: sel.location - 1, length: 1), in: element),
           r.height > 0 {
            return cocoaRect(CGRect(x: r.maxX, y: r.minY, width: 0, height: r.height))
        }
        return nil
    }

    static func bounds(for range: CFRange, in element: AXUIElement) -> CGRect? {
        var r = range
        guard let rangeValue = AXValueCreate(.cfRange, &r) else { return nil }
        var out: CFTypeRef?
        guard AXUIElementCopyParameterizedAttributeValue(
            element, kAXBoundsForRangeParameterizedAttribute as CFString,
            rangeValue, &out) == .success, let v = out, CFGetTypeID(v) == AXValueGetTypeID()
        else { return nil }
        var rect = CGRect.zero
        guard AXValueGetValue((v as! AXValue), .cgRect, &rect), rect != .zero else { return nil }
        return rect
    }

    static func role(_ element: AXUIElement) -> String {
        var value: CFTypeRef?
        if AXUIElementCopyAttributeValue(element, kAXRoleAttribute as CFString, &value) == .success,
           let s = value as? String {
            return s
        }
        return "?"
    }

    /// AX reports top-left-origin global coordinates; AppKit wants bottom-left.
    private static func cocoaRect(_ ax: CGRect) -> CGRect {
        let primaryHeight = NSScreen.screens.first?.frame.height ?? 0
        return CGRect(x: ax.minX, y: primaryHeight - ax.maxY, width: ax.width, height: ax.height)
    }
}
