import Foundation

/// Builds prompts for the inline completion model and normalizes its raw
/// output into a displayable single-line suggestion. Pure logic, no I/O.
public struct CompletionPromptBuilder: Sendable {
    public var maxContextChars: Int
    public var maxSuggestionChars: Int

    public init(maxContextChars: Int = 400, maxSuggestionChars: Int = 120) {
        self.maxContextChars = maxContextChars
        self.maxSuggestionChars = maxSuggestionChars
    }

    /// Suffix of the focused element's text, cut on a Character boundary.
    public func contextSlice(_ full: String) -> String {
        String(full.suffix(maxContextChars))
    }

    public func systemPrompt() -> String {
        """
        You are an inline autocomplete engine. The user message is the text \
        immediately before the caret. Reply with ONLY the continuation of \
        that text: no quotes, no commentary, and do not repeat the given \
        text. Continue mid-word if the text ends mid-word. Keep it under 12 \
        words and stop at a natural phrase or sentence boundary.
        """
    }

    /// Returns nil when nothing displayable remains.
    public func acceptOutput(_ raw: String, context: String) -> String? {
        var s = raw
        // Ghost text is single-line.
        if let nl = s.firstIndex(where: { $0.isNewline }) { s = String(s[..<nl]) }
        // Models sometimes quote their answer.
        s = s.trimmingCharacters(in: CharacterSet(charactersIn: "\u{0022}\u{201C}\u{201D}\u{2018}\u{2019}"))
        // Strip an echoed context tail: the longest suffix of the recent
        // context that the output starts with (minimum 3 chars of overlap).
        let tail = String(context.suffix(80))
        var len = tail.count
        while len >= 3 {
            let suffix = String(tail.suffix(len))
            if s.hasPrefix(suffix) {
                s = String(s.dropFirst(suffix.count))
                break
            }
            len -= 1
        }
        // Stop at the first sentence end — the spec says newline OR sentence
        // boundary, and the model sometimes rambles past its instructions.
        var idx = s.startIndex
        while idx < s.endIndex {
            if ".!?".contains(s[idx]) {
                let next = s.index(after: idx)
                if next == s.endIndex || s[next].isWhitespace {
                    s = String(s[...idx])
                    break
                }
            }
            idx = s.index(after: idx)
        }
        // Cap on a word boundary.
        if s.count > maxSuggestionChars {
            let cut = String(s.prefix(maxSuggestionChars))
            s = cut.lastIndex(of: " ").map { String(cut[..<$0]) } ?? cut
        }
        while let last = s.last, last == " " || last == "\t" { s.removeLast() }
        guard !s.trimmingCharacters(in: .whitespaces).isEmpty else { return nil }
        return s
    }
}
