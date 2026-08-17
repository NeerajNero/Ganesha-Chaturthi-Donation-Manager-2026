import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createExpenseSchema } from "@/lib/validators";
import { istDayRange } from "@/lib/dates";
import { requireAdmin } from "@/lib/api/server-auth";

const SIZES = ["MINOR", "MID", "MAJOR"] as const;

export async function GET(req: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (!session) return error;

    const { searchParams } = new URL(req.url);
    const size = searchParams.get("size");
    const category = searchParams.get("category");
    const date = searchParams.get("date");

    const where: Prisma.ExpenseWhereInput = {};
    if (size && (SIZES as readonly string[]).includes(size)) {
      where.size = size as (typeof SIZES)[number];
    }
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      where.spentOn = istDayRange(date);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { spentOn: "desc" },
      include: { addedBy: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, data: expenses });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (!session) return error;

    const body = await req.json().catch(() => null);
    const parsed = createExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const expense = await prisma.expense.create({
      data: {
        title: input.title,
        category: input.category,
        size: input.size,
        amount: input.amount,
        receiptUrl: input.receiptUrl ?? null,
        notes: input.notes || null,
        ...(input.spentOn ? { spentOn: input.spentOn } : {}),
        addedById: session.id,
      },
      include: { addedBy: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, data: expense }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
