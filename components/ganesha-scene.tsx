"use client";

import { useEffect, useRef, useState } from "react";
import { GaneshaSvg, type PupilOffset } from "./ganesha-svg";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// 12 burst petals on a circle — deterministic (no Math.random) so renders
// are stable; each gets a CSS custom-property direction.
const BURST = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * 2 * Math.PI;
  const radius = 70 + (i % 3) * 22;
  return {
    dx: Math.round(Math.cos(angle) * radius),
    dy: Math.round(Math.sin(angle) * radius) - 30,
    dr: 120 + i * 40,
    color: ["#f5a623", "#ff9933", "#d4af37"][i % 3],
  };
});

const MAX_PUPIL_SHIFT = 3;

export function GaneshaScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [pupil, setPupil] = useState<PupilOffset>({ x: 0, y: 0 });
  const [blessing, setBlessing] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const reducedMotion = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function trackPointer(e: React.PointerEvent) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setPupil({
      x: Math.max(-1, Math.min(1, nx)) * MAX_PUPIL_SHIFT,
      y: Math.max(-1, Math.min(1, ny)) * MAX_PUPIL_SHIFT,
    });
  }

  function bless() {
    if (blessing) return;
    setBlessing(true);
    setBurstKey((k) => k + 1);
    timeoutRef.current = setTimeout(() => setBlessing(false), 1500);
  }

  return (
    <button
      ref={containerRef}
      type="button"
      aria-label="Tap Ganesha for a blessing"
      onPointerMove={trackPointer}
      onPointerLeave={() => setPupil({ x: 0, y: 0 })}
      onClick={bless}
      className={`relative block cursor-pointer select-none border-0 bg-transparent p-0 outline-offset-8 ${className ?? ""}`}
    >
      <GaneshaSvg
        pupilOffset={pupil}
        swaying={blessing && !reducedMotion}
        blessed={blessing}
        breathing
        className="h-auto w-full"
      />
      {blessing && !reducedMotion && (
        <span key={burstKey} aria-hidden="true">
          {BURST.map((p, i) => (
            <span
              key={i}
              className="burst-petal"
              style={{
                ["--dx" as string]: `${p.dx}px`,
                ["--dy" as string]: `${p.dy}px`,
                ["--dr" as string]: `${p.dr}deg`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16">
                <path d="M8 1 C12 4 13 9 8 15 C3 9 4 4 8 1 Z" fill={p.color} />
              </svg>
            </span>
          ))}
        </span>
      )}
      <span className="sr-only" aria-live="polite">
        {blessing ? "Ganesha blesses you!" : ""}
      </span>
    </button>
  );
}
