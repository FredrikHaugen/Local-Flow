import Foundation

public enum CleanupLevel: String, CaseIterable, Sendable {
    case none, light, medium, high
}

public struct CleanupPromptBuilder: Sendable {
    public init() {}

    public func systemPrompt(level: CleanupLevel, glossary: [String]) -> String? {
        guard level != .none else { return nil }
        var p = """
        You clean up dictated speech transcripts. Remove filler words \
        (um, uh, er, you know, like — only when used as filler). \
        Fix punctuation, capitalization, and spacing. \
        Do NOT change the wording. Do NOT add, answer, or summarize anything. \
        Keep the same language as the input. \
        Output ONLY the cleaned text, with no preamble, labels, or quotes.
        """
        if level == .medium || level == .high {
            p += "\nAlso fix obvious grammatical slips and remove false starts and duplicated words."
        }
        if level == .high {
            p += "\nLightly improve readability: split run-on sentences, and format clearly dictated enumerations as lists."
        }
        if !glossary.isEmpty {
            p += "\nPreserve these terms exactly as written: \(glossary.joined(separator: ", "))."
        }
        return p
    }

    /// Sanity-guards LLM output; on any suspicion, returns the raw input
    /// (over-editing is the #1 complaint about the app we're improving on).
    public func acceptOutput(_ output: String, input: String) -> String {
        var out = output.trimmingCharacters(in: .whitespacesAndNewlines)
        out = out.replacingOccurrences(
            of: #"(?s)<think>.*?</think>"#, with: "", options: .regularExpression)
        out = out.trimmingCharacters(in: .whitespacesAndNewlines)
        if out.hasPrefix("```") {
            out = out.replacingOccurrences(
                of: #"^```[a-z]*\n?|\n?```$"#, with: "", options: .regularExpression)
            out = out.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        if out.hasPrefix("\""), out.hasSuffix("\""), out.count >= 2 {
            out = String(out.dropFirst().dropLast())
        }
        guard !out.isEmpty else { return input }
        if out.count > input.count * 5 / 2 + 40 { return input }   // hallucinated expansion
        if input.count > 40, out.count < input.count / 4 { return input } // severe truncation
        return out
    }
}
