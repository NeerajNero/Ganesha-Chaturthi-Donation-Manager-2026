"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { PHOTOS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type Photo = {
  id: string;
  url: string;
  caption: string | null;
  createdAt: string;
};

async function fetchPhotos(): Promise<Photo[]> {
  const res = await fetch("/api/photos");
  return unwrap<Photo[]>(res);
}

async function createPhoto(body: {
  url: string;
  caption?: string;
}): Promise<Photo> {
  const res = await fetch("/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Photo>(res);
}

async function deletePhoto(id: string): Promise<null> {
  const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
  return unwrap<null>(res);
}

export function usePhotos() {
  return useQuery({ queryKey: PHOTOS_QUERY_KEYS.list(), queryFn: fetchPhotos });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_QUERY_KEYS.all });
      show("Photo added to the gallery ✓", "success");
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_QUERY_KEYS.all });
      show("Photo removed", "success");
    },
  });
}
