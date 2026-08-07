import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public but effectively donor-only: the receipt number is the capability —
// only someone holding the receipt link can light its diya. Idempotent.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ receiptNo: string }> }
) {
  try {
    const { receiptNo } = await params;
    const donation = await prisma.donation.findUnique({ where: { receiptNo } });
    if (!donation || donation.status === "REJECTED") {
      return NextResponse.json(
        { ok: false, error: "Receipt not found" },
        { status: 404 }
      );
    }

    if (!donation.diyaLit) {
      await prisma.donation.update({
        where: { receiptNo },
        data: { diyaLit: true },
      });
    }

    return NextResponse.json({ ok: true, data: { lit: true } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
