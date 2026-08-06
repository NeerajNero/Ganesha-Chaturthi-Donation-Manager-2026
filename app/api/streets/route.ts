import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Lightweight autocomplete source for the donation form (PLAN.md §7 item 2).
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Not logged in" },
        { status: 401 }
      );
    }

    const rows = await prisma.donation.findMany({
      distinct: ["street"],
      select: { street: true },
      orderBy: { street: "asc" },
    });

    return NextResponse.json({ ok: true, data: rows.map((r) => r.street) });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
