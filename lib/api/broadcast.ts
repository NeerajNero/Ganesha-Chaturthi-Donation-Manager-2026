"use client";

import { useMutation } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";

async function sendSummary(): Promise<{ message: string }> {
  const res = await fetch("/api/broadcast/summary", { method: "POST" });
  return unwrap<{ message: string }>(res);
}

export function useSendSummary() {
  return useMutation({ mutationFn: sendSummary });
}
