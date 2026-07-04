import AppKit
import SwiftUI
import LocalFlowCore

@MainActor
final class OverlayController {
    let model = OverlayModel()
    private var panel: NSPanel?
    private var dismissWork: DispatchWorkItem?

    func update(phase: DictationPhase, message: String? = nil) {
        let wasRecording = model.phase == .recording
        model.phase = phase
        model.message = message
        dismissWork?.cancel()

        if phase == .recording && !wasRecording {
            model.resetLevels()   // fresh session starts with a flat waveform
        }

        if phase != .idle {
            show()
        } else if message != nil {
            show()
            let work = DispatchWorkItem { [weak self] in self?.hide() }
            dismissWork = work
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.4, execute: work)
        } else {
            hide()
        }
    }

    private func show() {
        if panel == nil {
            let p = NSPanel(
                contentRect: NSRect(x: 0, y: 0, width: 260, height: 44),
                styleMask: [.borderless, .nonactivatingPanel],
                backing: .buffered, defer: false)
            p.level = .statusBar
            p.isOpaque = false
            p.backgroundColor = .clear
            p.hasShadow = false
            p.ignoresMouseEvents = true
            p.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
            p.contentView = NSHostingView(rootView: OverlayView(model: model))
            panel = p
        }
        guard let panel, let screen = NSScreen.main else { return }
        let size = panel.contentView?.fittingSize ?? NSSize(width: 260, height: 44)
        panel.setContentSize(size)
        let frame = screen.visibleFrame
        panel.setFrameOrigin(NSPoint(
            x: frame.midX - size.width / 2,
            y: frame.minY + 64))
        panel.orderFrontRegardless()
    }

    private func hide() {
        panel?.orderOut(nil)
        model.resetLevels()
    }
}
