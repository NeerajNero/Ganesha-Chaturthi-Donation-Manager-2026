"use client";

import { useStats } from "@/lib/api/stats";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function Dashboard() {
  const { data, isPending, isError, error } = useStats();

  if (isPending) {
    return <p className="py-8 text-center text-gray-500">Loading stats…</p>;
  }
  if (isError) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error.message}
      </p>
    );
  }

  const cards = [
    { label: "Total collected", value: rupees(data.totalCollected), sub: `Cash ${rupees(data.byMode.CASH)} · UPI ${rupees(data.byMode.UPI)}` },
    { label: "Today", value: rupees(data.todayCollected) },
    { label: "Cash in hand", value: rupees(data.cashInHand), sub: "collected, not yet deposited" },
    { label: "Pending UPI", value: String(data.pendingUpi.count), sub: `worth ${rupees(data.pendingUpi.amount)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {c.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-orange-700">
              {c.value}
            </p>
            {c.sub && <p className="mt-1 text-xs text-gray-500">{c.sub}</p>}
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-bold">By street</h2>
        {data.byStreet.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-2">Street</th>
                  <th className="py-2 pr-2 text-right">Donations</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.byStreet.map((s) => (
                  <tr key={s.street} className="border-b border-gray-100">
                    <td className="py-2.5 pr-2 font-medium">{s.street}</td>
                    <td className="py-2.5 pr-2 text-right">{s.count}</td>
                    <td className="py-2.5 text-right font-semibold">
                      {rupees(s.total)}
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
    </div>
  );
}
