// Max 8 absolutely-positioned petals with a slow CSS drift — cheap on
// low-end phones, hidden entirely under prefers-reduced-motion.
// Parent must be `relative overflow-hidden`.

const PETALS = [
  { left: "6%", duration: "16s", delay: "0s", size: 14, color: "#f5a623" },
  { left: "18%", duration: "21s", delay: "-7s", size: 10, color: "#ff9933" },
  { left: "31%", duration: "18s", delay: "-13s", size: 12, color: "#d4af37" },
  { left: "45%", duration: "23s", delay: "-4s", size: 9, color: "#f5a623" },
  { left: "58%", duration: "17s", delay: "-10s", size: 13, color: "#ff9933" },
  { left: "71%", duration: "22s", delay: "-16s", size: 10, color: "#f5a623" },
  { left: "84%", duration: "19s", delay: "-2s", size: 12, color: "#d4af37" },
  { left: "93%", duration: "24s", delay: "-9s", size: 9, color: "#ff9933" },
] as const;

export function Petals() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: p.left,
            ["--petal-duration" as string]: p.duration,
            ["--petal-delay" as string]: p.delay,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 16 16">
            <path
              d="M8 1 C12 4 13 9 8 15 C3 9 4 4 8 1 Z"
              fill={p.color}
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
