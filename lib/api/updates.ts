"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { UPDATES_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type Update = {
  id: string;
  message: string;
  createdAt: string;
};

async function fetchUpdates(): Promise<Update[]> {
  const res = await fetch("/api/updates");
  return unwrap<Update[]>(res);
}

async function createUpdate(body: { message: string }): Promise<Update> {
  const res = await fetch("/api/updates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Update>(res);
}

async function deleteUpdate(id: string): Promise<null> {
  const res = await fetch(`/api/updates/${id}`, { method: "DELETE" });
  return unwrap<null>(res);
}

export function useUpdates() {
  return useQuery({
    queryKey: UPDATES_QUERY_KEYS.list(),
    queryFn: fetchUpdates,
  });
}

export function useCreateUpdate() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPDATES_QUERY_KEYS.all });
      show("Update posted to the live page ✓", "success");
    },
  });
}

export function useDeleteUpdate() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UPDATES_QUERY_KEYS.all });
      show("Update removed", "success");
    },
  });
}
