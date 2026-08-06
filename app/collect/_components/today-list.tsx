"use client";

import { useDonations, todayIST } from "@/lib/api/donations";
import { ListSkeleton } from "@/components/skeleton";

export function TodayList() {
  const { data, isPending, isError } = useDonations({ date: todayIST() });

  if (isPending) {
    return <ListSkeleton rows={3} rowClassName="h-16" />;
  }
  if (isError) {
    return (
      <p className="py-4 text-center text-sm text-red-600">
        Could not load today’s collections
      </p>
    );
  }

  const counted = data.filter((d) => d.status !== "REJECTED");
  const total = counted.reduce((sum, d) => sum + d.amount, 0);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-bold">My collections today</h2>
        <p className="text-lg font-bold text-orange-700">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      {data.length === 0 ? (
        <p className="rounded-2xl bg-white py-6 text-center text-sm text-gray-500 shadow-sm">
          Nothing collected yet — record your first donation above 🙏
        </p>
      ) : (
        <ul className="space-y-2">
          {data.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{d.donorName}</p>
                <p className="truncate text-xs text-gray-500">
                  <span className="font-mono">{d.receiptNo}</span> · {d.street}
                  {d.houseNo ? `, ${d.houseNo}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold">₹{d.amount.toLocaleString("en-IN")}</p>
                <p
                  className={`text-xs font-medium ${
                    d.status === "PENDING"
                      ? "text-amber-600"
                      : d.status === "REJECTED"
                        ? "text-red-600"
                        : "text-green-600"
                  }`}
                >
                  {d.mode}
                  {d.status === "PENDING" && " · pending"}
                  {d.status === "REJECTED" && " · rejected"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
