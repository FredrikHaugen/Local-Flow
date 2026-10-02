import Foundation
import whisper

actor TranscriptionEngine {
    enum TranscriptionError: Error, LocalizedError {
        case modelNotFound, initFailed, transcribeFailed
        var errorDescription: String? {
            switch self {
            case .modelNotFound: "No transcription model installed. Open Settings → Models."
            case .initFailed: "Could not load the transcription model."
            case .transcribeFailed: "Transcription failed."
            }
        }
    }

    private var ctx: OpaquePointer?
    private var loadedModelPath: String?

    deinit { if let ctx { whisper_free(ctx) } }

    func transcribe(samples: [Float], modelPath: String, language: String, prompt: String?) throws -> String {
        try ensureContext(modelPath: modelPath)
        guard let ctx else { throw TranscriptionError.initFailed }

        var params = whisper_full_default_params(WHISPER_SAMPLING_GREEDY)
        params.print_progress = false
        params.print_realtime = false
        params.print_special = false
        params.print_timestamps = false
        params.no_timestamps = true
        params.suppress_blank = true
        params.n_threads = Int32(max(2, ProcessInfo.processInfo.activeProcessorCount - 2))

        let langC = strdup(language)
        defer { free(langC) }
        params.language = UnsafePointer(langC)

        var promptC: UnsafeMutablePointer<CChar>?
        if let prompt, !prompt.isEmpty { promptC = strdup(prompt) }
        defer { promptC.map { free($0) } }
        if let promptC { params.initial_prompt = UnsafePointer(promptC) }

        let status = samples.withUnsafeBufferPointer { buf in
            whisper_full(ctx, params, buf.baseAddress, Int32(buf.count))
        }
        guard status == 0 else { throw TranscriptionError.transcribeFailed }

        var text = ""
        for i in 0..<whisper_full_n_segments(ctx) {
            if let seg = whisper_full_get_segment_text(ctx, i) {
                text += String(cString: seg)
            }
        }
        return text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private func ensureContext(modelPath: String) throws {
        guard modelPath != loadedModelPath || ctx == nil else { return }
        if let old = ctx { whisper_free(old); ctx = nil }
        var cparams = whisper_context_default_params()
        cparams.use_gpu = true
        ctx = whisper_init_from_file_with_params(modelPath, cparams)
        guard ctx != nil else { throw TranscriptionError.initFailed }
        loadedModelPath = modelPath
    }
}
