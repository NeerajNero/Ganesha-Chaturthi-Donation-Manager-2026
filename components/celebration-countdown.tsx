"use client";

import { useEffect, useState } from "react";
import { FESTIVAL_START } from "@/lib/config";

// Celebration day boundaries in IST, derived from config.
const DAY_START = new Date(`${FESTIVAL_START}T00:00:00+05:30`).getTime();
const DAY_END = DAY_START + 24 * 60 * 60 * 1000;

const DATE_LABEL = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
}).format(new Date(DAY_START));

const pad = (n: number) => String(n).padStart(2, "0");

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="w-16 rounded-2xl bg-cream/95 py-2.5 shadow-inner ring-1 ring-gold/50 sm:w-[4.5rem]">
      {/* key retriggers the pop animation whenever the digits change */}
      <span
        key={value}
        className="tick-pop block font-display text-3xl leading-none text-maroon tabular-nums sm:text-4xl"
      >
        {value}
      </span>
      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-maroon/60">
        {label}
      </span>
    </div>
  );
}

// Ticks every second; renders nothing until mounted (avoids hydration
// mismatch), switches to a festive banner on the day itself, and disappears
// once the celebration is over.
export function CelebrationCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (now === null || now >= DAY_END) return null;

  if (now >= DAY_START) {
    return (
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-marigold via-gold to-marigold p-5 text-center shadow-lg ring-1 ring-gold/60">
        <div className="countdown-shine" aria-hidden />
        <p className="font-display text-2xl text-maroon">
          🎉 आज का शुभ दिन — it&apos;s celebration day! 🎉
        </p>
        <p className="mt-1 text-sm font-semibold text-maroon/80">
          गणपति बाप्पा मोरया 🙏
        </p>
      </section>
    );
  }

  const s = Math.floor((DAY_START - now) / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  return (
    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-maroon via-[#5a121a] to-maroon p-5 text-center shadow-lg ring-1 ring-gold/60">
      <div className="countdown-shine" aria-hidden />
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
        ✨ The grand celebration ✨
      </p>
      <p className="font-display mt-1 text-xl text-cream">
        Bappa arrives in
      </p>
      <div className="mt-4 flex items-center justify-center gap-1.5 sm:gap-2">
        <Tile value={pad(days)} label="Days" />
        <span className="pb-4 font-display text-2xl text-gold/80">:</span>
        <Tile value={pad(hours)} label="Hours" />
        <span className="pb-4 font-display text-2xl text-gold/80">:</span>
        <Tile value={pad(mins)} label="Mins" />
        <span className="pb-4 font-display text-2xl text-gold/80">:</span>
        <Tile value={pad(secs)} label="Secs" />
      </div>
      <p className="mt-4 text-xs font-medium text-cream/75">
        🪔 {DATE_LABEL} · save the date
      </p>
    </section>
  );
}
