import XCTest
@testable import LocalFlowCore

final class VocabularyEngineTests: XCTestCase {
    let engine = VocabularyEngine(entries: [
        VocabularyEntry(term: "GraphQL", soundsLike: ["graph ql", "graph QL"]),
        VocabularyEntry(term: "Wispr", soundsLike: ["whisper"]),
        VocabularyEntry(term: "figge", soundsLike: []),
    ])

    func testReplacesSoundsLikeWordBounded() {
        XCTAssertEqual(engine.apply(to: "I use graph ql daily"), "I use GraphQL daily")
    }

    func testCaseInsensitiveAliasMatch() {
        XCTAssertEqual(engine.apply(to: "Graph QL is nice"), "GraphQL is nice")
    }

    func testNoPartialWordReplacement() {
        XCTAssertEqual(engine.apply(to: "the whisperer spoke"), "the whisperer spoke")
        XCTAssertEqual(engine.apply(to: "I like whisper models"), "I like Wispr models")
    }

    func testTermWithoutAliasesIsPromptOnly() {
        XCTAssertEqual(engine.apply(to: "talk to figge"), "talk to figge")
        XCTAssertTrue(engine.promptText!.contains("figge"))
    }

    func testPromptTextFormatAndCap() {
        XCTAssertTrue(engine.promptText!.hasPrefix("Glossary: "))
        let many = (0..<200).map { VocabularyEntry(term: "term\($0)") }
        let big = VocabularyEngine(entries: many)
        XCTAssertLessThanOrEqual(big.promptText!.count, 600)
    }

    func testEmptyVocabularyHasNilPrompt() {
        XCTAssertNil(VocabularyEngine(entries: []).promptText)
    }
}
