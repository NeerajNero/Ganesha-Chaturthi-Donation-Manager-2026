// Hand-drawn-style chibi Ganesha as pure inline SVG. No client JS — safe to
// render in Server Components (receipt watermark, loading fallback). The
// interactive wrapper (ganesha-scene.tsx) animates it via these props.

export type PupilOffset = { x: number; y: number };

const SKIN = "#ffab5e";
const SKIN_LIGHT = "#ffc287";
const INNER_EAR = "#ef9d78";
const MAROON = "#7b1e26";
const MAROON_LIGHT = "#9a2a33";
const GOLD = "#d4af37";
const GOLD_LIGHT = "#ffd873";
const INK = "#2d1b12";

export function GaneshaSvg({
  pupilOffset = { x: 0, y: 0 },
  swaying = false,
  blessed = false,
  breathing = false,
  className,
}: {
  pupilOffset?: PupilOffset;
  swaying?: boolean;
  blessed?: boolean;
  breathing?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 260"
      role="img"
      aria-label="Lord Ganesha"
      className={className}
    >
      {/* halo */}
      <circle cx="120" cy="104" r="86" fill={GOLD} opacity="0.13" />
      <circle
        cx="120"
        cy="104"
        r="86"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        opacity="0.4"
      />
      {blessed && (
        <circle className="g-glow" cx="120" cy="115" r="90" fill={GOLD_LIGHT} opacity="0" />
      )}

      <g className={breathing ? "g-breathe" : undefined}>
        {/* cushion */}
        <ellipse cx="120" cy="238" rx="82" ry="14" fill={MAROON} />
        <ellipse cx="120" cy="233" rx="82" ry="12" fill={MAROON_LIGHT} />
        <ellipse cx="120" cy="230" rx="60" ry="7" fill={GOLD} opacity="0.85" />

        {/* ears */}
        <ellipse cx="60" cy="96" rx="29" ry="35" fill={SKIN} stroke={MAROON} strokeWidth="3" />
        <ellipse cx="63" cy="97" rx="18" ry="23" fill={INNER_EAR} />
        <ellipse cx="180" cy="96" rx="29" ry="35" fill={SKIN} stroke={MAROON} strokeWidth="3" />
        <ellipse cx="177" cy="97" rx="18" ry="23" fill={INNER_EAR} />

        {/* crossed legs */}
        <ellipse cx="86" cy="216" rx="27" ry="13" fill={SKIN} stroke={MAROON} strokeWidth="3" />
        <ellipse cx="154" cy="216" rx="27" ry="13" fill={SKIN} stroke={MAROON} strokeWidth="3" />

        {/* dhoti */}
        <ellipse cx="120" cy="198" rx="55" ry="30" fill={MAROON_LIGHT} stroke={MAROON} strokeWidth="3" />

        {/* belly */}
        <circle cx="120" cy="168" r="44" fill={SKIN} stroke={MAROON} strokeWidth="3" />
        <ellipse cx="120" cy="177" rx="26" ry="19" fill={SKIN_LIGHT} />
        {/* sash */}
        <path
          d="M85 138 Q114 158 156 197"
          fill="none"
          stroke={GOLD}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* left arm + modak */}
        <path
          d="M84 152 C72 160 66 170 64 180"
          fill="none"
          stroke={SKIN}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="62" cy="183" r="10" fill={SKIN} stroke={MAROON} strokeWidth="3" />
        <ellipse cx="62" cy="171" rx="9" ry="6" fill="#f0c060" stroke="#b8860b" strokeWidth="1.5" />
        <path
          d="M54 169 Q62 156 70 169 M58 170 L62 158 M66 170 L62 158"
          fill="none"
          stroke="#b8860b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* right arm raised in blessing */}
        <path
          d="M156 152 C168 146 174 138 177 131"
          fill="none"
          stroke={SKIN}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <circle cx="179" cy="127" r="10.5" fill={SKIN} stroke={MAROON} strokeWidth="3" />

        {/* head */}
        <circle cx="120" cy="96" r="54" fill={SKIN} stroke={MAROON} strokeWidth="3" />

        {/* crown */}
        <path
          d="M76 70 Q120 28 164 70 Q120 50 76 70 Z"
          fill={GOLD}
          stroke={MAROON}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M112 42 L120 18 L128 42 Z"
          fill={GOLD}
          stroke={MAROON}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="120" cy="34" r="3.5" fill={MAROON} />

        {/* tilak */}
        <path d="M120 60 v13" stroke={MAROON} strokeWidth="4" strokeLinecap="round" />
        <path d="M113 63 q7 9 14 0" fill="none" stroke={MAROON_LIGHT} strokeWidth="2.5" strokeLinecap="round" />

        {/* brows */}
        <path d="M91 78 q10 -6 19 -2" fill="none" stroke={MAROON} strokeWidth="3" strokeLinecap="round" />
        <path d="M130 76 q9 -4 19 2" fill="none" stroke={MAROON} strokeWidth="3" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx="101" cy="91" rx="8" ry="9.5" fill="#fff" stroke={MAROON} strokeWidth="2" />
        <ellipse cx="139" cy="91" rx="8" ry="9.5" fill="#fff" stroke={MAROON} strokeWidth="2" />
        <g transform={`translate(${pupilOffset.x} ${pupilOffset.y})`}>
          <circle cx="101" cy="92" r="3.4" fill={INK} />
          <circle cx="139" cy="92" r="3.4" fill={INK} />
          <circle cx="102.4" cy="90.6" r="1.1" fill="#fff" />
          <circle cx="140.4" cy="90.6" r="1.1" fill="#fff" />
        </g>

        {/* cheeks */}
        <circle cx="90" cy="110" r="7" fill="#ff9933" opacity="0.35" />
        <circle cx="150" cy="110" r="7" fill="#ff9933" opacity="0.35" />

        {/* tusk (right; left traditionally broken) */}
        <path
          d="M132 116 q11 7 9 18 q-9 -2 -12 -9 z"
          fill="#fffdf5"
          stroke={MAROON}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* trunk */}
        <g className={`g-trunk${swaying ? " g-trunk-sway" : ""}`}>
          <path
            d="M120 104 C121 122 124 132 116 141 C108 150 97 152 90 147"
            fill="none"
            stroke={MAROON}
            strokeWidth="19"
            strokeLinecap="round"
          />
          <path
            d="M120 104 C121 122 124 132 116 141 C108 150 97 152 90 147"
            fill="none"
            stroke={SKIN}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M114 118 q6 3 11 1 M112 130 q6 3 11 0 M104 141 q5 4 10 2"
            fill="none"
            stroke={MAROON}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="89" cy="146" r="2.4" fill={INK} />
        </g>
      </g>
    </svg>
  );
}
