import { NextResponse } from "next/server";
import { getReceipt } from "@/lib/public-data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ receiptNo: string }> }
) {
  try {
    const { receiptNo } = await params;
    const receipt = await getReceipt(receiptNo);
    if (!receipt) {
      return NextResponse.json(
        { ok: false, error: "Receipt not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, data: receipt });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
