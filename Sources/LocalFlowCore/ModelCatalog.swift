import Foundation

public struct WhisperModel: Identifiable, Hashable, Sendable {
    public let id: String
    public let displayName: String
    public let sizeBytes: Int64
    public let isEnglishOnly: Bool

    public var fileName: String { "ggml-\(id).bin" }
    public var url: URL {
        URL(string: "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/\(fileName)")!
    }

    public static let catalog: [WhisperModel] = [
        WhisperModel(id: "tiny", displayName: "Tiny (fast, rough)", sizeBytes: 77_691_713, isEnglishOnly: false),
        WhisperModel(id: "base", displayName: "Base (recommended start)", sizeBytes: 147_951_465, isEnglishOnly: false),
        WhisperModel(id: "small", displayName: "Small (best balance)", sizeBytes: 487_601_967, isEnglishOnly: false),
        WhisperModel(id: "medium", displayName: "Medium (high accuracy, slower)", sizeBytes: 1_533_763_059, isEnglishOnly: false),
        WhisperModel(id: "large-v3-turbo", displayName: "Large v3 Turbo (max accuracy)", sizeBytes: 1_624_555_275, isEnglishOnly: false),
    ]

    public static let `default` = catalog[1]
}
