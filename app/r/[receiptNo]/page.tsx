import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReceipt } from "@/lib/public-data";
import { amountInWords } from "@/lib/receipt";
import { COMMITTEE_NAME } from "@/lib/config";
import { GaneshaSvg } from "@/components/ganesha-svg";
import { ShareReceipt } from "@/components/share-receipt";
import { LightDiya } from "@/components/light-diya";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Donation Receipt — ${COMMITTEE_NAME}`,
};

// Pure Server Component — no client components, CSS only, fast on cheap
// phones. The Ganesha here is the static SVG (no animation classes).
export default async function ReceiptPage({
  params,
}: PageProps<"/r/[receiptNo]">) {
  const { receiptNo } = await params;
  const receipt = await getReceipt(receiptNo);
  if (!receipt) notFound();

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(receipt.createdAt);

  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-maroon via-[#93313b] to-saffron px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-maroon px-6 pb-4 pt-5 text-center text-cream">
            <p className="font-display text-xs tracking-widest text-gold">
              ॥ श्री गणेशाय नमः ॥
            </p>
            <h1 className="font-display mt-1 text-xl leading-tight">
              {COMMITTEE_NAME}
            </h1>
          </div>
          <div className="garland" />

          <div className="relative px-6 py-5">
            {/* static Ganesha watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
              <GaneshaSvg className="h-56 w-56" />
            </div>

            <div className="relative">
              <div className="flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-wide text-ink/50">
                  Donation receipt
                </p>
                <p className="font-mono text-sm font-bold text-maroon">
                  {receipt.receiptNo}
                </p>
              </div>

              <div className="my-4 border-t border-dashed border-gold/60" />

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Received from</dt>
                  <dd className="text-right font-semibold">
                    {receipt.donorName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Date</dt>
                  <dd className="text-right">{dateStr}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Mode</dt>
                  <dd className="text-right">
                    {receipt.mode}
                    {receipt.status === "PENDING" && (
                      <span className="ml-1 rounded bg-marigold/20 px-1.5 py-0.5 text-xs font-medium text-maroon">
                        verification pending
                      </span>
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-2xl bg-cream px-4 py-4 text-center ring-1 ring-gold/40">
                <p className="font-display text-3xl text-maroon">
                  ₹{receipt.amount.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-xs italic text-ink/60">
                  {amountInWords(receipt.amount)}
                </p>
              </div>

              <p className="mt-5 text-center text-sm text-ink/70">
                🙏 Thank you for your generous contribution!
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-dashed border-gold/60 px-6 py-4 text-center">
            <LightDiya
              receiptNo={receipt.receiptNo}
              initialLit={receipt.diyaLit}
            />
            <ShareReceipt
              receiptNo={receipt.receiptNo}
              amount={receipt.amount}
              committeeName={COMMITTEE_NAME}
              url={`${process.env.NEXT_PUBLIC_APP_URL || ""}/r/${receipt.receiptNo}`}
            />
            <Link
              href="/wall"
              className="block text-sm font-semibold text-maroon underline underline-offset-2"
            >
              See all donations on our transparency wall →
            </Link>
          </div>
        </div>

        <p className="font-display mt-4 text-center text-xs text-cream/90">
          ॥ गणपति बाप्पा मोरया ॥
        </p>
      </div>
    </main>
  );
}
