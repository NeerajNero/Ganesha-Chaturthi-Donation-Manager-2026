"use client";

import { useState, useMemo } from "react";
import { usePendingComments, useModerateComment } from "@/lib/api/comments";
import { ListSkeleton } from "@/components/skeleton";
import { FestiveSpinner } from "@/components/festive-spinner";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 10;

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export function CommentModerator() {
  const [page, setPage] = useState(1);
  const comments = usePendingComments();
  const moderate = useModerateComment();

  const allComments = comments.data ?? [];
  const totalPages = Math.ceil(allComments.length / PAGE_SIZE) || 1;
  const paginatedComments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allComments.slice(start, start + PAGE_SIZE);
  }, [allComments, page]);

  if (comments.isPending) {
    return <ListSkeleton rows={3} rowClassName="h-28" />;
  }

  if (comments.isError) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {comments.error.message}
      </p>
    );
  }

  if (allComments.length === 0) {
    return (
      <p className="rounded-2xl bg-white py-8 text-center text-sm text-gray-500 shadow-sm">
        🎉 No pending comments — all clear!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {paginatedComments.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              {/* Photo thumbnail */}
              <a
                href={c.photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo.url}
                  alt={c.photo.caption ?? "Photo"}
                  className="h-14 w-14 rounded-xl object-cover border border-gold/20"
                />
              </a>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-maroon truncate">{c.name}</p>
                  <time className="shrink-0 text-[11px] text-gray-400">
                    {dateFmt.format(new Date(c.createdAt))}
                  </time>
                </div>
                {c.photo.caption && (
                  <p className="text-[11px] text-gray-400 truncate">
                    on: {c.photo.caption}
                  </p>
                )}
                <p className="text-sm text-ink/80 leading-relaxed">{c.body}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <button
                type="button"
                disabled={moderate.isPending}
                onClick={() => moderate.mutate({ id: c.id, status: "APPROVED" })}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 text-sm font-semibold text-white active:bg-green-700 disabled:opacity-60"
              >
                {moderate.isPending ? (
                  <FestiveSpinner size={14} />
                ) : (
                  "✅ Approve"
                )}
              </button>
              <button
                type="button"
                disabled={moderate.isPending}
                onClick={() => moderate.mutate({ id: c.id, status: "REJECTED" })}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 text-sm font-semibold text-red-600 active:bg-red-100 disabled:opacity-60"
              >
                ❌ Reject
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
