import Foundation

/// Turns model-download failures into one actionable sentence; nil means the user cancelled.
public enum DownloadErrorMessage {
    public static func text(for error: Error, item: String) -> String? {
        let prefix = "Couldn't download \(item): "
        if error is CancellationError { return nil }
        if let url = error as? URLError {
            switch url.code {
            case .cancelled:
                return nil
            case .notConnectedToInternet, .networkConnectionLost, .dataNotAllowed:
                return prefix + "no internet connection. Connect and try again."
            case .timedOut:
                return prefix + "the connection timed out. Try again."
            case .cannotFindHost, .cannotConnectToHost, .dnsLookupFailed:
                return prefix + "couldn't reach Hugging Face. Check your connection or try again later."
            case .badServerResponse:
                return prefix + "the server returned an error. Try again later."
            case .cannotParseResponse:
                return prefix + "the download was incomplete. Try again."
            default:
                break
            }
        }
        if let cocoa = error as? CocoaError, cocoa.code == .fileWriteOutOfSpace {
            return prefix + "not enough free disk space."
        }
        if let posix = error as? POSIXError, posix.code == .ENOSPC {
            return prefix + "not enough free disk space."
        }
        return prefix + error.localizedDescription
    }
}
