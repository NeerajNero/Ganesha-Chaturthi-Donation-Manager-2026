import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateDonationSchema } from "@/lib/validators";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = updateDonationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.findUnique({ where: { id } });
    if (!donation) {
      return NextResponse.json(
        { ok: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    const { status, cashDeposited } = parsed.data;
    if (status && donation.mode !== "UPI") {
      return NextResponse.json(
        { ok: false, error: "Cash donations are verified automatically" },
        { status: 400 }
      );
    }
    if (cashDeposited && donation.mode !== "CASH") {
      return NextResponse.json(
        { ok: false, error: "Only cash donations can be marked deposited" },
        { status: 400 }
      );
    }

    const updated = await prisma.donation.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(cashDeposited ? { cashDeposited } : {}),
      },
      include: { collectedBy: { select: { name: true } } },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
