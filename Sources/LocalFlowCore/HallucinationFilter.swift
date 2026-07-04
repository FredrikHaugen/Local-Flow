import Foundation

/// Strips Whisper's non-speech artifacts: "[Music]", "(applause)", "♪ …", etc.
/// Bracketed/parenthesized text is removed only when it matches known
/// non-speech keywords, so real parentheticals survive.
public struct HallucinationFilter: Sendable {
    private static let keywords = [
        "music", "applause", "laughter", "laughs", "silence", "blank_audio",
        "blank audio", "inaudible", "noise", "static", "coughs", "cough",
        "foreign", "speaking in foreign language", "no audio", "crowd",
    ]

    private static let bracketed = try! NSRegularExpression(
        pattern: #"[\[\(]([^\]\)]{0,60})[\]\)]"#)

    public init() {}

    public func clean(_ text: String) -> String {
        var result = text

        // ♪-framed or ♪-containing runs are always noise.
        result = result.replacingOccurrences(
            of: #"♪[^♪\n]*♪?"#, with: " ", options: .regularExpression)

        // Bracketed segments whose content matches a non-speech keyword.
        let ns = result as NSString
        var out = ""
        var cursor = 0
        for match in Self.bracketed.matches(in: result, range: NSRange(location: 0, length: ns.length)) {
            let inner = ns.substring(with: match.range(at: 1))
                .lowercased().trimmingCharacters(in: .whitespaces)
            let isNoise = Self.keywords.contains { inner == $0 || inner.hasPrefix($0 + " ") }
            if isNoise {
                out += ns.substring(with: NSRange(location: cursor, length: match.range.location - cursor))
                cursor = match.range.location + match.range.length
            }
        }
        out += ns.substring(from: cursor)

        return out
            .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
