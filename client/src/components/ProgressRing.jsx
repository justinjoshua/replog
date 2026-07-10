// Circular progress indicator (SVG). Used on the dashboard for the weekly
// training goal. Accent-colored, animates its stroke on value change.
export default function ProgressRing({
  value = 0,
  max = 100,
  size = 130,
  stroke = 11,
  label,
  sub,
}) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="ring-label">
        <span className="ring-value">{label}</span>
        {sub && <span className="ring-sub">{sub}</span>}
      </div>
    </div>
  );
}
