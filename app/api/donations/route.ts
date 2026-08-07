import { NextResponse, after } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createDonationSchema } from "@/lib/validators";
import { nextReceiptNo } from "@/lib/receipt";
import { formatDonationMessage, sendTelegramMessage } from "@/lib/telegram";
import { crossedMilestone, milestoneMessage } from "@/lib/milestones";
import { GOAL_AMOUNT } from "@/lib/config";

import { istDayRange } from "@/lib/dates";

const MODES = ["CASH", "UPI"] as const;
const STATUSES = ["PENDING", "VERIFIED", "REJECTED"] as const;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { active: true, name: true },
    });
    if (!user?.active) {
      return NextResponse.json(
        { ok: false, error: "This account has been deactivated" },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = createDonationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const status = input.mode === "CASH" ? "VERIFIED" : "PENDING";

    const donation = await prisma.$transaction(async (tx) => {
      const receiptNo = await nextReceiptNo(tx);
      return tx.donation.create({
        data: {
          receiptNo,
          donorName: input.donorName,
          mobile: input.mobile ?? null,
          street: input.street,
          houseNo: input.houseNo ?? null,
          amount: input.amount,
          mode: input.mode,
          status,
          screenshotUrl: input.screenshotUrl ?? null,
          anonymous: input.anonymous,
          collectedById: session.id,
        },
      });
    });

    // Fire-and-forget after the response — a Telegram failure must never
    // fail the donation.
    after(async () => {
      try {
        const total = await prisma.donation.aggregate({
          _sum: { amount: true },
          where: { status: { not: "REJECTED" } },
        });
        await sendTelegramMessage(
          formatDonationMessage({
            receiptNo: donation.receiptNo,
            amount: donation.amount,
            mode: donation.mode,
            status: donation.status,
            donorName: donation.donorName,
            street: donation.street,
            collectorName: user.name,
            totalSoFar: total._sum.amount ?? 0,
          })
        );

        // Cash counts as verified immediately — check for a goal milestone.
        if (donation.status === "VERIFIED") {
          const verified = await prisma.donation.aggregate({
            _sum: { amount: true },
            where: { status: "VERIFIED" },
          });
          const verifiedTotal = verified._sum.amount ?? 0;
          const milestone = crossedMilestone(
            verifiedTotal - donation.amount,
            verifiedTotal,
            GOAL_AMOUNT
          );
          if (milestone) {
            const appUrl =
              process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
            await sendTelegramMessage(
              milestoneMessage(milestone, verifiedTotal, GOAL_AMOUNT, appUrl)
            );
          }
        }
      } catch {
        // best-effort only
      }
    });

    return NextResponse.json({ ok: true, data: donation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const street = searchParams.get("street");
    const mode = searchParams.get("mode");
    const status = searchParams.get("status");
    const volunteerId = searchParams.get("volunteerId");
    const date = searchParams.get("date");

    const where: Prisma.DonationWhereInput = {};

    if (session.role === "VOLUNTEER") {
      where.collectedById = session.id;
    } else if (volunteerId) {
      where.collectedById = volunteerId;
    }

    if (street) where.street = { contains: street, mode: "insensitive" };
    if (mode && (MODES as readonly string[]).includes(mode)) {
      where.mode = mode as (typeof MODES)[number];
    }
    if (status && (STATUSES as readonly string[]).includes(status)) {
      where.status = status as (typeof STATUSES)[number];
    }
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      where.createdAt = istDayRange(date);
    }

    const donations = await prisma.donation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { collectedBy: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, data: donations });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
