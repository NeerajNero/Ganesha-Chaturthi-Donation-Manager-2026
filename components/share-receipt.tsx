"use client";

import { useState } from "react";

// Web Share API with clipboard fallback. The receipt page stays readable
// without JS — this button just won't do anything until hydration.
export function ShareReceipt({
  receiptNo,
  amount,
  committeeName,
  url,
}: {
  receiptNo: string;
  amount: number;
  committeeName: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `🙏 Donation receipt ${receiptNo} — ₹${amount.toLocaleString("en-IN")} to ${committeeName}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // clipboard unavailable — ignore
      }
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="h-12 w-full rounded-xl bg-maroon text-sm font-semibold text-cream active:bg-maroon/90"
    >
      {copied ? "✓ Link copied!" : "📤 Share this receipt"}
    </button>
  );
}
