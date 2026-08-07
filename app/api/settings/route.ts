import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  getSettingBool,
  setSettingBool,
  SHOW_AARTI_COUNTDOWN,
} from "@/lib/settings";

const updateSettingsSchema = z.object({
  showAartiCountdown: z.boolean(),
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

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const showAartiCountdown = await getSettingBool(SHOW_AARTI_COUNTDOWN, true);
    return NextResponse.json({ ok: true, data: { showAartiCountdown } });
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

    await setSettingBool(SHOW_AARTI_COUNTDOWN, parsed.data.showAartiCountdown);
    return NextResponse.json({
      ok: true,
      data: { showAartiCountdown: parsed.data.showAartiCountdown },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
