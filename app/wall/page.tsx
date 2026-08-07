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
  const { grandTotal, totalSpent, balance, donations, expenses, topCollectors } =
    await getWallData();
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

        {topCollectors.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display mb-3 text-center text-xl text-maroon">
              🏆 Top collectors
            </h2>
            <ul className="space-y-2">
              {topCollectors.map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gold/25 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-xl">
                      {["🥇", "🥈", "🥉"][i] ?? "🎖️"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{c.name}</p>
                      <p className="text-xs text-ink/50">
                        {c.count} donation{c.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-bold text-maroon">
                    ₹{c.total.toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-display mb-3 text-center text-xl text-maroon">
            💸 Where the money went
          </h2>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-gold/25 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Total spent
              </p>
              <p className="font-display mt-0.5 text-lg text-maroon">
                ₹{totalSpent.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl border border-gold/25 bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Balance
              </p>
              <p
                className={`font-display mt-0.5 text-lg ${
                  balance >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          {expenses.length === 0 ? (
            <p className="rounded-2xl bg-white/90 py-5 text-center text-sm text-ink/60 shadow">
              Expenses will be listed here as the festival preparations begin.
            </p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gold/25 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{e.title}</p>
                    <p className="truncate text-xs text-ink/50">
                      {e.category} · {dateFmt.format(e.spentOn)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.receiptUrl && (
                      <a
                        href={e.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={e.receiptUrl}
                          alt={`Bill for ${e.title}`}
                          className="h-10 w-10 rounded-lg border border-gold/30 object-cover"
                        />
                      </a>
                    )}
                    <p className="font-bold text-maroon">
                      ₹{e.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
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
