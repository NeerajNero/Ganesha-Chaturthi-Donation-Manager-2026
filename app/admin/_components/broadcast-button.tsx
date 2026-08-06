"use client";

import { useState } from "react";
import { useStats } from "@/lib/api/stats";
import { useSendSummary } from "@/lib/api/broadcast";
import { formatSummaryMessage } from "@/lib/summary";

export function BroadcastButton() {
  const { data } = useStats();
  const send = useSendSummary();
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<
    { kind: "success" | "error"; text: string } | null
  >(null);

  if (!data) return null;

  const preview = formatSummaryMessage({
    collected: data.totalCollected,
    donationCount: data.donationCount,
    spent: data.totalExpenses,
    balance: data.balance,
    pendingUpi: data.pendingUpi.amount,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
  });

  function doSend() {
    send.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        setResult({ kind: "success", text: "Summary sent to Telegram ✓" });
      },
      onError: (err) => {
        setOpen(false);
        setResult({ kind: "error", text: err.message });
      },
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setResult(null);
          setOpen(true);
        }}
        className="h-12 w-full rounded-xl bg-maroon text-base font-semibold text-cream active:bg-maroon/90"
      >
        📢 Send summary to Telegram
      </button>

      {result && (
        <p
          className={`mt-2 rounded-lg px-3 py-2 text-sm ${
            result.kind === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {result.text}
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Telegram summary"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-bold">Send this to the channel?</h2>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-cream p-4 font-sans text-sm leading-relaxed ring-1 ring-gold/40">
              {preview}
            </pre>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={doSend}
                disabled={send.isPending}
                className="h-12 flex-1 rounded-lg bg-maroon text-sm font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
              >
                {send.isPending ? "Sending…" : "Send"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-700 active:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
