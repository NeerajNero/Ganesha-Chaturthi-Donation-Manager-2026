"use client";

import { useLogout } from "@/lib/api/auth";
import { FestiveSpinner } from "@/components/festive-spinner";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 active:bg-gray-100 disabled:opacity-60"
    >
      {logout.isPending ? (
        <span className="flex items-center gap-2">
          <FestiveSpinner size={16} /> Logging out…
        </span>
      ) : (
        "Log out"
      )}
    </button>
  );
}
