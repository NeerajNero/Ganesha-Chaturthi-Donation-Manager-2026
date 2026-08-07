"use client";

import { useState } from "react";
import {
  useCreateExpense,
  useUpdateExpense,
  useExpenseCategories,
  type Expense,
  type ExpenseSize,
} from "@/lib/api/expenses";
import { ScreenshotUpload } from "@/components/screenshot-upload";
import { FestiveSpinner } from "@/components/festive-spinner";

const INPUT_CLASS =
  "block h-12 w-full rounded-lg border border-gray-300 px-3 text-base focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-gray-700";
const SIZES: { value: ExpenseSize; label: string }[] = [
  { value: "MINOR", label: "Minor" },
  { value: "MID", label: "Mid" },
  { value: "MAJOR", label: "Major" },
];

function toISTDateString(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date(iso)
  );
}

// Create form when `initial` is absent; edit form (with Cancel) when present.
export function ExpenseForm({
  initial,
  onDone,
}: {
  initial?: Expense;
  onDone?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [size, setSize] = useState<ExpenseSize>(initial?.size ?? "MINOR");
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : ""
  );
  const [spentOn, setSpentOn] = useState(
    initial ? toISTDateString(initial.spentOn) : ""
  );
  const [receiptUrl, setReceiptUrl] = useState<string | null>(
    initial?.receiptUrl ?? null
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const categories = useExpenseCategories();
  const create = useCreateExpense();
  const update = useUpdateExpense();
  const mutation = initial ? update : create;

  const amountNum = parseInt(amount, 10);
  const amountValid =
    Number.isInteger(amountNum) && amountNum >= 1 && amountNum <= 1_000_000;

  function submit() {
    if (!amountValid) return;
    const body = {
      title: title.trim(),
      category: category.trim(),
      size,
      amount: amountNum,
      receiptUrl: receiptUrl ?? undefined,
      notes: notes.trim() || undefined,
      spentOn: spentOn || undefined,
    };
    if (initial) {
      update.mutate({ id: initial.id, ...body }, { onSuccess: onDone });
    } else {
      create.mutate(body, {
        onSuccess: () => {
          setTitle("");
          setCategory("");
          setSize("MINOR");
          setAmount("");
          setSpentOn("");
          setReceiptUrl(null);
          setNotes("");
          onDone?.();
        },
      });
    }
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-gold/30 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <h2 className="text-base font-bold">
        {initial ? `Edit expense` : "Add expense"}
      </h2>

      <div>
        <label htmlFor={`title-${initial?.id ?? "new"}`} className={LABEL_CLASS}>
          Title *
        </label>
        <input
          id={`title-${initial?.id ?? "new"}`}
          type="text"
          required
          minLength={2}
          maxLength={100}
          placeholder="e.g. Marigold flowers - day 1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`amount-${initial?.id ?? "new"}`}
            className={LABEL_CLASS}
          >
            Amount (₹) *
          </label>
          <input
            id={`amount-${initial?.id ?? "new"}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label
            htmlFor={`spentOn-${initial?.id ?? "new"}`}
            className={LABEL_CLASS}
          >
            Spent on
          </label>
          <input
            id={`spentOn-${initial?.id ?? "new"}`}
            type="date"
            value={spentOn}
            onChange={(e) => setSpentOn(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>
      {amount !== "" && !amountValid && (
        <p className="text-xs text-red-600">
          Amount must be between ₹1 and ₹10,00,000
        </p>
      )}

      <div>
        <label
          htmlFor={`category-${initial?.id ?? "new"}`}
          className={LABEL_CLASS}
        >
          Category *
        </label>
        <input
          id={`category-${initial?.id ?? "new"}`}
          type="text"
          required
          minLength={2}
          maxLength={40}
          list="expense-categories"
          placeholder="Decoration, Prasad, Sound, Pandal…"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={INPUT_CLASS}
        />
        <datalist id="expense-categories">
          {(categories.data ?? []).map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <span className={LABEL_CLASS}>Size *</span>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSize(s.value)}
              className={`h-11 rounded-lg border-2 text-sm font-semibold ${
                size === s.value
                  ? "border-maroon bg-maroon/5 text-maroon"
                  : "border-gray-200 text-gray-500 active:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ScreenshotUpload
        url={receiptUrl}
        onChange={setReceiptUrl}
        label="🧾 Upload bill photo (optional)"
      />

      <div>
        <label htmlFor={`notes-${initial?.id ?? "new"}`} className={LABEL_CLASS}>
          Notes
        </label>
        <textarea
          id={`notes-${initial?.id ?? "new"}`}
          rows={2}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 flex-1 rounded-lg bg-maroon text-base font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
        >
          {mutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <FestiveSpinner size={20} /> Saving…
            </span>
          ) : initial ? (
            "Save changes"
          ) : (
            "Add expense"
          )}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onDone}
            className="h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-700 active:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
