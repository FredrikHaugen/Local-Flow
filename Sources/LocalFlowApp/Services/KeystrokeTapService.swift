import AppKit
import CoreGraphics
import os

/// Active CGEventTap over key events (plus scroll/click for dismissal), alive
/// only while the autocomplete toggle is on. An *active* tap needs
/// Accessibility — which LocalFlow already requires — not Input Monitoring.
///
/// The tap runs on its OWN thread with its own run loop: the window server
/// holds every keyboard event for our callback, so it must never wait on the
/// main thread (which does synchronous AX IPC on the trigger path — a hung
/// target app would otherwise stall typing system-wide until the tap
/// watchdog fires). The callback does integer/flag work only, consulting a
/// lock-protected snapshot; controller callbacks hop to the main actor
/// themselves.
final class KeystrokeTapService: @unchecked Sendable {
    private struct ConsumeState {
        /// Key-downs to swallow (Tab/Esc while a suggestion shows).
        var keys: Set<CGKeyCode> = []
        /// Key-ups owed a swallow so apps never see an orphan release.
        var pendingKeyUps: Set<CGKeyCode> = []
    }

    private let state = OSAllocatedUnfairLock(initialState: ConsumeState())
    private let ownPID = Int64(ProcessInfo.processInfo.processIdentifier)

    // Set once (from the main actor) before start(); invoked on the tap thread.
    var onKeyDown: (@Sendable (CGKeyCode) -> Void)?
    var onConsumedKey: (@Sendable (CGKeyCode) -> Void)?
    var onPointerActivity: (@Sendable () -> Void)?

    /// Lock-boxed: the tap thread's re-arm path reads it while stop() clears
    /// it on the main thread.
    private let port = OSAllocatedUnfairLock<CFMachPort?>(initialState: nil)
    private var thread: Thread?
    private var runLoop: CFRunLoop?

    /// start() retains self into the tap's userInfo; stop() balances it. The
    /// service therefore cannot deinit while the tap can still call out.
    private var selfRetain: Unmanaged<KeystrokeTapService>?

    /// Which key-downs to swallow ([] = swallow nothing). Called by the
    /// controller when a suggestion shows/hides.
    func setConsumableKeys(_ keys: Set<CGKeyCode>) {
        state.withLock {
            $0.keys = keys
            if keys.isEmpty { $0.pendingKeyUps.removeAll() }
        }
    }

    @discardableResult
    func start() -> Bool {
        stop()
        let mask: CGEventMask =
            (1 << CGEventType.keyDown.rawValue)
            | (1 << CGEventType.keyUp.rawValue)
            | (1 << CGEventType.scrollWheel.rawValue)
            | (1 << CGEventType.leftMouseDown.rawValue)
            | (1 << CGEventType.rightMouseDown.rawValue)
            | (1 << CGEventType.otherMouseDown.rawValue)
        let retained = Unmanaged.passRetained(self)
        guard let tap = CGEvent.tapCreate(
            tap: .cgSessionEventTap,
            place: .headInsertEventTap,
            options: .defaultTap,
            eventsOfInterest: mask,
            callback: { _, type, event, info in
                guard let info else { return Unmanaged.passUnretained(event) }
                let service = Unmanaged<KeystrokeTapService>.fromOpaque(info).takeUnretainedValue()
                return service.handle(type: type, event: event)
            },
            userInfo: retained.toOpaque()
        ) else {
            retained.release()
            NSLog("LocalFlow: keystroke tap creation failed (Accessibility not granted?)")
            return false
        }
        selfRetain = retained
        port.withLock { $0 = tap }
        let ready = DispatchSemaphore(value: 0)
        // The thread closure captures the port directly — it never reads
        // mutable service state.
        let thread = Thread { [weak self] in
            let source = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0)
            self?.runLoop = CFRunLoopGetCurrent()
            CFRunLoopAddSource(CFRunLoopGetCurrent(), source, .commonModes)
            CGEvent.tapEnable(tap: tap, enable: true)
            ready.signal()
            CFRunLoopRun()   // exits when stop() calls CFRunLoopStop
        }
        thread.name = "LocalFlow.KeystrokeTap"
        thread.qualityOfService = .userInteractive
        self.thread = thread
        thread.start()
        ready.wait()   // runLoop is set before this returns (semaphore = happens-before)
        return true
    }

    func stop() {
        let tap = port.withLock { boxed -> CFMachPort? in
            let v = boxed
            boxed = nil
            return v
        }
        if let tap {
            CGEvent.tapEnable(tap: tap, enable: false)
            CFMachPortInvalidate(tap)
        }
        if let runLoop { CFRunLoopStop(runLoop) }
        runLoop = nil
        thread = nil
        state.withLock { $0.keys = []; $0.pendingKeyUps = [] }
        // Balance start()'s passRetained now that the port cannot call out.
        selfRetain?.release()
        selfRetain = nil
    }

    deinit { stop() }

    /// Runs on the tap thread. Cheap integer/flag work only — never AX.
    private func handle(type: CGEventType, event: CGEvent) -> Unmanaged<CGEvent>? {
        switch type {
        case .tapDisabledByTimeout, .tapDisabledByUserInput:
            // The system disables taps it thinks are stalling; re-arm ours.
            port.withLock { if let tap = $0 { CGEvent.tapEnable(tap: tap, enable: true) } }
            return Unmanaged.passUnretained(event)
        case .keyDown:
            // LocalFlow's own synthesized events (dictation's ⌘V paste, the
            // typing fallback) must never arm an autocomplete trigger.
            if event.getIntegerValueField(.eventSourceUnixProcessID) == ownPID {
                return Unmanaged.passUnretained(event)
            }
            let keyCode = CGKeyCode(event.getIntegerValueField(.keyboardEventKeycode))
            let consume = state.withLock { s -> Bool in
                guard s.keys.contains(keyCode) else { return false }
                s.pendingKeyUps.insert(keyCode)
                return true
            }
            if consume {
                onConsumedKey?(keyCode)
                return nil
            }
            onKeyDown?(keyCode)
            return Unmanaged.passUnretained(event)
        case .keyUp:
            let keyCode = CGKeyCode(event.getIntegerValueField(.keyboardEventKeycode))
            let consume = state.withLock { $0.pendingKeyUps.remove(keyCode) != nil }
            return consume ? nil : Unmanaged.passUnretained(event)
        case .scrollWheel, .leftMouseDown, .rightMouseDown, .otherMouseDown:
            onPointerActivity?()
            return Unmanaged.passUnretained(event)
        default:
            return Unmanaged.passUnretained(event)
        }
    }
}
