import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatSummaryMessage } from "@/lib/summary";

// In-memory guard — good enough per instance; serverless cold starts reset it.
let lastSummarySentAt = 0;
const MIN_INTERVAL_MS = 2 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }
    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    if (Date.now() - lastSummarySentAt < MIN_INTERVAL_MS) {
      return NextResponse.json(
        { ok: false, error: "A summary was sent less than 2 minutes ago — please wait" },
        { status: 429 }
      );
    }

    const [verified, expenses, pendingUpi] = await Promise.all([
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: true,
        where: { status: "VERIFIED" },
      }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { mode: "UPI", status: "PENDING" },
      }),
    ]);

    const collected = verified._sum.amount ?? 0;
    const spent = expenses._sum.amount ?? 0;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const message = formatSummaryMessage({
      collected,
      donationCount: verified._count,
      spent,
      balance: collected - spent,
      pendingUpi: pendingUpi._sum.amount ?? 0,
      appUrl,
    });

    const sent = await sendTelegramMessage(message);
    if (!sent) {
      return NextResponse.json(
        { ok: false, error: "Telegram send failed — check TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID" },
        { status: 502 }
      );
    }

    lastSummarySentAt = Date.now();
    return NextResponse.json({ ok: true, data: { message } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
