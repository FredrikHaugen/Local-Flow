import AppKit
import SwiftUI

/// Throwaway Phase-0 diagnostic: samples the focused element twice a second
/// and records, per app, whether the caret rectangle is obtainable. This
/// decides where inline ghost text can render vs. where autocomplete must
/// degrade to nothing.
struct ProbeRow: Identifiable {
    let id = UUID()
    let app: String
    let role: String
    let secure: Bool
    let rangeOK: Bool
    let textOK: Bool
    let collapsedBoundsOK: Bool
    let charBoundsOK: Bool
    let rect: String

    // Field-wise on purpose: the stdlib's tuple == stops at arity 6, and a
    // synthesized Equatable would compare the always-unique `id`.
    static func ignoringID(_ a: ProbeRow, _ b: ProbeRow) -> Bool {
        a.app == b.app && a.role == b.role && a.secure == b.secure
            && a.rangeOK == b.rangeOK && a.textOK == b.textOK
            && a.collapsedBoundsOK == b.collapsedBoundsOK && a.charBoundsOK == b.charBoundsOK
    }
}

@MainActor
final class CaretProbeModel: ObservableObject {
    @Published var rows: [ProbeRow] = []
    private var timer: Timer?

    func start() {
        stop()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.sample() }
        }
    }

    func stop() {
        timer?.invalidate()
        timer = nil
    }

    private func sample() {
        let app = NSWorkspace.shared.frontmostApplication?.localizedName ?? "?"
        guard app != "LocalFlow" else { return }
        guard let el = AXFocus.focusedElement() else {
            append(ProbeRow(app: app, role: "no focused element", secure: false, rangeOK: false,
                            textOK: false, collapsedBoundsOK: false, charBoundsOK: false, rect: "—"))
            return
        }
        // Secure fields: never read — not even diagnostically. The row still
        // records that the field is secure, which is all Phase 0 needs.
        if AXFocus.isSecure(el) {
            append(ProbeRow(app: app, role: AXFocus.role(el), secure: true, rangeOK: false,
                            textOK: false, collapsedBoundsOK: false, charBoundsOK: false,
                            rect: "secure — probes skipped"))
            return
        }
        let sel = AXFocus.selectedRange(el)
        var collapsedOK = false, charOK = false, rectDesc = "—"
        if let sel {
            if let r = AXFocus.bounds(for: CFRange(location: sel.location, length: 0), in: el),
               r.height > 0 {
                collapsedOK = true
                rectDesc = String(format: "(%.0f, %.0f, %.0f×%.0f)", r.minX, r.minY, r.width, r.height)
            }
            if sel.location > 0,
               let r = AXFocus.bounds(for: CFRange(location: sel.location - 1, length: 1), in: el),
               r.height > 0 {
                charOK = true
                if rectDesc == "—" {
                    rectDesc = String(format: "char: (%.0f, %.0f, %.0f×%.0f)", r.minX, r.minY, r.width, r.height)
                }
            }
        }
        append(ProbeRow(
            app: app, role: AXFocus.role(el), secure: false,
            rangeOK: sel != nil,
            textOK: AXFocus.textBeforeCaret(el, maxChars: 40) != nil,
            collapsedBoundsOK: collapsedOK, charBoundsOK: charOK, rect: rectDesc))
    }

    private func append(_ row: ProbeRow) {
        if let last = rows.last, ProbeRow.ignoringID(last, row) { return }
        rows.append(row)
        if rows.count > 200 { rows.removeFirst() }
    }

    var markdownTable: String {
        var lines = [
            "| App | Role | Secure | Range | Text | Caret bounds (collapsed) | Caret bounds (prev char) | Rect |",
            "|---|---|---|---|---|---|---|---|",
        ]
        for r in rows {
            lines.append("| \(r.app) | \(r.role) | \(r.secure ? "yes" : "no") | \(r.rangeOK ? "✓" : "✗") | \(r.textOK ? "✓" : "✗") | \(r.collapsedBoundsOK ? "✓" : "✗") | \(r.charBoundsOK ? "✓" : "✗") | \(r.rect) |")
        }
        return lines.joined(separator: "\n")
    }
}

struct CaretProbeView: View {
    @ObservedObject var model: CaretProbeModel

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Click into a text field in another app and type. Rows appear when the focused element or its capabilities change.")
                .font(.caption).foregroundStyle(.secondary)
            Table(model.rows) {
                TableColumn("App") { Text($0.app) }
                TableColumn("Role") { Text($0.role) }
                TableColumn("Secure") { Text($0.secure ? "yes" : "no") }
                TableColumn("Range") { Text($0.rangeOK ? "✓" : "✗") }
                TableColumn("Text") { Text($0.textOK ? "✓" : "✗") }
                TableColumn("Caret ∅") { Text($0.collapsedBoundsOK ? "✓" : "✗") }
                TableColumn("Caret ←") { Text($0.charBoundsOK ? "✓" : "✗") }
                TableColumn("Rect") { Text($0.rect).font(.caption.monospaced()) }
            }
            HStack {
                Button("Copy as Markdown") {
                    NSPasteboard.general.clearContents()
                    NSPasteboard.general.setString(model.markdownTable, forType: .string)
                }
                Button("Clear") { model.rows.removeAll() }
            }
        }
        .padding()
        .frame(minWidth: 720, minHeight: 400)
    }
}

@MainActor
final class CaretProbeWindowController {
    private static var window: NSWindow?
    private static var model: CaretProbeModel?
    private static var closeObserver: (any NSObjectProtocol)?

    static func show() {
        if let window {
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            return
        }
        let m = CaretProbeModel()
        m.start()
        let w = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 760, height: 440),
            styleMask: [.titled, .closable, .resizable],
            backing: .buffered, defer: false)
        w.title = "Caret Probe"
        w.contentView = NSHostingView(rootView: CaretProbeView(model: m))
        w.center()
        w.isReleasedWhenClosed = false
        window = w
        model = m
        w.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        closeObserver = NotificationCenter.default.addObserver(
            forName: NSWindow.willCloseNotification, object: w, queue: .main
        ) { _ in
            Task { @MainActor in
                model?.stop()
                model = nil
                window = nil
                if let closeObserver {
                    NotificationCenter.default.removeObserver(closeObserver)
                }
                closeObserver = nil
            }
        }
    }
}
