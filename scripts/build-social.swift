// Run from the website root. Uses the existing app icon; no external assets.
import AppKit
import CoreGraphics
import CoreText
import ImageIO
import UniformTypeIdentifiers
let width = 1200, height = 630
let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: width * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
func color(_ hex: UInt32) -> CGColor { CGColor(srgbRed: CGFloat((hex >> 16) & 255)/255, green: CGFloat((hex >> 8) & 255)/255, blue: CGFloat(hex & 255)/255, alpha: 1) }
context.setFillColor(color(0xFAFBF8)); context.fill(CGRect(x: 0, y: 0, width: width, height: height))
context.setFillColor(color(0xD7FC50)); context.fill(CGRect(x: 810, y: 0, width: 390, height: 630))
func text(_ value: String, _ x: CGFloat, _ top: CGFloat, _ size: CGFloat, _ bold: Bool = false, _ fill: UInt32 = 0x111517) {
    let font = CTFontCreateWithName((bold ? "HelveticaNeue-Bold" : "HelveticaNeue") as CFString, size, nil)
    let string = NSAttributedString(string: value, attributes: [.font: font, .foregroundColor: NSColor(cgColor: color(fill))!, .kern: bold ? -size * 0.045 : 0])
    let line = CTLineCreateWithAttributedString(string)
    context.textPosition = CGPoint(x: x, y: 630 - top - CTFontGetAscent(font)); CTLineDraw(line, context)
}
text("sculpt", 65, 48, 44, true)
text("OUT NOW ON THE APP STORE", 66, 138, 15)
text("Your body.", 60, 190, 89, true)
text("Your plan.", 60, 278, 89, true)
text("Your progress.", 60, 366, 89, true, 0x65715E)
text("Fitness engineered for you.", 66, 528, 22)
let icon = NSImage(contentsOfFile: "assets/app-icon.webp")!
var rect = CGRect(x: 865, y: 200, width: 280, height: 280)
let image = icon.cgImage(forProposedRect: &rect, context: nil, hints: nil)!
context.saveGState(); context.addPath(CGPath(roundedRect: rect, cornerWidth: 62, cornerHeight: 62, transform: nil)); context.clip(); context.draw(image, in: rect); context.restoreGState()
let url = URL(fileURLWithPath: "assets/launch-social.jpg")
let output = CGImageDestinationCreateWithURL(url as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(output, context.makeImage()!, [kCGImageDestinationLossyCompressionQuality: 0.9] as CFDictionary)
precondition(CGImageDestinationFinalize(output))
print("Created assets/launch-social.jpg (1200 × 630)")
