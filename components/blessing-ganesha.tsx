"use client";

import { useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import { GaneshaSvg } from "./ganesha-svg";

// Interactive Ganesha + global blessings counter (Counter row "blessings").
const GaneshaScene = nextDynamic(
  () => import("./ganesha-scene").then((m) => m.GaneshaScene),
  { loading: () => <GaneshaSvg className="h-auto w-full" /> }
);

export function BlessingGanesha() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blessings")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.ok) setCount(json.data.value);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function recordBlessing() {
    setCount((c) => (c ?? 0) + 1); // optimistic
    fetch("/api/blessings", { method: "POST" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setCount(json.data.value);
      })
      .catch(() => {});
  }

  return (
    <>
      <GaneshaScene onBless={recordBlessing} />
      {count !== null && count > 0 && (
        <p className="mt-1 text-sm font-semibold text-maroon">
          🙏 {count.toLocaleString("en-IN")} blessing{count === 1 ? "" : "s"} taken
        </p>
      )}
    </>
  );
}
