import XCTest
@testable import LocalFlowCore

final class CleanupPromptBuilderTests: XCTestCase {
    let b = CleanupPromptBuilder()

    func testNoneLevelHasNoPrompt() {
        XCTAssertNil(b.systemPrompt(level: .none, glossary: []))
    }

    func testLightPromptCorePledges() {
        let p = b.systemPrompt(level: .light, glossary: [])!
        XCTAssertTrue(p.contains("filler words"))
        XCTAssertTrue(p.contains("Do NOT change the wording"))
        XCTAssertTrue(p.contains("Output ONLY the cleaned text"))
        XCTAssertTrue(p.contains("same language"))
    }

    func testHigherLevelsAreSupersets() {
        let light = b.systemPrompt(level: .light, glossary: [])!
        let medium = b.systemPrompt(level: .medium, glossary: [])!
        let high = b.systemPrompt(level: .high, glossary: [])!
        XCTAssertTrue(medium.contains("false starts"))
        XCTAssertTrue(high.contains("lists"))
        XCTAssertGreaterThan(medium.count, light.count)
        XCTAssertGreaterThan(high.count, medium.count)
    }

    func testGlossaryIncluded() {
        let p = b.systemPrompt(level: .light, glossary: ["GraphQL", "Fredrik"])!
        XCTAssertTrue(p.contains("GraphQL, Fredrik"))
    }

    func testAcceptOutputPassthrough() {
        XCTAssertEqual(b.acceptOutput("Clean text.", input: "clean text"), "Clean text.")
    }

    func testAcceptOutputFallsBackOnEmpty() {
        XCTAssertEqual(b.acceptOutput("  ", input: "original"), "original")
    }

    func testAcceptOutputFallsBackOnExplosion() {
        let input = "short input text here"
        let exploded = String(repeating: "blah ", count: 100)
        XCTAssertEqual(b.acceptOutput(exploded, input: input), input)
    }

    func testAcceptOutputFallsBackOnSevereTruncation() {
        let input = String(repeating: "a reasonable sentence. ", count: 10)
        XCTAssertEqual(b.acceptOutput("ok", input: input), input)
    }

    func testAcceptOutputStripsWrappers() {
        XCTAssertEqual(b.acceptOutput("```\nHello.\n```", input: "hello"), "Hello.")
        XCTAssertEqual(b.acceptOutput("<think>hmm</think>Hello.", input: "hello"), "Hello.")
        XCTAssertEqual(b.acceptOutput("\"Hello.\"", input: "hello"), "Hello.")
    }
}
