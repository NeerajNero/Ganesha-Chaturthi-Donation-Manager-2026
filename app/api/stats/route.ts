import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { addDaysIST, istDateOf, istDayRange, todayIST } from "@/lib/dates";

// Money that "counts" is VERIFIED (cash is auto-verified; UPI once checked).
const VERIFIED = { status: "VERIFIED" as const };

export async function GET() {
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

    const [
      overall,
      today,
      byDonor,
      byMode,
      pendingUpi,
      undepositedCash,
      byVolunteer,
      users,
      blessingsCounter,
      expensesTotal,
      expensesByCategory,
    ] = await Promise.all([
      prisma.donation.aggregate({
        _sum: { amount: true },
        _count: true,
        where: VERIFIED,
      }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { ...VERIFIED, createdAt: istDayRange(todayIST()) },
      }),
      prisma.donation.groupBy({
        by: ["donorName"],
        where: VERIFIED,
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: "desc" } },
        take: 20,
      }),
      prisma.donation.groupBy({
        by: ["mode"],
        where: VERIFIED,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.donation.aggregate({
        _count: true,
        _sum: { amount: true },
        where: { mode: "UPI", status: "PENDING" },
      }),
      prisma.donation.groupBy({
        by: ["collectedById"],
        where: { ...VERIFIED, mode: "CASH", cashDeposited: false },
        _sum: { amount: true },
      }),
      prisma.donation.groupBy({
        by: ["collectedById"],
        where: VERIFIED,
        _sum: { amount: true },
        _count: true,
      }),
      prisma.user.findMany({ select: { id: true, name: true } }),
      prisma.counter.findUnique({ where: { id: "blessings" } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.expense.groupBy({
        by: ["category"],
        _sum: { amount: true },
        _count: true,
        orderBy: { _sum: { amount: "desc" } },
      }),
    ]);

    // Daily verified totals for the last 10 IST days (chart on the dashboard).
    const todayKey = todayIST();
    const dayKeys = Array.from({ length: 10 }, (_, i) =>
      addDaysIST(todayKey, i - 9)
    );
    const windowRows = await prisma.donation.findMany({
      where: { ...VERIFIED, createdAt: { gte: istDayRange(dayKeys[0]).gte } },
      select: { amount: true, createdAt: true },
    });
    const dailyTotals = new Map<string, number>();
    for (const row of windowRows) {
      const key = istDateOf(row.createdAt);
      dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + row.amount);
    }
    const daily = dayKeys.map((date) => ({
      date,
      total: dailyTotals.get(date) ?? 0,
    }));

    const nameById = new Map(users.map((u) => [u.id, u.name]));
    const cashInHandById = new Map(
      undepositedCash.map((r) => [r.collectedById, r._sum.amount ?? 0])
    );

    const totalCollected = overall._sum.amount ?? 0;
    const totalExpenses = expensesTotal._sum.amount ?? 0;

    const data = {
      totalCollected,
      donationCount: overall._count,
      blessings: blessingsCounter?.value ?? 0,
      daily,
      todayCollected: today._sum.amount ?? 0,
      totalExpenses,
      balance: totalCollected - totalExpenses,
      expensesByCategory: expensesByCategory.map((c) => ({
        category: c.category,
        count: c._count,
        total: c._sum.amount ?? 0,
      })),
      cashInHand: undepositedCash.reduce((s, r) => s + (r._sum.amount ?? 0), 0),
      pendingUpi: {
        count: pendingUpi._count,
        amount: pendingUpi._sum.amount ?? 0,
      },
      byMode: {
        CASH: byMode.find((m) => m.mode === "CASH")?._sum.amount ?? 0,
        UPI: byMode.find((m) => m.mode === "UPI")?._sum.amount ?? 0,
      },
      byDonor: byDonor.map((d) => ({
        donorName: d.donorName,
        count: d._count,
        total: d._sum.amount ?? 0,
      })),
      byVolunteer: byVolunteer
        .map((v) => ({
          id: v.collectedById,
          name: nameById.get(v.collectedById) ?? "Unknown",
          count: v._count,
          total: v._sum.amount ?? 0,
          cashInHand: cashInHandById.get(v.collectedById) ?? 0,
        }))
        .sort((a, b) => b.total - a.total),
    };

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
