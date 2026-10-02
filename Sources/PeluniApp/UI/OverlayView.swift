import SwiftUI
import PeluniCore

@MainActor
final class OverlayModel: ObservableObject {
    @Published var phase: DictationPhase = .idle
    @Published var levels: [Float] = Array(repeating: 0, count: 24)
    @Published var message: String?

    func push(level: Float) {
        levels.removeFirst()
        levels.append(min(1, level * 12))
    }

    func resetLevels() {
        levels = Array(repeating: 0, count: 24)
    }
}

struct OverlayView: View {
    @ObservedObject var model: OverlayModel

    var body: some View {
        HStack(spacing: 10) {
            if model.phase == .recording {
                waveform
            } else if model.phase != .idle {
                ProgressView().controlSize(.small).tint(.white)
            }
            Text(label).font(.callout.weight(.medium)).foregroundStyle(.white)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 10)
        .background(Capsule().fill(.black.opacity(0.85)))
        .overlay(Capsule().strokeBorder(.white.opacity(0.15)))
        .fixedSize()
    }

    private var label: String {
        if let m = model.message { return m }
        switch model.phase {
        case .recording: return "Listening…  (esc to cancel)"
        case .transcribing: return "Transcribing…"
        case .cleaning: return "Cleaning…"
        case .injecting: return "Inserting…"
        case .idle: return ""
        }
    }

    private var waveform: some View {
        HStack(spacing: 2) {
            ForEach(model.levels.indices, id: \.self) { i in
                RoundedRectangle(cornerRadius: 1)
                    .fill(.white)
                    .frame(width: 3, height: 4 + CGFloat(model.levels[i]) * 20)
            }
        }
        .animation(.linear(duration: 0.05), value: model.levels)
    }
}
