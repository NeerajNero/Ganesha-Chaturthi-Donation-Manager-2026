"use client";

import { useQuery } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { STATS_QUERY_KEYS } from "@/lib/query-keys";

export type Stats = {
  totalCollected: number;
  donationCount: number;
  daily: { date: string; total: number }[];
  todayCollected: number;
  totalExpenses: number;
  balance: number;
  expensesBySize: { MINOR: number; MID: number; MAJOR: number };
  expensesByCategory: { category: string; count: number; total: number }[];
  cashInHand: number;
  pendingUpi: { count: number; amount: number };
  byMode: { CASH: number; UPI: number };
  byStreet: { street: string; count: number; total: number }[];
  byVolunteer: {
    id: string;
    name: string;
    count: number;
    total: number;
    cashInHand: number;
  }[];
};

async function fetchStats(): Promise<Stats> {
  const res = await fetch("/api/stats");
  return unwrap<Stats>(res);
}

export function useStats() {
  return useQuery({
    queryKey: STATS_QUERY_KEYS.summary(),
    queryFn: fetchStats,
  });
}
