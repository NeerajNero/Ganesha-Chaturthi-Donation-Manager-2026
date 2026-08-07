"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { EXPENSES_QUERY_KEYS, STATS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type ExpenseSize = "MINOR" | "MID" | "MAJOR";

export type Expense = {
  id: string;
  title: string;
  category: string;
  size: ExpenseSize;
  amount: number;
  receiptUrl: string | null;
  notes: string | null;
  spentOn: string;
  addedById: string;
  createdAt: string;
  addedBy?: { name: string };
};

export type CreateExpenseInput = {
  title: string;
  category: string;
  size: ExpenseSize;
  amount: number;
  receiptUrl?: string;
  notes?: string;
  spentOn?: string;
};

export type UpdateExpenseInput = Partial<CreateExpenseInput> & { id: string };

async function fetchExpenses(params: Record<string, string>): Promise<Expense[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/expenses${qs ? `?${qs}` : ""}`);
  return unwrap<Expense[]>(res);
}

async function fetchCategories(): Promise<string[]> {
  const res = await fetch("/api/expenses/categories");
  return unwrap<string[]>(res);
}

async function createExpense(body: CreateExpenseInput): Promise<Expense> {
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Expense>(res);
}

async function updateExpense({ id, ...body }: UpdateExpenseInput): Promise<Expense> {
  const res = await fetch(`/api/expenses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Expense>(res);
}

async function deleteExpense(id: string): Promise<null> {
  const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
  return unwrap<null>(res);
}

export function useExpenses(params: Record<string, string>) {
  return useQuery({
    queryKey: EXPENSES_QUERY_KEYS.list(params),
    queryFn: () => fetchExpenses(params),
  });
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: EXPENSES_QUERY_KEYS.categories(),
    queryFn: fetchCategories,
  });
}

function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEYS.all });
  };
}

export function useCreateExpense() {
  const invalidate = useInvalidateExpenses();
  const { show } = useToast();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: (data) => {
      invalidate();
      show(`Expense "${data.title}" added ✓`, "success");
    },
  });
}

export function useUpdateExpense() {
  const invalidate = useInvalidateExpenses();
  const { show } = useToast();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: (data) => {
      invalidate();
      show(`Expense "${data.title}" updated ✓`, "success");
    },
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenses();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      invalidate();
      show("Expense deleted", "success");
    },
  });
}
