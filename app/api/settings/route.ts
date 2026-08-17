import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/api/server-auth";
import { revalidateTag } from "next/cache";
import {
  getSettingBool,
  setSettingBool,
  SHOW_AARTI_COUNTDOWN,
  SHOW_WALL_EXPENSES,
  DONATION_SECTION_VISIBLE,
} from "@/lib/settings";

const updateSettingsSchema = z
  .object({
    showAartiCountdown: z.boolean().optional(),
    showWallExpenses: z.boolean().optional(),
    donationSectionVisible: z.boolean().optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), {
    message: "Nothing to update",
  });

async function readAll() {
  const [showAartiCountdown, showWallExpenses, donationSectionVisible] = await Promise.all([
    getSettingBool(SHOW_AARTI_COUNTDOWN, true),
    getSettingBool(SHOW_WALL_EXPENSES, true),
    getSettingBool(DONATION_SECTION_VISIBLE, true),
  ]);
  return { showAartiCountdown, showWallExpenses, donationSectionVisible };
}

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;
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
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await req.json().catch(() => null);
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { showAartiCountdown, showWallExpenses, donationSectionVisible } = parsed.data;
    if (showAartiCountdown !== undefined) {
      await setSettingBool(SHOW_AARTI_COUNTDOWN, showAartiCountdown);
    }
    if (showWallExpenses !== undefined) {
      await setSettingBool(SHOW_WALL_EXPENSES, showWallExpenses);
    }
    if (donationSectionVisible !== undefined) {
      await setSettingBool(DONATION_SECTION_VISIBLE, donationSectionVisible);
    }

    // Bust the settings cache so public pages pick up the change immediately.
    revalidateTag("settings", {});

    return NextResponse.json({ ok: true, data: await readAll() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
