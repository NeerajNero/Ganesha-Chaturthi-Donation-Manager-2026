import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

// Best-effort brute-force guard: 5 failed attempts per username per 15 min.
// In-memory, so it's per serverless instance — acceptable for this app.
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isLocked(key: string): number | null {
  const entry = failedAttempts.get(key);
  if (!entry) return null;
  if (entry.resetAt <= Date.now()) {
    failedAttempts.delete(key);
    return null;
  }
  if (entry.count < MAX_ATTEMPTS) return null;
  return Math.ceil((entry.resetAt - Date.now()) / 60_000);
}

function recordFailure(key: string) {
  const entry = failedAttempts.get(key);
  if (entry && entry.resetAt > Date.now()) {
    entry.count += 1;
  } else {
    failedAttempts.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const rateKey = username.toLowerCase();

    const lockedForMinutes = isLocked(rateKey);
    if (lockedForMinutes !== null) {
      return NextResponse.json(
        {
          ok: false,
          error: `Too many failed attempts. Try again in ${lockedForMinutes} minute${lockedForMinutes === 1 ? "" : "s"}.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      recordFailure(rateKey);
      return NextResponse.json(
        { ok: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }
    failedAttempts.delete(rateKey);
    if (!user.active) {
      return NextResponse.json(
        { ok: false, error: "This account has been deactivated" },
        { status: 403 }
      );
    }

    const session = { id: user.id, name: user.name, role: user.role };
    const token = await signJwt(session);
    await setSessionCookie(token);

    return NextResponse.json({ ok: true, data: session });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
