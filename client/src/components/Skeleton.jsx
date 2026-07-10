// Loading placeholders that match the real card footprint, so the layout
// doesn't jump when data arrives.

export function CardSkeleton() {
  return <div className="skeleton sk-card" />;
}

export function SkeletonGrid({ count = 6, className = "ex-grid" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function LineSkeleton({ w = "100%", h = 14, style }) {
  return <div className="skeleton" style={{ width: w, height: h, ...style }} />;
}
