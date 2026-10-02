import SwiftUI
import PeluniCore

struct VocabularyTab: View {
    @ObservedObject private var store = VocabularyStore.shared
    @State private var newTerm = ""
    @State private var newSoundsLike = ""

    var body: some View {
        Form {
            Section("Add term") {
                TextField("Term (as it should be written)", text: $newTerm)
                TextField("Sounds like (comma-separated, optional)", text: $newSoundsLike)
                Button("Add") {
                    let aliases = newSoundsLike
                        .split(separator: ",")
                        .map { $0.trimmingCharacters(in: .whitespaces) }
                        .filter { !$0.isEmpty }
                    store.entries.append(
                        VocabularyEntry(term: newTerm.trimmingCharacters(in: .whitespaces),
                                        soundsLike: aliases))
                    newTerm = ""; newSoundsLike = ""
                }
                .disabled(newTerm.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            Section("Terms (\(store.entries.count))") {
                if store.entries.isEmpty {
                    Text("Names, jargon, product names… anything the transcriber gets wrong.")
                        .foregroundStyle(.secondary)
                }
                ForEach(store.entries) { entry in
                    HStack {
                        VStack(alignment: .leading) {
                            Text(entry.term)
                            if !entry.soundsLike.isEmpty {
                                Text("sounds like: \(entry.soundsLike.joined(separator: ", "))")
                                    .font(.caption).foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        Button(role: .destructive) {
                            store.entries.removeAll { $0.id == entry.id }
                        } label: { Image(systemName: "trash") }
                    }
                }
            }
        }
        .formStyle(.grouped)
    }
}
