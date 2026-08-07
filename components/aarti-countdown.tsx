"use client";

import { useEffect, useState } from "react";
import { nextAarti } from "@/lib/aarti";

function formatRemaining(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

// Ticks every second; renders nothing until mounted (avoids hydration
// mismatch) and nothing once the festival is over.
export function AartiCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const timer = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  if (!now) return null;
  const next = nextAarti(now);
  if (!next) return null;

  const whenStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(next.at);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-marigold via-gold to-marigold px-4 py-3 text-center shadow">
      <p className="text-xs font-semibold uppercase tracking-wide text-maroon/80">
        ⏳ Next: {next.label}
      </p>
      <p className="font-display text-2xl text-maroon tabular-nums">
        {formatRemaining(next.at.getTime() - now.getTime())}
      </p>
      <p className="text-xs text-maroon/70">{whenStr} IST</p>
    </div>
  );
}
