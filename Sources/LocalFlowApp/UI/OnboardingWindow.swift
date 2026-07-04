import SwiftUI
import AppKit

struct OnboardingView: View {
    @ObservedObject var permissions: PermissionsService

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Welcome to LocalFlow").font(.title.bold())
            Text("Everything runs on this Mac. Two permissions are needed:")

            permissionRow(
                granted: permissions.micGranted,
                title: "Microphone",
                detail: "To hear you while you hold the hotkey."
            ) {
                Task { await permissions.requestMic() }
                permissions.openSystemSettings(pane: .microphone)
            }

            permissionRow(
                granted: permissions.accessibilityGranted,
                title: "Accessibility",
                detail: "To type the transcript into the app you're using."
            ) {
                permissions.promptAccessibility()
                permissions.openSystemSettings(pane: .accessibility)
            }

            if permissions.allGranted {
                Label("All set — hold Right Option (⌥) anywhere and speak.", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
            }
        }
        .padding(24)
        .frame(width: 460)
        .onAppear { permissions.startPolling() }
        .onDisappear { permissions.stopPolling() }
    }

    @ViewBuilder
    private func permissionRow(granted: Bool, title: String, detail: String,
                               action: @escaping () -> Void) -> some View {
        HStack(alignment: .top) {
            Image(systemName: granted ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(granted ? .green : .secondary)
                .font(.title2)
            VStack(alignment: .leading) {
                Text(title).font(.headline)
                Text(detail).font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if !granted { Button("Grant…", action: action) }
        }
    }
}

@MainActor
final class OnboardingWindowController {
    private static var window: NSWindow?

    static func showIfNeeded(permissions: PermissionsService) {
        permissions.refresh()
        guard !permissions.allGranted else { return }
        if let window {
            window.makeKeyAndOrderFront(nil)
            NSApp.activate(ignoringOtherApps: true)
            return
        }
        let win = NSWindow(
            contentRect: .zero,
            styleMask: [.titled, .closable],
            backing: .buffered, defer: false)
        win.title = "LocalFlow Setup"
        win.contentView = NSHostingView(rootView: OnboardingView(permissions: permissions))
        win.center()
        win.isReleasedWhenClosed = false
        NotificationCenter.default.addObserver(
            forName: NSWindow.willCloseNotification, object: win, queue: .main
        ) { _ in
            Task { @MainActor in Self.window = nil }
        }
        window = win
        win.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }
}
