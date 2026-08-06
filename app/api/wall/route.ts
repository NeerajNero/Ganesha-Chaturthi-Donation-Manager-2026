import { NextResponse } from "next/server";
import { getWallData } from "@/lib/public-data";

export async function GET() {
  try {
    const data = await getWallData();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
