"use client";

import { useState } from "react";
import {
  useDeleteExpense,
  useExpenses,
  type Expense,
} from "@/lib/api/expenses";
import { ExpenseForm } from "./expense-form";
import { ListSkeleton } from "@/components/skeleton";

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const FILTER_CLASS =
  "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-saffron focus:outline-none";

const SIZE_BADGE: Record<Expense["size"], string> = {
  MINOR: "bg-gray-100 text-gray-600",
  MID: "bg-marigold/20 text-maroon",
  MAJOR: "bg-maroon/10 text-maroon",
};

export function ExpenseList() {
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const params: Record<string, string> = {};
  if (size) params.size = size;
  if (category) params.category = category;
  if (date) params.date = date;

  const expenses = useExpenses(params);
  const hasFilters = Object.keys(params).length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={FILTER_CLASS}
        >
          <option value="">All sizes</option>
          <option value="MINOR">Minor</option>
          <option value="MID">Mid</option>
          <option value="MAJOR">Major</option>
        </select>
        <input
          type="text"
          placeholder="Category…"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={FILTER_CLASS}
        />
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
              setSize("");
              setCategory("");
              setDate("");
            }}
            className="h-11 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 active:bg-gray-100"
          >
            Clear filters
          </button>
        )}
      </div>

      {expenses.isPending ? (
        <ListSkeleton rows={3} rowClassName="h-28" />
      ) : expenses.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {expenses.error.message}
        </p>
      ) : expenses.data.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
          No expenses recorded{hasFilters ? " for these filters" : " yet"}.
        </p>
      ) : (
        <>
          <p className="rounded-xl bg-maroon px-4 py-2.5 text-sm font-semibold text-cream">
            {expenses.data.length} expense
            {expenses.data.length === 1 ? "" : "s"} · total{" "}
            {rupees(expenses.data.reduce((s, e) => s + e.amount, 0))}
          </p>
          <ul className="space-y-3">
            {expenses.data.map((e) => (
              <ExpenseRow key={e.id} expense={e} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ExpenseRow({ expense: e }: { expense: Expense }) {
  const [editing, setEditing] = useState(false);
  const del = useDeleteExpense();

  if (editing) {
    return (
      <li>
        <ExpenseForm initial={e} onDone={() => setEditing(false)} />
      </li>
    );
  }

  const dateStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(e.spentOn));

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">{e.title}</p>
          <p className="truncate text-xs text-gray-500">
            {e.category} · {dateStr} · by {e.addedBy?.name}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm">
            <span className="font-bold text-maroon">{rupees(e.amount)}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-semibold ${SIZE_BADGE[e.size]}`}
            >
              {e.size.toLowerCase()}
            </span>
          </p>
          {e.notes && <p className="mt-1 text-xs text-gray-500">{e.notes}</p>}
        </div>
        {e.receiptUrl && (
          <a
            href={e.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={e.receiptUrl}
              alt={`Bill for ${e.title}`}
              className="h-14 w-14 rounded-lg border border-gray-200 object-cover"
            />
          </a>
        )}
      </div>

      <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 active:bg-gray-100"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={del.isPending}
          onClick={() => {
            if (window.confirm(`Delete "${e.title}" (${rupees(e.amount)})?`)) {
              del.mutate(e.id);
            }
          }}
          className="h-11 rounded-lg border border-red-300 px-4 text-sm font-medium text-red-700 active:bg-red-50 disabled:opacity-60"
        >
          {del.isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
