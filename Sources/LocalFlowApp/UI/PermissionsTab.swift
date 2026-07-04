import SwiftUI

struct PermissionsTab: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        Form {
            Section("Required permissions") {
                row(granted: appState.permissions.micGranted, name: "Microphone",
                    pane: .microphone)
                row(granted: appState.permissions.accessibilityGranted, name: "Accessibility",
                    pane: .accessibility)
            }
        }
        .formStyle(.grouped)
        .onAppear { appState.permissions.startPolling() }
        .onDisappear { appState.permissions.stopPolling() }
    }

    @ViewBuilder
    private func row(granted: Bool, name: String, pane: PermissionPane) -> some View {
        HStack {
            Image(systemName: granted ? "checkmark.circle.fill" : "xmark.circle")
                .foregroundStyle(granted ? .green : .red)
            Text(name)
            Spacer()
            Button("Open System Settings") {
                appState.permissions.openSystemSettings(pane: pane)
            }
        }
    }
}
