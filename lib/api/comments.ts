"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { PHOTO_COMMENTS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type PublicComment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

export type PendingComment = PublicComment & {
  status: "PENDING" | "APPROVED" | "REJECTED";
  photo: { id: string; url: string; caption: string | null };
};

// --- Public hooks ---

async function fetchComments(photoId: string): Promise<PublicComment[]> {
  const res = await fetch(`/api/photos/${photoId}/comments`);
  return unwrap<PublicComment[]>(res);
}

async function addComment(args: {
  photoId: string;
  name: string;
  body: string;
  fingerprint: string;
}) {
  const { photoId, ...rest } = args;
  const res = await fetch(`/api/photos/${photoId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  return unwrap<{ id: string; status: string }>(res);
}

export function usePhotoComments(photoId: string) {
  return useQuery({
    queryKey: PHOTO_COMMENTS_QUERY_KEYS.photo(photoId),
    queryFn: () => fetchComments(photoId),
    enabled: !!photoId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: PHOTO_COMMENTS_QUERY_KEYS.photo(vars.photoId),
      });
      show("Comment submitted — awaiting admin approval 🙏", "success");
    },
  });
}

// --- Admin hooks ---

async function fetchPendingComments(): Promise<PendingComment[]> {
  const res = await fetch("/api/admin/comments");
  return unwrap<PendingComment[]>(res);
}

async function moderateComment(args: {
  id: string;
  status: "APPROVED" | "REJECTED";
}) {
  const res = await fetch(`/api/admin/comments/${args.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: args.status }),
  });
  return unwrap<{ id: string; status: string }>(res);
}

export function usePendingComments() {
  return useQuery({
    queryKey: PHOTO_COMMENTS_QUERY_KEYS.pending(),
    queryFn: fetchPendingComments,
  });
}

export function useModerateComment() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: moderateComment,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: PHOTO_COMMENTS_QUERY_KEYS.all,
      });
      show(
        vars.status === "APPROVED" ? "Comment approved ✓" : "Comment rejected",
        "success"
      );
    },
  });
}
