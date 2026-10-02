// Rasterise an SVG with AppKit (which draws strokes, caps and joins exactly like the browser).
// usage: swift scripts/render-svg.swift <in.svg> <out.png> <width> <height> [inset]
// `inset` leaves that many transparent pixels on every side (the macOS app-icon grid).
import AppKit

let args = CommandLine.arguments
guard args.count == 5 || args.count == 6, let w = Int(args[3]), let h = Int(args[4]),
      let image = NSImage(contentsOf: URL(fileURLWithPath: args[1])) else {
    FileHandle.standardError.write("usage: render-svg.swift <in.svg> <out.png> <width> <height> [inset]\n".data(using: .utf8)!)
    exit(1)
}
let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4,
    hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSGraphicsContext.current?.imageInterpolation = .high
let inset = args.count == 6 ? Double(args[5]) ?? 0 : 0
image.draw(in: NSRect(x: inset, y: inset, width: Double(w) - 2 * inset, height: Double(h) - 2 * inset))
NSGraphicsContext.restoreGraphicsState()
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
