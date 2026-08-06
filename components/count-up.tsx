"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Animates 0 → value once on mount; shows the final value directly under
// prefers-reduced-motion.
export function CountUp({
  value,
  prefix = "₹",
  className,
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reducedMotion]);

  const display = reducedMotion ? value : animated;

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString("en-IN")}
    </span>
  );
}
