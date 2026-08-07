"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { SETTINGS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type Settings = {
  showAartiCountdown: boolean;
  showWallExpenses: boolean;
};

const TOGGLE_MESSAGES: Record<keyof Settings, { on: string; off: string }> = {
  showAartiCountdown: {
    on: "Aarti countdown is now visible on /live ✓",
    off: "Aarti countdown hidden from /live",
  },
  showWallExpenses: {
    on: "Expenses are now visible on the public wall ✓",
    off: "Expenses hidden from the public wall",
  },
};

async function fetchSettings(): Promise<Settings> {
  const res = await fetch("/api/settings");
  return unwrap<Settings>(res);
}

async function updateSettings(body: Partial<Settings>): Promise<Settings> {
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
    onSuccess: (data, variables) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEYS.all, data);
      for (const key of Object.keys(variables) as (keyof Settings)[]) {
        const value = variables[key];
        if (value !== undefined) {
          show(TOGGLE_MESSAGES[key][value ? "on" : "off"], "success");
        }
      }
    },
  });
}
