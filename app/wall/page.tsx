import type { Metadata } from "next";
import Link from "next/link";
import { getWallData } from "@/lib/public-data";
import { COMMITTEE_NAME, GOAL_AMOUNT } from "@/lib/config";
import { CountUp } from "@/components/count-up";
import { Diya } from "@/components/diya";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Donation Wall — ${COMMITTEE_NAME}`,
};

export default async function WallPage() {
  const { grandTotal, donations } = await getWallData();
  const progress = Math.min(100, Math.round((grandTotal / GOAL_AMOUNT) * 100));

  const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <main className="flex-1 bg-cream">
      <header className="bg-maroon pb-5 pt-6 text-center text-cream">
        <p className="font-display text-xs text-gold">॥ श्री गणेशाय नमः ॥</p>
        <h1 className="font-display mt-1 px-4 text-2xl">{COMMITTEE_NAME}</h1>
        <p className="text-sm text-cream/80">Donation transparency wall</p>
      </header>
      <div className="garland" />

      <div className="mx-auto w-full max-w-lg px-4 pb-10">
        <section className="mt-5 rounded-3xl border border-gold/40 bg-white p-6 text-center shadow-lg">
          <p className="text-xs uppercase tracking-widest text-ink/60">
            Collected so far
          </p>
          <CountUp
            value={grandTotal}
            className="font-display mt-1 block text-4xl text-maroon"
          />
          <p className="mt-1 text-sm text-ink/60">
            of ₹{GOAL_AMOUNT.toLocaleString("en-IN")} goal
          </p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-cream ring-1 ring-gold/40">
            <div
              className="h-full rounded-full bg-gradient-to-r from-marigold to-gold"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-ink/80">
            {progress}% of goal
          </p>
        </section>

        <section className="mt-7">
          <h2 className="font-display mb-3 text-center text-xl text-maroon">
            🙏 Recent donors
          </h2>
          {donations.length === 0 ? (
            <p className="rounded-2xl bg-white py-6 text-center text-sm text-ink/60 shadow">
              Donations will appear here once verified.
            </p>
          ) : (
            <ul className="space-y-2">
              {donations.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gold/25 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Diya size={22} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{d.name}</p>
                      <p className="truncate text-xs text-ink/50">
                        {d.street} · {dateFmt.format(d.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-bold text-maroon">
                    ₹{d.amount.toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-8 space-y-2 text-center">
          <p className="font-display text-sm text-maroon/80">
            ॥ गणपति बाप्पा मोरया ॥
          </p>
          <Link
            href="/"
            className="text-xs text-ink/40 underline underline-offset-2"
          >
            ← Back to home
          </Link>
        </footer>
      </div>
    </main>
  );
}
