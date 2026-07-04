import Foundation

/// Trims leading/trailing silence using per-window RMS energy.
public struct VADTrimmer: Sendable {
    public var threshold: Float
    public var windowSize: Int
    public var padding: Int

    public init(threshold: Float = 0.01, windowSize: Int = 1600, padding: Int = 3200) {
        self.threshold = threshold
        self.windowSize = windowSize
        self.padding = padding
    }

    public func trim(_ samples: [Float]) -> [Float] {
        guard windowSize > 0 else { return samples }
        guard !samples.isEmpty else { return [] }
        var firstLoud: Int? = nil
        var lastLoud: Int? = nil
        var i = 0
        while i < samples.count {
            let end = min(i + windowSize, samples.count)
            var sum: Float = 0
            for j in i..<end { sum += samples[j] * samples[j] }
            let rms = (sum / Float(end - i)).squareRoot()
            if rms >= threshold {
                if firstLoud == nil { firstLoud = i }
                lastLoud = end
            }
            i = end
        }
        guard let start = firstLoud, let stop = lastLoud else { return [] }
        let from = max(0, start - padding)
        let to = min(samples.count, stop + padding)
        return Array(samples[from..<to])
    }
}
