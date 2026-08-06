"use client";

import { useState } from "react";
import { useUpdateVolunteer, useVolunteers, type Volunteer } from "@/lib/api/users";
import { ListSkeleton } from "@/components/skeleton";

export function VolunteerList() {
  const { data, isPending, isError, error } = useVolunteers();

  if (isPending) {
    return <ListSkeleton rows={3} rowClassName="h-28" />;
  }
  if (isError) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
        {error.message}
      </p>
    );
  }
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No volunteers yet — add the first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((v) => (
        <VolunteerCard key={v.id} volunteer={v} />
      ))}
    </ul>
  );
}

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const update = useUpdateVolunteer();
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  return (
    <li className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {volunteer.name}{" "}
            {!volunteer.active && (
              <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                inactive
              </span>
            )}
          </p>
          <p className="truncate text-sm text-gray-500">@{volunteer.username}</p>
          <p className="mt-1 text-sm text-gray-600">
            {volunteer.donationCount} donation
            {volunteer.donationCount === 1 ? "" : "s"} · ₹
            {volunteer.totalCollected.toLocaleString("en-IN")} collected
          </p>
        </div>
        <button
          type="button"
          disabled={update.isPending}
          onClick={() =>
            update.mutate({ id: volunteer.id, active: !volunteer.active })
          }
          className={`h-11 shrink-0 rounded-lg px-3 text-sm font-medium disabled:opacity-60 ${
            volunteer.active
              ? "border border-red-200 text-red-700 active:bg-red-50"
              : "border border-green-200 text-green-700 active:bg-green-50"
          }`}
        >
          {volunteer.active ? "Deactivate" : "Activate"}
        </button>
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        {resetting ? (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              update.mutate(
                { id: volunteer.id, password: newPassword },
                {
                  onSuccess: () => {
                    setResetting(false);
                    setNewPassword("");
                  },
                }
              );
            }}
          >
            <input
              type="text"
              autoComplete="off"
              placeholder="New password (min 6 chars)"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block h-11 w-full min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={update.isPending}
              className="h-11 shrink-0 rounded-lg bg-orange-600 px-3 text-sm font-semibold text-white active:bg-orange-700 disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setResetting(false)}
              className="h-11 shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 active:bg-gray-100"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setResetting(true)}
            className="h-11 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700 active:bg-gray-100"
          >
            Reset password
          </button>
        )}
      </div>
    </li>
  );
}
