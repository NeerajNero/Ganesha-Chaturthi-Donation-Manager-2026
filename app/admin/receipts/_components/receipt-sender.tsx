"use client";

import { useState, useMemo } from "react";
import { useDonations } from "@/lib/api/donations";
import { ListSkeleton } from "@/components/skeleton";
import { COMMITTEE_NAME } from "@/lib/config";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ReceiptSender() {
  const [query, setQuery] = useState("");
  const donations = useDonations({ status: "VERIFIED" });
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!donations.data) return [];
    const q = query.toLowerCase().trim();
    if (!q) return donations.data;
    return donations.data.filter(
      (d) =>
        d.donorName.toLowerCase().includes(q) ||
        d.receiptNo.toLowerCase().includes(q) ||
        (d.mobile ?? "").includes(q) ||
        d.street.toLowerCase().includes(q)
    );
  }, [donations.data, query]);

  async function copyLink(receiptNo: string) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/r/${receiptNo}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(receiptNo);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search by name, receipt no, mobile, or street…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
      />

      {donations.isPending ? (
        <ListSkeleton rows={5} rowClassName="h-20" />
      ) : donations.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {donations.error.message}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
          {query ? "No donors match your search." : "No verified donations yet."}
        </p>
      ) : (
        <>
          <p className="text-xs text-gray-500">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {query && ` for "${query}"`}
          </p>
          <ul className="space-y-2">
            {filtered.map((d) => {
              const receiptUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/r/${d.receiptNo}`;
              const waText = encodeURIComponent(
                `🙏 Namaste ${d.donorName}! Your donation receipt for ₹${d.amount.toLocaleString("en-IN")} to ${COMMITTEE_NAME} is ready.\n\nReceipt No: ${d.receiptNo}\nView & share: ${receiptUrl}\n\nGanpati Bappa Morya! 🎉`
              );
              return (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {d.donorName}
                      {d.anonymous && (
                        <span className="ml-1 text-xs font-normal text-gray-400">(anon)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      <span className="font-mono">{d.receiptNo}</span> ·{" "}
                      {rupees(d.amount)} · {d.street}
                    </p>
                    {d.mobile && (
                      <p className="text-xs text-gray-400">📞 {d.mobile}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {d.mobile ? (
                      <a
                        href={`https://wa.me/91${d.mobile}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 items-center gap-1.5 rounded-lg bg-green-500 px-3 text-sm font-semibold text-white"
                      >
                        📲 WhatsApp
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => copyLink(d.receiptNo)}
                        className="flex h-10 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 active:bg-gray-50"
                      >
                        {copied === d.receiptNo ? "✓ Copied!" : "📋 Copy link"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
