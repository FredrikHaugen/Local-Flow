// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "LocalFlow",
    platforms: [.macOS(.v14)],
    products: [
        .library(name: "LocalFlowCore", targets: ["LocalFlowCore"])
    ],
    targets: [
        .target(name: "LocalFlowCore"),
        .binaryTarget(name: "whisper", path: "Vendor/whisper.xcframework"),
        .executableTarget(
            name: "LocalFlowApp",
            dependencies: ["LocalFlowCore", "whisper"],
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
        .testTarget(name: "LocalFlowCoreTests", dependencies: ["LocalFlowCore"]),
    ]
)
