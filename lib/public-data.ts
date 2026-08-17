import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Shared by the public API routes AND the public pages so the same rules
// apply everywhere: rejected receipts don't exist, anonymous donors are
// masked before data ever leaves the server.

export async function getReceipt(receiptNo: string) {
  const donation = await prisma.donation.findUnique({
    where: { receiptNo },
    select: {
      receiptNo: true,
      donorName: true,
      amount: true,
      mode: true,
      status: true,
      createdAt: true,
      diyaLit: true,
    },
  });
  if (!donation || donation.status === "REJECTED") return null;
  return donation;
}

export const ANONYMOUS_NAME = "A Well-Wisher";

// Cache setting reads for 60 s; busted immediately when admin toggles via
// revalidateTag("settings") in the PATCH /api/settings handler.
const getCachedSettings = unstable_cache(
  async () => {
    const { getSettingBool, SHOW_WALL_EXPENSES, DONATION_SECTION_VISIBLE } =
      await import("@/lib/settings");
    const [showExpenses, donationSectionVisible] = await Promise.all([
      getSettingBool(SHOW_WALL_EXPENSES, true),
      getSettingBool(DONATION_SECTION_VISIBLE, true),
    ]);
    return { showExpenses, donationSectionVisible };
  },
  ["settings"],
  { revalidate: 60, tags: ["settings"] }
);

export async function getWallData(isLoggedIn = false) {
  // All 6 DB queries run in parallel — litRows and topRows were previously
  // sequential after the main Promise.all.
  const [
    donations,
    total,
    expenses,
    expensesTotal,
    litRows,
    topRows,
  ] = await Promise.all([
    prisma.donation.findMany({
      where: { status: "VERIFIED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        donorName: true,
        anonymous: true,
        amount: true,
        street: true,
        createdAt: true,
      },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: "VERIFIED" },
    }),
    // Public-safe fields only — no notes, no admin names.
    prisma.expense.findMany({
      orderBy: { spentOn: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        category: true,
        amount: true,
        spentOn: true,
        receiptUrl: true,
      },
    }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    // Diyas lit by donors from their receipts (anonymous respected).
    prisma.donation.findMany({
      where: { status: "VERIFIED", diyaLit: true },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: { id: true, donorName: true, anonymous: true },
    }),
    // Top collectors leaderboard — volunteer first names + verified totals only.
    prisma.donation.groupBy({
      by: ["collectedById"],
      where: { status: "VERIFIED" },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    }),
  ]);

  const collectors = await prisma.user.findMany({
    where: { id: { in: topRows.map((r) => r.collectedById) } },
    select: { id: true, name: true },
  });
  const collectorName = new Map(collectors.map((c) => [c.id, c.name]));

  const grandTotal = total._sum.amount ?? 0;

  // Read settings from cache (60s TTL, busted on admin toggle).
  const { showExpenses, donationSectionVisible } = await getCachedSettings();
  const totalSpent = showExpenses ? (expensesTotal._sum.amount ?? 0) : null;
  const balance = totalSpent === null ? null : grandTotal - totalSpent;

  // When the visitor is not logged in, mask all real donor names as "A Well-Wisher".
  const maskName = (name: string) => (isLoggedIn ? name : ANONYMOUS_NAME);

  return {
    litDiyas: litRows.map((d) => ({
      id: d.id,
      name: d.anonymous ? ANONYMOUS_NAME : maskName(d.donorName),
    })),
    topCollectors: topRows.map((r) => ({
      id: r.collectedById,
      name: collectorName.get(r.collectedById) ?? "Volunteer",
      count: r._count,
      total: r._sum.amount ?? 0,
    })),
    grandTotal,
    totalSpent,
    balance,
    donationSectionVisible,
    donations: donations.map((d) => ({
      id: d.id,
      name: d.anonymous ? ANONYMOUS_NAME : maskName(d.donorName),
      amount: d.amount,
      street: d.street,
      createdAt: d.createdAt,
    })),
    expenses: showExpenses ? expenses : [],
  };
}
