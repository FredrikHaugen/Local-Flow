// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "Peluni",
    platforms: [.macOS(.v14)],
    products: [
        .library(name: "PeluniCore", targets: ["PeluniCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/ml-explore/mlx-swift-lm", .upToNextMinor(from: "3.31.4")),
        .package(url: "https://github.com/huggingface/swift-huggingface", .upToNextMinor(from: "0.9.0")),
        .package(url: "https://github.com/huggingface/swift-transformers", from: "1.3.0"),
        .package(url: "https://github.com/sindresorhus/KeyboardShortcuts", from: "3.0.1"),
    ],
    targets: [
        .target(name: "PeluniCore"),
        // Vendored locally; fetch/verify with `make vendor` (see Makefile) before building.
        .binaryTarget(name: "whisper", path: "Vendor/whisper.xcframework"),
        .executableTarget(
            name: "PeluniApp",
            dependencies: [
                "PeluniCore",
                "whisper",
                .product(name: "MLXLLM", package: "mlx-swift-lm"),
                .product(name: "MLXLMCommon", package: "mlx-swift-lm"),
                .product(name: "MLXHuggingFace", package: "mlx-swift-lm"),
                .product(name: "HuggingFace", package: "swift-huggingface"),
                .product(name: "Tokenizers", package: "swift-transformers"),
                .product(name: "KeyboardShortcuts", package: "KeyboardShortcuts"),
            ],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
        .testTarget(name: "PeluniCoreTests", dependencies: ["PeluniCore"]),
        .testTarget(
            name: "PeluniIntegrationTests",
            dependencies: ["PeluniCore", "whisper"]
        ),
    ]
)
