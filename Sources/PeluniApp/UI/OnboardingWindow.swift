import SwiftUI
import AppKit
import PeluniCore

struct OnboardingView: View {
    @ObservedObject var permissions: PermissionsService
    @ObservedObject var models: ModelManager

    private var hasSpeechModel: Bool { models.activeModel != nil }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Welcome to LocalFlow").font(.title.bold())
            Text("Everything runs on this Mac. Three quick steps:")

            permissionRow(
                granted: permissions.micGranted,
                title: "Microphone",
                detail: permissions.micAction == .openSystemSettings
                    ? "Access was turned off. Switch LocalFlow on in System Settings → Privacy & Security → Microphone."
                    : "To hear you while you hold the hotkey.",
                button: buttonTitle(permissions.micAction)
            ) {
                Task { await permissions.grantMic() }
            }

            permissionRow(
                granted: permissions.accessibilityGranted,
                title: "Accessibility",
                detail: permissions.accessibilityAction == .openSystemSettings
                    ? "Switch LocalFlow on in System Settings → Privacy & Security → Accessibility."
                    : "To type the transcript into the app you're using.",
                button: buttonTitle(permissions.accessibilityAction)
            ) {
                permissions.grantAccessibility()
            }

            speechModelRow

            if permissions.allGranted && hasSpeechModel {
                Label("All set — hold Right Option (⌥) anywhere and speak.", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
            }
        }
        .padding(24)
        .frame(width: 460)
        .onAppear { permissions.startPolling(); models.refresh() }
        .onDisappear { permissions.stopPolling() }
    }

    @ViewBuilder
    private var speechModelRow: some View {
        let model = WhisperModel.default
        HStack(alignment: .top) {
            Image(systemName: hasSpeechModel ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(hasSpeechModel ? .green : .secondary)
                .font(.title2)
            VStack(alignment: .leading) {
                Text("Speech model").font(.headline)
                Text("\(model.displayName), \(ByteCountFormatter.string(fromByteCount: model.sizeBytes, countStyle: .file)) — downloaded once, then fully offline.")
                    .font(.caption).foregroundStyle(.secondary)
                if let err = models.lastError {
                    Text(err).font(.caption).foregroundStyle(.red)
                }
            }
            Spacer()
            if let p = models.progress[model.id] {
                ProgressView(value: p).frame(width: 90)
                Text("\(Int(p * 100))%").font(.caption).monospacedDigit()
                Button("Cancel") { models.cancelDownload(model) }
            } else if !hasSpeechModel {
                Button(models.lastError == nil ? "Download" : "Retry") { models.download(model) }
            }
        }
    }

    private func buttonTitle(_ action: PermissionAction) -> String {
        action == .openSystemSettings ? "Open Settings…" : "Allow…"
    }

    @ViewBuilder
    private func permissionRow(granted: Bool, title: String, detail: String, button: String,
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
            if !granted { Button(button, action: action) }
        }
    }
}

@MainActor
final class OnboardingWindowController {
    private static var window: NSWindow?

    static func showIfNeeded(permissions: PermissionsService, models: ModelManager) {
        permissions.refresh()
        models.refresh()
        guard !(permissions.allGranted && models.activeModel != nil) else { return }
        show(permissions: permissions, models: models)
    }

    /// Opens setup regardless of state (menu "Setup…").
    static func show(permissions: PermissionsService, models: ModelManager) {
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
        win.contentView = NSHostingView(rootView: OnboardingView(permissions: permissions, models: models))
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
