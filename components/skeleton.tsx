export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-ink/10 ${className ?? ""}`}
    />
  );
}

export function ListSkeleton({
  rows = 3,
  rowClassName = "h-16",
}: {
  rows?: number;
  rowClassName?: string;
}) {
  return (
    <div className="space-y-2" aria-label="Loading" role="status">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={rowClassName} />
      ))}
    </div>
  );
}
