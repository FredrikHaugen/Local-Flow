import Foundation

public struct VocabularyEntry: Codable, Equatable, Identifiable, Sendable {
    public var id: UUID
    public var term: String
    public var soundsLike: [String]

    public init(id: UUID = UUID(), term: String, soundsLike: [String] = []) {
        self.id = id
        self.term = term
        self.soundsLike = soundsLike
    }
}

public struct VocabularyEngine: Sendable {
    public let entries: [VocabularyEntry]

    public init(entries: [VocabularyEntry]) {
        self.entries = entries
    }

    /// Biases whisper toward the user's terms via initial_prompt.
    public var promptText: String? {
        let terms = entries.map(\.term).filter { !$0.isEmpty }
        guard !terms.isEmpty else { return nil }
        var text = "Glossary: "
        for (i, term) in terms.enumerated() {
            let piece = (i == 0 ? "" : ", ") + term
            if text.count + piece.count + 1 > 600 { break }
            text += piece
        }
        return text + "."
    }

    public var glossaryTerms: [String] {
        entries.map(\.term).filter { !$0.isEmpty }
    }

    /// Deterministic post-transcription corrections: alias → canonical term.
    public func apply(to text: String) -> String {
        var result = text
        for entry in entries {
            for alias in entry.soundsLike where !alias.isEmpty {
                let pattern = "\\b" + NSRegularExpression.escapedPattern(for: alias) + "\\b"
                guard let regex = try? NSRegularExpression(
                    pattern: pattern, options: [.caseInsensitive]) else { continue }
                result = regex.stringByReplacingMatches(
                    in: result,
                    range: NSRange(result.startIndex..., in: result),
                    withTemplate: NSRegularExpression.escapedTemplate(for: entry.term))
            }
        }
        return result
    }
}
