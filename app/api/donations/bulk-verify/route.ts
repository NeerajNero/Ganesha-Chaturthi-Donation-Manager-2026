import { NextResponse, after } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api/server-auth";
import { crossedMilestone, milestoneMessage } from "@/lib/milestones";
import { GOAL_AMOUNT } from "@/lib/config";

const bulkVerifySchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(100),
});

export async function POST(req: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await req.json().catch(() => null);
    const parsed = bulkVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { ids } = parsed.data;

    // Only allow verifying PENDING UPI donations.
    const updated = await prisma.donation.updateMany({
      where: { id: { in: ids }, mode: "UPI", status: "PENDING" },
      data: { status: "VERIFIED" },
    });

    // Check for milestone after bulk verify — fire-and-forget.
    after(async () => {
      try {
        const verified = await prisma.donation.aggregate({
          _sum: { amount: true },
          where: { status: "VERIFIED" },
        });
        const verifiedTotal = verified._sum.amount ?? 0;
        // Approximate "before" — use verified total minus sum of newly verified.
        const newlyVerified = await prisma.donation.aggregate({
          _sum: { amount: true },
          where: { id: { in: ids }, status: "VERIFIED" },
        });
        const beforeTotal = verifiedTotal - (newlyVerified._sum.amount ?? 0);
        const milestone = crossedMilestone(beforeTotal, verifiedTotal, GOAL_AMOUNT);
        if (milestone) {
          const { sendTelegramMessage } = await import("@/lib/telegram");
          const { milestoneMessage: msg } = await import("@/lib/milestones");
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
          await sendTelegramMessage(msg(milestone, verifiedTotal, GOAL_AMOUNT, appUrl));
        }
      } catch {
        // best-effort only
      }
    });

    return NextResponse.json({
      ok: true,
      data: { count: updated.count },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
