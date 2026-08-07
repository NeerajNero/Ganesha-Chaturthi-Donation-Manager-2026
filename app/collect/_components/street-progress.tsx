"use client";

import { useState } from "react";
import { useStreetProgress } from "@/lib/api/donations";

// Coverage across ALL volunteers — helps decide which street to canvass next.
export function StreetProgress() {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useStreetProgress();

  if (isPending || !data || data.length === 0) return null;

  const shown = open ? data : data.slice(0, 5);

  return (
    <section>
      <h2 className="mb-3 text-base font-bold">Street coverage (all volunteers)</h2>
      <ul className="space-y-1.5">
        {shown.map((s) => (
          <li
            key={s.street}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-2.5 shadow-sm"
          >
            <p className="min-w-0 truncate text-sm font-medium">{s.street}</p>
            <p className="shrink-0 text-sm text-gray-600">
              {s.count} house{s.count === 1 ? "" : "s"} ·{" "}
              <span className="font-bold text-maroon">
                ₹{s.total.toLocaleString("en-IN")}
              </span>
            </p>
          </li>
        ))}
      </ul>
      {data.length > 5 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="mt-2 h-11 w-full rounded-xl border border-gray-300 text-sm font-medium text-gray-700 active:bg-gray-100"
        >
          {open ? "Show less" : `Show all ${data.length} streets`}
        </button>
      )}
    </section>
  );
}
