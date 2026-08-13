"use client";

import { useState, useEffect } from "react";
import { useAddComment } from "@/lib/api/comments";
import { useFingerprint } from "@/lib/use-fingerprint";
import { FestiveSpinner } from "@/components/festive-spinner";

interface CommentFormProps {
  photoId: string;
}

const STORAGE_KEY_PREFIX = "gu26_commented_";

export function CommentForm({ photoId }: CommentFormProps) {
  const fingerprint = useFingerprint();
  const addComment = useAddComment();

  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [hasCommentedToday, setHasCommentedToday] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if user already submitted a comment today for this photo
  useEffect(() => {
    let alreadyCommented = false;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${photoId}`);
      if (stored) {
        const date = new Date(stored);
        const now = new Date();
        alreadyCommented =
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
      }
    } catch {
      // localStorage not available
    }
    if (alreadyCommented) {
      // Use setTimeout to avoid synchronous setState inside effect (ESLint: react-hooks/set-state-in-effect)
      setTimeout(() => setHasCommentedToday(true), 0);
    }
  }, [photoId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fingerprint || !name.trim() || !body.trim()) return;

    addComment.mutate(
      { photoId, name: name.trim(), body: body.trim(), fingerprint },
      {
        onSuccess: () => {
          try {
            localStorage.setItem(
              `${STORAGE_KEY_PREFIX}${photoId}`,
              new Date().toISOString()
            );
          } catch {
            // localStorage not available
          }
          setSubmitted(true);
          setHasCommentedToday(true);
        },
      }
    );
  }

  if (submitted || hasCommentedToday) {
    return (
      <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-4 text-center">
        <p className="text-sm font-semibold text-maroon">
          ✅ Comment submitted!
        </p>
        <p className="mt-1 text-xs text-ink/60">
          Awaiting admin approval. Come back to see it appear here 🙏
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-semibold text-ink/80">Leave a comment</h3>
      <input
        type="text"
        placeholder="Your name *"
        maxLength={50}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block h-11 w-full rounded-xl border border-gold/30 bg-white px-3 text-sm text-ink placeholder:text-ink/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
      />
      <textarea
        placeholder="Your comment… (max 280 characters)"
        maxLength={280}
        required
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="block w-full resize-none rounded-xl border border-gold/30 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-ink/40">{body.length}/280</p>
        <button
          type="submit"
          disabled={addComment.isPending || !name.trim() || !body.trim()}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-maroon px-5 text-sm font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
        >
          {addComment.isPending ? (
            <>
              <FestiveSpinner size={14} /> Submitting…
            </>
          ) : (
            "Submit 🙏"
          )}
        </button>
      </div>
      {addComment.isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {(addComment.error as Error).message}
        </p>
      )}
    </form>
  );
}
