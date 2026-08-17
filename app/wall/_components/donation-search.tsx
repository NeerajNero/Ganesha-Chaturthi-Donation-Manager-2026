"use client";

import { useState } from "react";
import { Diya } from "@/components/diya";
import { PATRON_THRESHOLD } from "@/lib/config";

type Donation = {
  id: string;
  name: string;
  amount: number;
  street: string;
  createdAt: Date;
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function DonationSearch({ donations }: { donations: Donation[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  const results = query.trim()
    ? donations.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.street.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="mt-5">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto flex items-center gap-1.5 rounded-full border border-gold/40 bg-white px-4 py-2 text-sm font-medium text-ink/70 shadow-sm transition-all hover:border-gold hover:text-maroon"
        >
          🔍 Find my donation
        </button>
      ) : (
        <div className="rounded-2xl border border-gold/30 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <input
              type="search"
              autoFocus
              placeholder="Search by name or street…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-xl border border-gold/30 bg-cream px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="rounded-xl px-3 py-2.5 text-sm text-ink/50 hover:text-ink"
            >
              ✕
            </button>
          </div>

          {query.trim() && (
            <div className="mt-3">
              {results.length === 0 ? (
                <p className="py-4 text-center text-sm text-ink/50">
                  No matching donations found.
                </p>
              ) : (
                <ul className="space-y-2">
                  {results.map((d) => {
                    const patron = d.amount >= PATRON_THRESHOLD;
                    return (
                      <li
                        key={d.id}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                          patron
                            ? "border-gold bg-gradient-to-r from-gold/20 to-white"
                            : "border-gold/25 bg-cream/50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <Diya size={20} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-sm">
                              {d.name}
                              {patron && (
                                <span className="ml-1.5 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-bold text-maroon align-middle">
                                  🌟 PATRON
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-ink/50">
                              {d.street} · {dateFmt.format(new Date(d.createdAt))}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 font-bold text-maroon text-sm">
                          {rupees(d.amount)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
