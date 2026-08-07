import { prisma } from "@/lib/prisma";

export const SHOW_AARTI_COUNTDOWN = "showAartiCountdown";
export const SHOW_WALL_EXPENSES = "showWallExpenses";

export async function getSettingBool(
  key: string,
  defaultValue: boolean
): Promise<boolean> {
  const row = await prisma.setting.findUnique({ where: { key } });
  if (!row) return defaultValue;
  return row.value === "true";
}

export async function setSettingBool(key: string, value: boolean): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  });
}
