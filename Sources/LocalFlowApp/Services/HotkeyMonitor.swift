import AppKit
import LocalFlowCore

enum HotkeyIntent { case begin, end, cancel }

@MainActor
final class HotkeyMonitor {
    var onIntent: ((HotkeyIntent) -> Void)?

    private var processor = HotKeyProcessor()
    private var monitors: [Any] = []
    private var expiryWork: DispatchWorkItem?
    private let mask: NSEvent.EventTypeMask = [.flagsChanged, .keyDown, .leftMouseDown]

    func start() {
        stop()
        if let global = NSEvent.addGlobalMonitorForEvents(matching: mask, handler: { [weak self] event in
            DispatchQueue.main.async { self?.handle(event) }
        }) {
            monitors.append(global)
        }
        let local = NSEvent.addLocalMonitorForEvents(matching: mask) { [weak self] event in
            DispatchQueue.main.async { self?.handle(event) }
            return event
        }
        if let local { monitors.append(local) }
    }

    func stop() {
        monitors.forEach { NSEvent.removeMonitor($0) }
        monitors.removeAll()
        reset()
    }

    /// Forget any half-finished press/tap, e.g. when the controller refused to record.
    func reset() {
        expiryWork?.cancel()
        expiryWork = nil
        processor.reset()
    }

    private func handle(_ event: NSEvent) {
        let t = event.timestamp
        let processorEvent: ProcessorEvent
        switch event.type {
        case .flagsChanged where event.keyCode == 61:
            processorEvent = event.modifierFlags.contains(.option) ? .targetDown(at: t) : .targetUp(at: t)
        case .flagsChanged:
            return
        case .keyDown where event.keyCode == 53:
            processorEvent = .escape
        case .keyDown:
            processorEvent = .otherKeyDown(at: t)
        case .leftMouseDown:
            processorEvent = .mouseDown(at: t)
        default:
            return
        }
        feed(processorEvent)
    }

    private func feed(_ processorEvent: ProcessorEvent) {
        expiryWork?.cancel()
        let action = processor.handle(processorEvent)
        switch action {
        case .startRecording: onIntent?(.begin)
        case .stopAndTranscribe: onIntent?(.end)
        case .cancelRecording: onIntent?(.cancel)
        case .none: break
        }
        if case .tapPending = processor.state {
            let work = DispatchWorkItem { [weak self] in
                self?.feed(.tapWindowExpired(at: ProcessInfo.processInfo.systemUptime))
            }
            expiryWork = work
            DispatchQueue.main.asyncAfter(
                deadline: .now() + processor.doubleTapWindow + 0.02, execute: work)
        }
    }
}
