import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Per-street coverage across ALL volunteers — helps a volunteer pick which
// street to canvass next. Available to any logged-in user.
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const rows = await prisma.donation.groupBy({
      by: ["street"],
      where: { status: { not: "REJECTED" } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    });

    return NextResponse.json({
      ok: true,
      data: rows.map((r) => ({
        street: r.street,
        count: r._count,
        total: r._sum.amount ?? 0,
      })),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
