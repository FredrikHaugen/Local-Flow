// The logomark (brand/logomark.svg), inlined so it themes with the page: a grey tile on paper,
// an ink tile with a light stroke in dark mode (brand/logomarkDark.svg), the teal light in both.
export function Logomark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 112 112" fill="none" className={className}>
      <rect width="112" height="112" rx="20" className="fill-logo-tile" />
      {/* A hairline rim, only in dark mode, so the ink tile doesn't dissolve into a near-black page. */}
      <rect x="2" y="2" width="108" height="108" rx="18" fill="none" strokeWidth="4" className="stroke-logo-rim" />
      <path
        d="M20 41H43.6522L68.7826 83H88"
        className="stroke-logo-stroke"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="41" r="12" className="fill-rec" />
    </svg>
  );
}
