"use client";

import { useState } from "react";
import {
  useDonations,
  useUpdateDonation,
  type Donation,
} from "@/lib/api/donations";
import { useVolunteers } from "@/lib/api/users";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const FILTER_CLASS =
  "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-orange-500 focus:outline-none";

export function DonationsManager() {
  const [street, setStreet] = useState("");
  const [mode, setMode] = useState("");
  const [status, setStatus] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [date, setDate] = useState("");

  const params: Record<string, string> = {};
  if (street) params.street = street;
  if (mode) params.mode = mode;
  if (status) params.status = status;
  if (volunteerId) params.volunteerId = volunteerId;
  if (date) params.date = date;

  const donations = useDonations(params);
  const volunteers = useVolunteers();

  const hasFilters = Object.keys(params).length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Street…"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className={FILTER_CLASS}
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className={FILTER_CLASS}
        >
          <option value="">All modes</option>
          <option value="CASH">Cash</option>
          <option value="UPI">UPI</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={FILTER_CLASS}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}
          className={FILTER_CLASS}
        >
          <option value="">All volunteers</option>
          {(volunteers.data ?? []).map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={FILTER_CLASS}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setStreet("");
              setMode("");
              setStatus("");
              setVolunteerId("");
              setDate("");
            }}
            className="h-11 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 active:bg-gray-100"
          >
            Clear filters
          </button>
        )}
      </div>

      {donations.isPending ? (
        <p className="py-8 text-center text-gray-500">Loading donations…</p>
      ) : donations.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {donations.error.message}
        </p>
      ) : donations.data.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
          No donations match these filters.
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {donations.data.length} donation
            {donations.data.length === 1 ? "" : "s"} ·{" "}
            {rupees(donations.data.reduce((s, d) => s + d.amount, 0))}
          </p>
          <ul className="space-y-3">
            {donations.data.map((d) => (
              <DonationRow key={d.id} donation={d} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Donation["status"] }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-700",
    VERIFIED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  }[status];
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status.toLowerCase()}
    </span>
  );
}

function DonationRow({ donation: d }: { donation: Donation }) {
  const update = useUpdateDonation();

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(d.createdAt));

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {d.donorName}{" "}
            {d.anonymous && (
              <span className="text-xs font-normal text-gray-400">(anon)</span>
            )}
          </p>
          <p className="truncate text-xs text-gray-500">
            <span className="font-mono">{d.receiptNo}</span> · {d.street}
            {d.houseNo ? `, ${d.houseNo}` : ""} · {d.collectedBy?.name} ·{" "}
            {dateStr}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-bold">{rupees(d.amount)}</span>
            <span className="text-gray-500">{d.mode}</span>
            <StatusBadge status={d.status} />
            {d.mode === "CASH" && d.cashDeposited && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
                deposited
              </span>
            )}
          </p>
        </div>
        {d.screenshotUrl && (
          <a
            href={d.screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.screenshotUrl}
              alt={`Payment screenshot for ${d.receiptNo}`}
              className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
            />
          </a>
        )}
      </div>

      {(d.status === "PENDING" ||
        (d.mode === "CASH" && !d.cashDeposited)) && (
        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
          {d.status === "PENDING" && (
            <>
              <button
                type="button"
                disabled={update.isPending}
                onClick={() => update.mutate({ id: d.id, status: "VERIFIED" })}
                className="h-11 flex-1 rounded-lg bg-green-600 text-sm font-semibold text-white active:bg-green-700 disabled:opacity-60"
              >
                ✓ Verify
              </button>
              <button
                type="button"
                disabled={update.isPending}
                onClick={() => update.mutate({ id: d.id, status: "REJECTED" })}
                className="h-11 flex-1 rounded-lg border border-red-300 text-sm font-semibold text-red-700 active:bg-red-50 disabled:opacity-60"
              >
                ✕ Reject
              </button>
            </>
          )}
          {d.mode === "CASH" && !d.cashDeposited && (
            <button
              type="button"
              disabled={update.isPending}
              onClick={() => update.mutate({ id: d.id, cashDeposited: true })}
              className="h-11 flex-1 rounded-lg border border-blue-300 text-sm font-semibold text-blue-700 active:bg-blue-50 disabled:opacity-60"
            >
              💰 Mark deposited
            </button>
          )}
        </div>
      )}
      {update.isError && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {update.error.message}
        </p>
      )}
    </li>
  );
}
