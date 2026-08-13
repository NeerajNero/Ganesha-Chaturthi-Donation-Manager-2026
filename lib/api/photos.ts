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

export type PhotosResponse = {
  photos: Photo[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

async function fetchPhotos(
  params?: Record<string, string | number>
): Promise<PhotosResponse> {
  const query = params ? "?" + new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString() : "";
  const res = await fetch(`/api/photos${query}`);
  const data = await unwrap<PhotosResponse | Photo[]>(res);

  if (Array.isArray(data)) {
    return {
      photos: data,
      total: data.length,
      page: 1,
      totalPages: 1,
      limit: data.length,
    };
  }
  return data;
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

export function usePhotos(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: PHOTOS_QUERY_KEYS.list(params),
    queryFn: () => fetchPhotos(params),
  });
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
