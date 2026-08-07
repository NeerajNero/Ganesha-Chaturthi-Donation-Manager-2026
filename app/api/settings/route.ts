import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  getSettingBool,
  setSettingBool,
  SHOW_AARTI_COUNTDOWN,
  SHOW_WALL_EXPENSES,
} from "@/lib/settings";

const updateSettingsSchema = z
  .object({
    showAartiCountdown: z.boolean().optional(),
    showWallExpenses: z.boolean().optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: "Nothing to update",
  });

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: session ? "Admin access required" : "Not logged in" },
      { status: session ? 403 : 401 }
    );
  }
  return null;
}

async function readAll() {
  const [showAartiCountdown, showWallExpenses] = await Promise.all([
    getSettingBool(SHOW_AARTI_COUNTDOWN, true),
    getSettingBool(SHOW_WALL_EXPENSES, true),
  ]);
  return { showAartiCountdown, showWallExpenses };
}

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;
    return NextResponse.json({ ok: true, data: await readAll() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await req.json().catch(() => null);
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { showAartiCountdown, showWallExpenses } = parsed.data;
    if (showAartiCountdown !== undefined) {
      await setSettingBool(SHOW_AARTI_COUNTDOWN, showAartiCountdown);
    }
    if (showWallExpenses !== undefined) {
      await setSettingBool(SHOW_WALL_EXPENSES, showWallExpenses);
    }

    return NextResponse.json({ ok: true, data: await readAll() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
