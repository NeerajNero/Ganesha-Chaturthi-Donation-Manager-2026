"use client";

import { useState } from "react";
import Link from "next/link";
import { Diya } from "./diya";

// On the receipt page: lets the donor light a diya that appears on /wall.
export function LightDiya({
  receiptNo,
  initialLit,
}: {
  receiptNo: string;
  initialLit: boolean;
}) {
  const [lit, setLit] = useState(initialLit);
  const [pending, setPending] = useState(false);

  async function light() {
    setPending(true);
    try {
      const res = await fetch(`/api/receipts/${receiptNo}/diya`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.ok) setLit(true);
    } catch {
      // leave button available to retry
    } finally {
      setPending(false);
    }
  }

  if (lit) {
    return (
      <div className="rounded-xl bg-cream px-4 py-3 text-center ring-1 ring-gold/40">
        <p className="flex items-center justify-center gap-2 text-sm font-semibold text-maroon">
          <Diya size={22} /> Your diya is glowing on our wall
        </p>
        <Link
          href="/wall"
          className="text-xs font-medium text-maroon underline underline-offset-2"
        >
          See it →
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={light}
      disabled={pending}
      className="h-12 w-full rounded-xl border-2 border-gold bg-cream text-sm font-semibold text-maroon active:bg-gold/10 disabled:opacity-60"
    >
      {pending ? "Lighting…" : "🪔 Light a diya on our wall"}
    </button>
  );
}
