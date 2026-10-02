# peluni brand

- `logomark.svg`: light variant (grey tile, ink stroke). The favicons and the macOS app icon use it.
- `logomarkDark.svg`: dark variant (ink tile, light stroke). The site switches to it in dark mode.
- `menubar.svg`: the mark without its tile, black on transparent, for the macOS menu bar template icon.
- Teal `#9DDEB9` is the record light and the site's primary accent. On light surfaces, text and thin
  strokes use the deeper `#1A6E4A`.

`scripts/make-icons.sh` regenerates `Packaging/AppIcon.icns` and `Packaging/MenuBarIcon*.png` from these files.
