"use client";

import { usePhotoLikes, useLikePhoto } from "@/lib/api/photos";
import { useFingerprint } from "@/lib/use-fingerprint";

interface LikeButtonProps {
  photoId: string;
  /** Optional server-side initial count for instant render */
  initialCount?: number;
}

export function LikeButton({ photoId, initialCount = 0 }: LikeButtonProps) {
  const fingerprint = useFingerprint();
  const likes = usePhotoLikes(photoId, fingerprint ?? "");
  const likeMutation = useLikePhoto();

  const count = likes.data?.count ?? initialCount;
  const liked = likes.data?.liked ?? false;
  const isPending = likeMutation.isPending;

  function handleLike() {
    if (!fingerprint || liked || isPending) return;
    likeMutation.mutate({ photoId, fingerprint });
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || isPending || !fingerprint}
      aria-label={liked ? `${count} likes` : `Like this photo — ${count} likes`}
      className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all active:scale-95 ${
        liked
          ? "bg-red-50 text-red-500 cursor-default"
          : "bg-white/80 text-ink/60 hover:bg-red-50 hover:text-red-500"
      }`}
    >
      <span
        className={`text-base transition-transform ${
          isPending ? "animate-bounce" : liked ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
