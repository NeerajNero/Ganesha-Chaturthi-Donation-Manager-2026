"use client";

import { usePhotoComments } from "@/lib/api/comments";
import { FestiveSpinner } from "@/components/festive-spinner";

interface CommentListProps {
  photoId: string;
}

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export function CommentList({ photoId }: CommentListProps) {
  const { data: comments, isPending, isError } = usePhotoComments(photoId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink/50">
        <FestiveSpinner size={16} /> Loading comments…
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-4 text-center text-sm text-red-500">
        Could not load comments.
      </p>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink/40">
        No comments yet — be the first! 🙏
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li
          key={c.id}
          className="rounded-xl border border-gold/20 bg-cream/60 px-4 py-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-maroon">{c.name}</p>
            <time
              dateTime={c.createdAt}
              className="shrink-0 text-[11px] text-ink/40"
            >
              {dateFmt.format(new Date(c.createdAt))}
            </time>
          </div>
          <p className="mt-1 text-sm text-ink/80 leading-relaxed">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
