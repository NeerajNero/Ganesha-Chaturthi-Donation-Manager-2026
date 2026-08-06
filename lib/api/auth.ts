"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { unwrap } from "@/lib/api/types";
import { AUTH_QUERY_KEYS } from "@/lib/query-keys";

export type SessionUser = {
  id: string;
  name: string;
  role: "ADMIN" | "VOLUNTEER";
};

async function login(body: {
  username: string;
  password: string;
}): Promise<SessionUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<SessionUser>(res);
}

async function logout(): Promise<null> {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return unwrap<null>(res);
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all });
      router.replace(user.role === "ADMIN" ? "/admin" : "/collect");
      router.refresh();
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    },
  });
}
