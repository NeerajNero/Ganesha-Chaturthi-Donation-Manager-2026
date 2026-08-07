import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatSummaryMessage } from "@/lib/summary";

// In-memory guard — good enough per instance; serverless cold starts reset it.
let lastSummarySentAt = 0;
const MIN_INTERVAL_MS = 2 * 60 * 1000;

async function composeAndSendSummary(origin: string) {
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

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
}

// Admin-triggered from the dashboard.
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
    return await composeAndSendSummary(new URL(req.url).origin);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// Vercel Cron (vercel.json) — sends GET with `Authorization: Bearer <CRON_SECRET>`
// when the CRON_SECRET env var is set on the project.
export async function GET(req: Request) {
  try {
    const secret = process.env.CRON_SECRET;
    const auth = req.headers.get("authorization");
    if (!secret || auth !== `Bearer ${secret}`) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return await composeAndSendSummary(new URL(req.url).origin);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
