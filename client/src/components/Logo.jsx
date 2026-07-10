// RepLog mark — a bold flexed-arm (bicep) icon. Single-colour so it adapts to
// the themed logo tile (chrome on metal themes, white on solid accents).
export default function Logo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* upper arm + forearm bent at 90° */}
      <g stroke="currentColor" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 33 H31" />
        <path d="M32.5 33 V15" />
      </g>
      {/* bicep peak */}
      <circle cx="24" cy="26" r="6.6" fill="currentColor" />
      {/* fist */}
      <circle cx="32.5" cy="12" r="5.6" fill="currentColor" />
    </svg>
  );
}
