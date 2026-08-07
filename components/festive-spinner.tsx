// Rotating marigold — the app's loading spinner. Functional motion (not
// decorative), so it stays animated under prefers-reduced-motion too.
export function FestiveSpinner({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin ${className ?? ""}`}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="5.5"
          rx="2.4"
          ry="3.6"
          fill={i % 2 ? "#f5a623" : "#ffd873"}
          opacity={0.3 + (i / 8) * 0.7}
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2.6" fill="#d4af37" />
    </svg>
  );
}
