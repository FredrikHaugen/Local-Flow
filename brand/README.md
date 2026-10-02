# peluni brand

- `logomark.svg`: light variant (grey tile, ink stroke). The site header uses it on light pages, and
  the favicon on dark browser chrome.
- `logomarkDark.svg`: dark variant (ink tile, light stroke). The site header in dark mode, the favicon
  on light browser chrome, the touch icon and the macOS app icon.
- `menubar.svg`: the mark without its tile, black on transparent, for the macOS menu bar template icon.
- Teal `#9DDEB9` is the record light and the site's primary accent. On light surfaces, text and thin
  strokes use the deeper `#1A6E4A`.

`scripts/make-icons.sh` regenerates `Packaging/AppIcon.icns` and `Packaging/MenuBarIcon*.png` from these files
(AppKit renders the SVGs through `scripts/render-svg.swift`; no extra tools needed).
