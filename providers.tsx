"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider, useToast } from "@/components/toaster";

// Global error toasts: every failed mutation/query surfaces automatically.
// Opt out per-hook with meta: { skipToast: true } (used where a form shows
// the error inline, e.g. login and the broadcast dialog).
function QueryProvider({ children }: { children: React.ReactNode }) {
  const { show } = useToast(); // stable useCallback from ToastProvider

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.skipToast) return;
            show(
              error instanceof Error ? error.message : "Something went wrong"
            );
          },
        }),
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.skipToast) return;
            show(
              error instanceof Error ? error.message : "Failed to load data"
            );
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <QueryProvider>{children}</QueryProvider>
    </ToastProvider>
  );
}
