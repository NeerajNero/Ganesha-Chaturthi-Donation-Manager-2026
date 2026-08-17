import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import type { Session } from "@/lib/auth";

type AuthSuccess = { session: Session; error?: never };
type AuthFailure = { session?: never; error: NextResponse };

/**
 * Requires any logged-in session. Returns the session or a 401 response.
 */
export async function requireSession(): Promise<AuthSuccess | AuthFailure> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      ),
    };
  }
  return { session };
}

/**
 * Requires an ADMIN session. Returns the session or a 401/403 response.
 */
export async function requireAdmin(): Promise<AuthSuccess | AuthFailure> {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      ),
    };
  }
  if (session.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { session };
}
