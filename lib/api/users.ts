"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unwrap } from "@/lib/api/types";
import { USERS_QUERY_KEYS } from "@/lib/query-keys";
import { useToast } from "@/components/toaster";

export type Volunteer = {
  id: string;
  username: string;
  name: string;
  active: boolean;
  createdAt: string;
  donationCount: number;
  totalCollected: number;
};

export type CreateVolunteerInput = {
  username: string;
  password: string;
  name: string;
};

export type UpdateVolunteerInput = {
  id: string;
  active?: boolean;
  password?: string;
};

async function fetchVolunteers(): Promise<Volunteer[]> {
  const res = await fetch("/api/users");
  return unwrap<Volunteer[]>(res);
}

async function createVolunteer(body: CreateVolunteerInput) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Pick<Volunteer, "id" | "username" | "name" | "active">>(res);
}

async function updateVolunteer({ id, ...body }: UpdateVolunteerInput) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return unwrap<Pick<Volunteer, "id" | "username" | "name" | "active">>(res);
}

export function useVolunteers() {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.list(),
    queryFn: fetchVolunteers,
  });
}

export function useCreateVolunteer() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createVolunteer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      show(`Volunteer "${data.name}" created ✓`, "success");
    },
  });
}

export function useUpdateVolunteer() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: updateVolunteer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      show(
        variables.password
          ? `Password reset for "${data.name}" ✓`
          : variables.active === false
            ? `"${data.name}" deactivated`
            : `"${data.name}" activated ✓`,
        "success"
      );
    },
  });
}
