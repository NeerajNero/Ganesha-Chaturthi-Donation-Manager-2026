"use client";

import { useState } from "react";
import { useLogin } from "@/lib/api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <p className="font-display mb-1 text-center text-xs text-maroon/80">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h1 className="font-display mb-1 text-center text-2xl text-maroon">
          🙏 Ganesh Utsav 2026
        </h1>
        <p className="mb-6 text-center text-sm text-ink/60">
          Donation collection — volunteer login
        </p>

        <form
          className="space-y-4 rounded-2xl border border-gold/30 bg-white p-6 shadow"
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate({ username, password });
          }}
        >
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block h-12 w-full rounded-lg border border-gray-300 px-3 text-base focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block h-12 w-full rounded-lg border border-gray-300 px-3 text-base focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {login.isError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {login.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="h-12 w-full rounded-lg bg-maroon text-base font-semibold text-cream active:bg-maroon/90 disabled:opacity-60"
          >
            {login.isPending ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
