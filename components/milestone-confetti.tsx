"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const COLORS = ["#f5a623", "#d4af37", "#7b1e26", "#ff9933", "#6b8e23"];

type Piece = {
  id: number;
  color: string;
  cx: number;
  dx: number;
  dr: number;
  delay: number;
};

export function MilestoneConfetti({ active }: { active: boolean }) {
  const prefersReduced = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!active || played || prefersReduced) return;
    const newPieces: Piece[] = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      cx: (Math.random() - 0.5) * 200,
      dx: (Math.random() - 0.5) * 80,
      dr: Math.random() * 720 - 360,
      delay: Math.random() * 0.5,
    }));
    setPieces(newPieces);
    setPlayed(true);
    // Clean up after animation finishes.
    const t = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(t);
  }, [active, played, prefersReduced]);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            backgroundColor: p.color,
            "--cx": `${p.cx}px`,
            "--dx": `${p.dx}px`,
            "--dr": `${p.dr}deg`,
            "--cd": `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
