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
    /// Single-pass: all matches are located in the ORIGINAL text, so one
    /// entry's replacement can never be re-matched by another entry's alias.
    public func apply(to text: String) -> String {
        struct Replacement {
            let range: Range<String.Index>
            let term: String
        }
        var replacements: [Replacement] = []
        for entry in entries {
            for alias in entry.soundsLike where !alias.isEmpty {
                let pattern = "\\b" + NSRegularExpression.escapedPattern(for: alias) + "\\b"
                guard let regex = try? NSRegularExpression(
                    pattern: pattern, options: [.caseInsensitive]) else { continue }
                let full = NSRange(text.startIndex..., in: text)
                for match in regex.matches(in: text, range: full) {
                    if let range = Range(match.range, in: text) {
                        replacements.append(Replacement(range: range, term: entry.term))
                    }
                }
            }
        }
        replacements.sort { a, b in
            if a.range.lowerBound != b.range.lowerBound {
                return a.range.lowerBound < b.range.lowerBound
            }
            return a.range.upperBound > b.range.upperBound
        }

        var result = ""
        var cursor = text.startIndex
        for replacement in replacements {
            guard replacement.range.lowerBound >= cursor else { continue } // overlapping match: first wins
            result += text[cursor..<replacement.range.lowerBound]
            result += replacement.term
            cursor = replacement.range.upperBound
        }
        result += text[cursor...]
        return result
    }
}
