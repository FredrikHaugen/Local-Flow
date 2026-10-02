import Foundation
import PeluniCore

@MainActor
final class VocabularyStore: ObservableObject {
    static let shared = VocabularyStore()

    @Published var entries: [VocabularyEntry] {
        didSet { save() }
    }

    private let fileURL: URL

    init() {
        fileURL = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("LocalFlow/vocabulary.json")
        if let data = try? Data(contentsOf: fileURL),
           let decoded = try? JSONDecoder().decode([VocabularyEntry].self, from: data) {
            entries = decoded
        } else {
            entries = []
        }
    }

    private func save() {
        try? FileManager.default.createDirectory(
            at: fileURL.deletingLastPathComponent(), withIntermediateDirectories: true)
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        if let data = try? encoder.encode(entries) {
            try? data.write(to: fileURL, options: .atomic)
        }
    }
}
