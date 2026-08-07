import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public vanity counter — how many times Bappa has been tapped for a
// blessing on the homepage. Reuses the Counter table (row id "blessings").

export async function GET() {
  try {
    const counter = await prisma.counter.findUnique({
      where: { id: "blessings" },
    });
    return NextResponse.json({ ok: true, data: { value: counter?.value ?? 0 } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const counter = await prisma.counter.upsert({
      where: { id: "blessings" },
      update: { value: { increment: 1 } },
      create: { id: "blessings", value: 1 },
    });
    return NextResponse.json({ ok: true, data: { value: counter.value } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
