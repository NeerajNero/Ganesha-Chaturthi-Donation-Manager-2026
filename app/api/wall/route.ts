import { NextResponse } from "next/server";
import { getWallData } from "@/lib/public-data";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    const data = await getWallData(!!session);
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
