import XCTest
import whisper

final class TranscriptionSmokeTests: XCTestCase {
    func testWhisperLoadsAndRunsOnSilence() throws {
        let modelURL = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("peluni/Models/whisper/ggml-base.bin")
        guard FileManager.default.fileExists(atPath: modelURL.path) else {
            throw XCTSkip("ggml-base.bin not downloaded; run the app and download it first")
        }
        var cparams = whisper_context_default_params()
        cparams.use_gpu = true
        guard let ctx = whisper_init_from_file_with_params(modelURL.path, cparams) else {
            return XCTFail("whisper_init failed")
        }
        defer { whisper_free(ctx) }

        var params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY)
        params.no_timestamps = true
        params.print_progress = false
        let silence = [Float](repeating: 0, count: 16_000) // 1 s
        let status = silence.withUnsafeBufferPointer {
            whisper_full(ctx, params, $0.baseAddress, Int32($0.count))
        }
        XCTAssertEqual(status, 0, "whisper_full should succeed on silence")
    }
}
