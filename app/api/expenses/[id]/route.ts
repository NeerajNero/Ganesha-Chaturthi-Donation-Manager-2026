import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateExpenseSchema } from "@/lib/validators";

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      ),
    };
  }
  if (session.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { ok: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }
  return { session };
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (!session) return error;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = updateExpenseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Expense not found" },
        { status: 404 }
      );
    }

    const input = parsed.data;
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.size !== undefined ? { size: input.size } : {}),
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
        ...(input.receiptUrl !== undefined
          ? { receiptUrl: input.receiptUrl || null }
          : {}),
        ...(input.notes !== undefined ? { notes: input.notes || null } : {}),
        ...(input.spentOn !== undefined ? { spentOn: input.spentOn } : {}),
      },
      include: { addedBy: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, data: expense });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAdmin();
    if (!session) return error;

    const { id } = await params;
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Expense not found" },
        { status: 404 }
      );
    }

    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ ok: true, data: null });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
