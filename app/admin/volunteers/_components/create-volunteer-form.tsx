"use client";

import { useState } from "react";
import { useCreateVolunteer } from "@/lib/api/users";

const INPUT_CLASS =
  "block h-12 w-full rounded-lg border border-gray-300 px-3 text-base focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500";

export function CreateVolunteerForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const create = useCreateVolunteer();

  return (
    <form
      className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate(
          { name, username, password },
          {
            onSuccess: () => {
              setName("");
              setUsername("");
              setPassword("");
            },
          }
        );
      }}
    >
      <h2 className="text-base font-semibold">Add volunteer</h2>

      <div>
        <label
          htmlFor="new-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>
        <input
          id="new-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label
          htmlFor="new-username"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="new-username"
          type="text"
          autoCapitalize="none"
          autoComplete="off"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="new-password"
          type="text"
          autoComplete="off"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={INPUT_CLASS}
        />
        <p className="mt-1 text-xs text-gray-500">
          Share these with the volunteer — they log in with them.
        </p>
      </div>

      {create.isError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {create.error.message}
        </p>
      )}
      {create.isSuccess && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Volunteer “{create.data.name}” created
        </p>
      )}

      <button
        type="submit"
        disabled={create.isPending}
        className="h-12 w-full rounded-lg bg-orange-600 text-base font-semibold text-white active:bg-orange-700 disabled:opacity-60"
      >
        {create.isPending ? "Creating…" : "Create volunteer"}
      </button>
    </form>
  );
}
