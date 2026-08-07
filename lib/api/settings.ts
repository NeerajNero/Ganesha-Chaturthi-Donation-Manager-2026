"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { SETTINGS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type Settings = { showAartiCountdown: boolean };

async function fetchSettings(): Promise<Settings> {
  const res = await fetch("/api/settings");
  return unwrap<Settings>(res);
}

async function updateSettings(body: Settings): Promise<Settings> {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Settings>(res);
}

export function useSettings() {
  return useQuery({ queryKey: SETTINGS_QUERY_KEYS.all, queryFn: fetchSettings });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEYS.all, data);
      show(
        data.showAartiCountdown
          ? "Aarti countdown is now visible on /live ✓"
          : "Aarti countdown hidden from /live",
        "success"
      );
    },
  });
}
