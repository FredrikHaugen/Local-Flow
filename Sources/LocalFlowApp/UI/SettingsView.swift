import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        TabView {
            GeneralTab().tabItem { Label("General", systemImage: "gear") }
            ModelsTab().tabItem { Label("Models", systemImage: "square.and.arrow.down") }
            VocabularyTab().tabItem { Label("Vocabulary", systemImage: "character.book.closed") }
            PermissionsTab().tabItem { Label("Permissions", systemImage: "lock.shield") }
            AdvancedTab().tabItem { Label("Advanced", systemImage: "wrench.and.screwdriver") }
        }
        .frame(width: 560, height: 420)
    }
}
