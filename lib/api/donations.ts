"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import {
  DONATIONS_QUERY_KEYS,
  STATS_QUERY_KEYS,
  STREETS_QUERY_KEYS,
} from "@/lib/query-keys";

export type Donation = {
  id: string;
  receiptNo: string;
  donorName: string;
  mobile: string | null;
  street: string;
  houseNo: string | null;
  amount: number;
  mode: "CASH" | "UPI";
  status: "PENDING" | "VERIFIED" | "REJECTED";
  screenshotUrl: string | null;
  anonymous: boolean;
  cashDeposited: boolean;
  collectedById: string;
  createdAt: string;
  collectedBy?: { name: string };
};

export type CreateDonationInput = {
  donorName: string;
  street: string;
  houseNo?: string;
  amount: number;
  mode: "CASH" | "UPI";
  mobile?: string;
  anonymous: boolean;
  screenshotUrl?: string;
};

export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

async function fetchDonations(params: Record<string, string>): Promise<Donation[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/donations${qs ? `?${qs}` : ""}`);
  return unwrap<Donation[]>(res);
}

async function fetchStreets(): Promise<string[]> {
  const res = await fetch("/api/streets");
  return unwrap<string[]>(res);
}

async function createDonation(body: CreateDonationInput): Promise<Donation> {
  const res = await fetch("/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Donation>(res);
}

export function useDonations(params: Record<string, string>) {
  return useQuery({
    queryKey: DONATIONS_QUERY_KEYS.list(params),
    queryFn: () => fetchDonations(params),
  });
}

export function useStreets() {
  return useQuery({
    queryKey: STREETS_QUERY_KEYS.list(),
    queryFn: fetchStreets,
  });
}

export type UpdateDonationInput = {
  id: string;
  status?: "VERIFIED" | "REJECTED";
  cashDeposited?: true;
};

async function updateDonation({
  id,
  ...body
}: UpdateDonationInput): Promise<Donation> {
  const res = await fetch(`/api/donations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Donation>(res);
}

// Verify/Reject/Mark-deposited — refreshes both the donation lists and the
// dashboard stats.
export function useUpdateDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DONATIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.all });
    },
  });
}

// Optimistically prepends to the "my collections today" list, rolls back on
// error, and reconciles with the server on settle.
export function useCreateDonation() {
  const queryClient = useQueryClient();
  const todayKey = DONATIONS_QUERY_KEYS.list({ date: todayIST() });

  return useMutation({
    mutationFn: createDonation,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: todayKey });
      const previous = queryClient.getQueryData<Donation[]>(todayKey);

      const optimistic: Donation = {
        id: `optimistic-${Date.now()}`,
        receiptNo: "…",
        donorName: input.donorName,
        mobile: input.mobile ?? null,
        street: input.street,
        houseNo: input.houseNo ?? null,
        amount: input.amount,
        mode: input.mode,
        status: input.mode === "CASH" ? "VERIFIED" : "PENDING",
        screenshotUrl: input.screenshotUrl ?? null,
        anonymous: input.anonymous,
        cashDeposited: false,
        collectedById: "",
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Donation[]>(todayKey, (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );

      return { previous };
    },
    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(todayKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DONATIONS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STREETS_QUERY_KEYS.all });
    },
  });
}
