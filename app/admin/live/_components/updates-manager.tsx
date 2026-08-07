"use client";

import { useState } from "react";
import { useCreateUpdate, useDeleteUpdate, useUpdates } from "@/lib/api/updates";
import { ListSkeleton } from "@/components/skeleton";
import { FestiveSpinner } from "@/components/festive-spinner";

export function UpdatesManager() {
  const [message, setMessage] = useState("");
  const updates = useUpdates();
  const create = useCreateUpdate();
  const del = useDeleteUpdate();

  const timeFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="space-y-4">
      <form
        className="space-y-3 rounded-2xl border border-gold/30 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate(
            { message: message.trim() },
            { onSuccess: () => setMessage("") }
          );
        }}
      >
        <label htmlFor="update-message" className="block text-sm font-medium text-gray-700">
          New update
        </label>
        <textarea
          id="update-message"
          rows={3}
          required
          minLength={2}
          maxLength={280}
          placeholder="e.g. Aarti tonight at 7:30 PM — prasad after 🙏"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{message.length}/280</span>
          <button
            type="submit"
            disabled={create.isPending}
            className="h-12 rounded-lg bg-maroon px-5 text-sm font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
          >
            {create.isPending ? (
              <span className="flex items-center gap-2">
                <FestiveSpinner size={18} /> Posting…
              </span>
            ) : (
              "📣 Post update"
            )}
          </button>
        </div>
      </form>

      {updates.isPending ? (
        <ListSkeleton rows={3} rowClassName="h-20" />
      ) : updates.isError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {updates.error.message}
        </p>
      ) : updates.data.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
          No updates posted yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {updates.data.map((u) => (
            <li
              key={u.id}
              className="flex items-start justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-sm leading-relaxed">{u.message}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {timeFmt.format(new Date(u.createdAt))}
                </p>
              </div>
              <button
                type="button"
                disabled={del.isPending}
                onClick={() => {
                  if (window.confirm("Delete this update?")) del.mutate(u.id);
                }}
                className="h-10 shrink-0 rounded-lg border border-red-300 px-3 text-xs font-medium text-red-700 active:bg-red-50 disabled:opacity-60"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
