"use client";

import { useStats } from "@/lib/api/stats";
import { BroadcastButton } from "./broadcast-button";
import { Skeleton } from "@/components/skeleton";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function Dashboard() {
  const { data, isPending, isError, error } = useStats();

  if (isPending) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }
  if (isError) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error.message}
      </p>
    );
  }

  const cards: {
    label: string;
    value: string;
    sub?: string;
    valueClass?: string;
  }[] = [
    { label: "Total collected", value: rupees(data.totalCollected), sub: `Cash ${rupees(data.byMode.CASH)} · UPI ${rupees(data.byMode.UPI)}` },
    { label: "Today", value: rupees(data.todayCollected) },
    { label: "Cash in hand", value: rupees(data.cashInHand), sub: "collected, not yet deposited" },
    { label: "Pending UPI", value: String(data.pendingUpi.count), sub: `worth ${rupees(data.pendingUpi.amount)}` },
    { label: "Total spent", value: rupees(data.totalExpenses), sub: `${data.expensesByCategory.length} categor${data.expensesByCategory.length === 1 ? "y" : "ies"}` },
    {
      label: "Balance",
      value: rupees(data.balance),
      sub: "collected − spent",
      valueClass: data.balance >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      label: "Blessings taken",
      value: `🙏 ${data.blessings.toLocaleString("en-IN")}`,
      sub: "taps on Bappa, running total",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {c.label}
            </p>
            <p
              className={`mt-1 text-2xl font-extrabold ${
                c.valueClass ?? "text-maroon"
              }`}
            >
              {c.value}
            </p>
            {c.sub && <p className="mt-1 text-xs text-gray-500">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold">Last 10 days</h2>
        <DailyChart daily={data.daily} />
        <PaceCard daily={data.daily} totalCollected={data.totalCollected} goal={400_000} />
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold">Top donors</h2>
        {data.byDonor.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-2">Donor</th>
                  <th className="py-2 pr-2 text-right">Donations</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.byDonor.map((d) => (
                  <tr key={d.donorName} className="border-b border-gray-100">
                    <td className="py-2.5 pr-2 font-medium">{d.donorName}</td>
                    <td className="py-2.5 pr-2 text-right">{d.count}</td>
                    <td className="py-2.5 text-right font-semibold">
                      {rupees(d.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold">By volunteer</h2>
        {data.byVolunteer.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-2">Volunteer</th>
                  <th className="py-2 pr-2 text-right">Donations</th>
                  <th className="py-2 pr-2 text-right">Total</th>
                  <th className="py-2 text-right">Cash in hand</th>
                </tr>
              </thead>
              <tbody>
                {data.byVolunteer.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100">
                    <td className="py-2.5 pr-2 font-medium">{v.name}</td>
                    <td className="py-2.5 pr-2 text-right">{v.count}</td>
                    <td className="py-2.5 pr-2 text-right font-semibold">
                      {rupees(v.total)}
                    </td>
                    <td
                      className={`py-2.5 text-right font-semibold ${
                        v.cashInHand > 0 ? "text-amber-600" : "text-green-600"
                      }`}
                    >
                      {rupees(v.cashInHand)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <BroadcastButton />
    </div>
  );
}

function DailyChart({ daily }: { daily: { date: string; total: number }[] }) {
  const max = Math.max(...daily.map((d) => d.total), 1);
  const short = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(n);

  return (
    <div className="flex h-36 items-end gap-1.5">
      {daily.map((d) => (
        <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-semibold text-maroon">
            {d.total > 0 ? short(d.total) : ""}
          </span>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-marigold to-gold"
            style={{
              height: `${Math.max(d.total > 0 ? 6 : 2, Math.round((d.total / max) * 88))}px`,
            }}
          />
          <span className="text-[10px] text-gray-500">{d.date.slice(8)}</span>
        </div>
      ))}
    </div>
  );
}

function PaceCard({
  daily,
  totalCollected,
  goal,
}: {
  daily: { date: string; total: number }[];
  totalCollected: number;
  goal: number;
}) {
  const remaining = Math.max(0, goal - totalCollected);
  if (remaining === 0) {
    return (
      <p className="mt-3 text-center text-sm font-semibold text-green-600">
        🎊 Goal achieved! Ganpati Bappa Morya!
      </p>
    );
  }

  // 7-day average from the last 7 entries.
  const last7 = daily.slice(-7);
  const avg7 = last7.reduce((s, d) => s + d.total, 0) / Math.max(last7.length, 1);

  if (avg7 <= 0) {
    return (
      <p className="mt-3 text-center text-xs text-gray-400">
        No recent collections to project pace.
      </p>
    );
  }

  const daysLeft = Math.ceil(remaining / avg7);
  const onTrack = daysLeft <= 30; // arbitrary "on track" threshold

  return (
    <div className={`mt-4 rounded-xl px-4 py-3 text-center ${onTrack ? "bg-green-50" : "bg-amber-50"}`}>
      <p className={`text-sm font-semibold ${onTrack ? "text-green-700" : "text-amber-700"}`}>
        {onTrack ? "📈 On track 🎯" : "⚠️ Behind pace"}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">
        7-day avg ₹{Math.round(avg7).toLocaleString("en-IN")}/day ·{" "}
        goal in ~{daysLeft} day{daysLeft === 1 ? "" : "s"} at this pace
      </p>
    </div>
  );
}
