// CSS-only diya (oil lamp) with a flickering flame — safe in Server Components.
export function Diya({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <ellipse cx="16" cy="24" rx="11" ry="5.5" fill="#7b1e26" />
      <ellipse cx="16" cy="22.5" rx="11" ry="5" fill="#9a2a33" />
      <path d="M5 22.5 A11 5 0 0 0 27 22.5 Z" fill="#7b1e26" />
      <ellipse cx="16" cy="22.5" rx="7" ry="2.8" fill="#d4af37" />
      <g className="diya-flame">
        <path
          d="M16 8 C13.4 12 13 14.5 13 16.2 A3 3.4 0 0 0 19 16.2 C19 14.5 18.6 12 16 8 Z"
          fill="#ff9933"
        />
        <path
          d="M16 11.5 C14.7 13.8 14.5 15 14.5 16.3 A1.5 1.8 0 0 0 17.5 16.3 C17.5 15 17.3 13.8 16 11.5 Z"
          fill="#ffd873"
        />
      </g>
      <ellipse cx="16" cy="19.4" rx="1.6" ry="0.8" fill="#2d1b12" />
    </svg>
  );
}
