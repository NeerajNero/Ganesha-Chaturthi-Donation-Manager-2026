import { prisma } from "@/lib/prisma";

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
    },
  });
  if (!donation || donation.status === "REJECTED") return null;
  return donation;
}

export const ANONYMOUS_NAME = "A Well-Wisher";

export async function getWallData() {
  const [donations, total, expenses, expensesTotal] = await Promise.all([
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
  ]);

  const grandTotal = total._sum.amount ?? 0;
  const totalSpent = expensesTotal._sum.amount ?? 0;

  return {
    grandTotal,
    totalSpent,
    balance: grandTotal - totalSpent,
    donations: donations.map((d) => ({
      id: d.id,
      name: d.anonymous ? ANONYMOUS_NAME : d.donorName,
      amount: d.amount,
      street: d.street,
      createdAt: d.createdAt,
    })),
    expenses,
  };
}
