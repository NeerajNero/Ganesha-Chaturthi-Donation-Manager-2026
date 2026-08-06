"use client";

import { useMutation } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";

async function sendSummary(): Promise<{ message: string }> {
  const res = await fetch("/api/broadcast/summary", { method: "POST" });
  return unwrap<{ message: string }>(res);
}

export function useSendSummary() {
  // The broadcast dialog renders its own success/error result.
  return useMutation({ mutationFn: sendSummary, meta: { skipToast: true } });
}
